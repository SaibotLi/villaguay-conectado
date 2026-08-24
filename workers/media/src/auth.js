/**
 * Módulo de validación de Firebase Authentication ID Token en Cloudflare Workers.
 *
 * Utiliza la API nativa Web Crypto de V8 para verificar tokens JWT firmados con RS256
 * contra los certificados públicos de Google Identity Toolkit (JWKS).
 */

const GOOGLE_JWKS_URL =
  'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'

// Caché en memoria para las claves públicas JWK de Google
let cachedKeys = null
let cacheExpiresAt = 0

/**
 * Convierte un string Base64URL a Base64 estándar.
 */
function base64UrlToBase64(base64Url) {
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  while (base64.length % 4 !== 0) {
    base64 += '='
  }
  return base64
}

/**
 * Convierte un string Base64URL a Uint8Array.
 */
function base64UrlToUint8Array(base64Url) {
  const binaryString = atob(base64UrlToBase64(base64Url))
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes
}

/**
 * Decodifica una parte Base64URL de un JWT a objeto JSON.
 */
function parseJwtPart(partBase64Url) {
  try {
    const jsonString = decodeURIComponent(
      escape(atob(base64UrlToBase64(partBase64Url)))
    )
    return JSON.parse(jsonString)
  } catch {
    return null
  }
}

/**
 * Obtiene las claves públicas JWK de Google para verificar tokens de Firebase.
 * Implementa caché para evitar solicitudes HTTP repetitivas en cada upload.
 */
async function getGooglePublicKeys() {
  const now = Date.now()
  if (cachedKeys && now < cacheExpiresAt) {
    return cachedKeys
  }

  const response = await fetch(GOOGLE_JWKS_URL, {
    cf: {
      cacheTtl: 3600,
      cacheEverything: true,
    },
  })

  if (!response.ok) {
    throw new Error('No se pudieron obtener las claves públicas de Google para verificar el token.')
  }

  // Leer header Cache-Control para determinar expiración de caché
  const cacheControl = response.headers.get('cache-control')
  let maxAge = 3600
  if (cacheControl) {
    const match = cacheControl.match(/max-age=(\d+)/)
    if (match) {
      maxAge = parseInt(match[1], 10)
    }
  }

  const data = await response.json()
  cachedKeys = data.keys || []
  cacheExpiresAt = now + maxAge * 1000

  return cachedKeys
}

/**
 * Valida un Firebase ID Token enviado en la cabecera Authorization: Bearer <token>.
 *
 * @param {string} authHeader - Valor de la cabecera Authorization
 * @param {string} projectId - Firebase Project ID (ej: 'villaguay-conectado')
 * @returns {Promise<{ uid: string, email?: string, name?: string }>} Datos del usuario autenticado
 */
export async function verifyFirebaseToken(authHeader, projectId) {
  if (!authHeader || typeof authHeader !== 'string') {
    throw new Error('Cabecera Authorization no provista.')
  }

  const parts = authHeader.trim().split(' ')
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    throw new Error('Formato de autorización inválido. Debe ser: Bearer <token>.')
  }

  const token = parts[1]
  const tokenSegments = token.split('.')
  if (tokenSegments.length !== 3) {
    throw new Error('Token JWT con estructura inválida.')
  }

  const [headerBase64, payloadBase64, signatureBase64] = tokenSegments

  const header = parseJwtPart(headerBase64)
  const payload = parseJwtPart(payloadBase64)

  if (!header || !payload) {
    throw new Error('No se pudo decodificar el contenido del token.')
  }

  if (header.alg !== 'RS256') {
    throw new Error(`Algoritmo no soportado: ${header.alg}. Se esperaba RS256.`)
  }

  if (!header.kid) {
    throw new Error('El token no contiene el identificador de clave (kid).')
  }

  // 1. Validar claims del Payload
  const nowInSeconds = Math.floor(Date.now() / 1000)

  if (payload.aud !== projectId) {
    throw new Error(`Token emitido para un proyecto distinto (${payload.aud}). Esperado: ${projectId}.`)
  }

  const expectedIssuer = `https://securetoken.google.com/${projectId}`
  if (payload.iss !== expectedIssuer) {
    throw new Error(`Emisor del token inválido (${payload.iss}).`)
  }

  if (!payload.sub || typeof payload.sub !== 'string') {
    throw new Error('El token no contiene un identificador de usuario válido (sub).')
  }

  if (payload.exp && payload.exp < nowInSeconds) {
    throw new Error('El token de autenticación ha expirado.')
  }

  if (payload.auth_time && payload.auth_time > nowInSeconds + 300) {
    throw new Error('Fecha de autenticación en el futuro.')
  }

  // 2. Obtener la clave pública correspondiente
  const publicKeys = await getGooglePublicKeys()
  const matchingJwk = publicKeys.find((key) => key.kid === header.kid)

  if (!matchingJwk) {
    throw new Error('No se encontró una clave pública de Google que coincida con el token.')
  }

  // 3. Importar clave y verificar firma criptográfica con Web Crypto API
  const cryptoKey = await crypto.subtle.importKey(
    'jwk',
    matchingJwk,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['verify']
  )

  const signatureBytes = base64UrlToUint8Array(signatureBase64)
  const signedData = new TextEncoder().encode(`${headerBase64}.${payloadBase64}`)

  const isSignatureValid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    signatureBytes,
    signedData
  )

  if (!isSignatureValid) {
    throw new Error('Firma criptográfica del token inválida.')
  }

  return {
    uid: payload.sub,
    email: payload.email || '',
    name: payload.name || '',
  }
}

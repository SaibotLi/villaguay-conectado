/**
 * Cloudflare Worker: API de Media para VillaguayConectado.
 *
 * Administra tanto la carga autenticada como la entrega pública segura de flyers
 * manteniendo el bucket de Cloudflare R2 100% privado.
 *
 * Flujo: React -> Worker -> R2 (para subida y para lectura).
 */

import { verifyFirebaseToken } from './auth.js'
import { validateImageFile } from './validator.js'

/**
 * Genera los encabezados CORS según el origen de la solicitud.
 * Si el Origin no está permitido o no viene presente, no devuelve Access-Control-Allow-Origin
 * para evitar políticas CORS engañosas o permisivas por fallback.
 */
function getCorsHeaders(request, env) {
  const origin = request.headers.get('Origin')
  if (!origin) {
    return {}
  }

  const allowedOriginsStr = env.ALLOWED_ORIGINS || 'http://localhost:5173'
  const allowedOrigins = allowedOriginsStr
    .split(',')
    .map((item) => item.trim().toLowerCase())

  const isAllowed = allowedOrigins.includes(origin.toLowerCase())
  if (!isAllowed) {
    return {}
  }

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': '86400',
  }
}

/**
 * Responde una respuesta JSON estandarizada con encabezados CORS.
 */
function jsonResponse(data, status, corsHeaders) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...corsHeaders,
    },
  })
}

export default {
  async fetch(request, env) {
    const corsHeaders = getCorsHeaders(request, env)
    const url = new URL(request.url)
    const method = request.method.toUpperCase()

    // 1. Manejo de preflight CORS (OPTIONS)
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      })
    }

    // 2. Health check
    if (method === 'GET' && url.pathname === '/health') {
      return jsonResponse(
        {
          status: 'ok',
          service: 'villaguay-media-api',
          timestamp: new Date().toISOString(),
        },
        200,
        corsHeaders
      )
    }

    // 3. Endpoint de subida: POST /upload
    if (method === 'POST' && url.pathname === '/upload') {
      try {
        // A. Validar Firebase ID Token
        const authHeader = request.headers.get('Authorization')
        const firebaseProjectId = env.FIREBASE_PROJECT_ID || 'villaguay-conectado'

        let authenticatedUser
        try {
          authenticatedUser = await verifyFirebaseToken(authHeader, firebaseProjectId)
        } catch (authError) {
          return jsonResponse(
            {
              success: false,
              error: authError.message || 'No autorizado para subir imágenes.',
            },
            401,
            corsHeaders
          )
        }

        // B. Validar R2 Binding
        if (!env.MEDIA_BUCKET) {
          return jsonResponse(
            {
              success: false,
              error: 'El binding MEDIA_BUCKET de Cloudflare R2 no se encuentra configurado.',
            },
            500,
            corsHeaders
          )
        }

        // C. Leer FormData y validar archivo
        let formData
        try {
          formData = await request.formData()
        } catch {
          return jsonResponse(
            {
              success: false,
              error: 'El cuerpo de la solicitud debe ser multipart/form-data válido.',
            },
            400,
            corsHeaders
          )
        }

        const file = formData.get('file') || formData.get('image')
        const validation = validateImageFile(file)

        // D. Generar identificador único y estructura de clave en R2: events/<uuid>.<ext>
        const fileUuid = crypto.randomUUID()
        const objectKey = `events/${fileUuid}.${validation.extension}`

        // E. Subir a Cloudflare R2
        const fileBuffer = await file.arrayBuffer()
        await env.MEDIA_BUCKET.put(objectKey, fileBuffer, {
          httpMetadata: {
            contentType: validation.mimeType,
          },
          customMetadata: {
            uploadedBy: authenticatedUser.uid,
            originalName: file.name || '',
            uploadedAt: new Date().toISOString(),
          },
        })

        // F. Construir URL pública apuntando al propio Worker
        // Se genera la URL absoluta basada en el origen del Worker (/events/<key>)
        const workerOrigin = env.WORKER_PUBLIC_URL?.replace(/\/$/, '') || url.origin
        const publicUrl = `${workerOrigin}/${objectKey}`

        return jsonResponse(
          {
            success: true,
            key: objectKey,
            url: publicUrl,
            size: validation.size,
            type: validation.mimeType,
            uploadedBy: authenticatedUser.uid,
          },
          201,
          corsHeaders
        )
      } catch (uploadError) {
        return jsonResponse(
          {
            success: false,
            error: uploadError.message || 'Error inesperado durante la carga de la imagen.',
          },
          400,
          corsHeaders
        )
      }
    }

    // 4. Endpoint de lectura pública: GET /events/<objectKey>
    if (method === 'GET' && url.pathname.startsWith('/events/')) {
      if (!env.MEDIA_BUCKET) {
        return jsonResponse(
          {
            success: false,
            error: 'El binding MEDIA_BUCKET de Cloudflare R2 no se encuentra configurado.',
          },
          500,
          corsHeaders
        )
      }

      // La clave del objeto es todo el pathname sin el slash inicial (ej: "events/uuid.jpg")
      const objectKey = url.pathname.slice(1)

      // Evitar path traversal o caracteres extraños
      if (!/^events\/[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/i.test(objectKey)) {
        return jsonResponse(
          {
            success: false,
            error: 'Formato de clave de imagen no válido.',
          },
          400,
          corsHeaders
        )
      }

      const object = await env.MEDIA_BUCKET.get(objectKey)

      if (!object) {
        return jsonResponse(
          {
            success: false,
            error: 'Imagen no encontrada.',
          },
          404,
          corsHeaders
        )
      }

      const headers = new Headers()
      object.writeHttpMetadata(headers)
      headers.set('etag', object.httpEtag)

      // Los archivos son inmutables (UUID único), se cachean por 1 año
      headers.set('Cache-Control', 'public, max-age=31536000, immutable')

      // Aplicar CORS headers si corresponde
      Object.entries(corsHeaders).forEach(([key, val]) => {
        headers.set(key, val)
      })

      return new Response(object.body, {
        headers,
        status: 200,
      })
    }

    // 5. Ruta no encontrada
    return jsonResponse(
      {
        success: false,
        error: 'Ruta no encontrada.',
      },
      404,
      corsHeaders
    )
  },
}

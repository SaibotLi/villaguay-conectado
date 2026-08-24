import { getCurrentUserToken } from './authService'

const MEDIA_WORKER_URL =
	import.meta.env.VITE_MEDIA_WORKER_URL || 'https://villaguay-media-api.tobil8485.workers.dev'

/**
 * Sube un archivo de flyer al Cloudflare Worker autenticado mediante Firebase ID Token.
 *
 * @param {File} file - Archivo de imagen seleccionado por el usuario (JPEG, PNG o WebP <= 5 MB).
 * @returns {Promise<{ url: string, key: string, size: number, type: string }>} Objeto con los datos de la imagen subida.
 */
async function uploadEventImage(file) {
	if (!file) {
		throw new Error('No se ha proporcionado ningún archivo de imagen para subir.')
	}

	// 1. Obtiene el ID Token mediante el servicio de autenticación
	const idToken = await getCurrentUserToken()

	// 2. Prepara el FormData
	const formData = new FormData()
	formData.append('file', file)

	// 3. Envía la solicitud al Cloudflare Worker
	const uploadEndpoint = `${MEDIA_WORKER_URL.replace(/\/$/, '')}/upload`

	let response
	try {
		response = await fetch(uploadEndpoint, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${idToken}`,
			},
			body: formData,
		})
	} catch {
		throw new Error('No se pudo conectar con el servidor de medios. Verificá tu conexión.')
	}

	let result
	try {
		result = await response.json()
	} catch {
		throw new Error('Respuesta inválida recibida desde el servidor de medios.')
	}

	if (!response.ok || !result.success) {
		throw new Error(result?.error || `Error al subir la imagen (código ${response.status}).`)
	}

	return result
}

export { uploadEventImage }

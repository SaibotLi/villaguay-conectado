/**
 * Módulo de validación de archivos de imagen para VillaguayConectado.
 */

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

export const ALLOWED_MIME_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

/**
 * Valida un archivo antes de almacenarlo en Cloudflare R2.
 *
 * @param {File} file - Objeto File obtenido de FormData
 * @returns {{ extension: string }} Información validada del archivo
 */
export function validateImageFile(file) {
  if (!file || typeof file === 'string') {
    throw new Error('No se ha proporcionado ningún archivo de imagen.')
  }

  if (file.size === 0) {
    throw new Error('El archivo de imagen se encuentra vacío.')
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `El archivo excede el tamaño máximo permitido de 5 MB (tamaño actual: ${(file.size / (1024 * 1024)).toFixed(2)} MB).`
    )
  }

  const mimeType = file.type?.toLowerCase()
  const extension = ALLOWED_MIME_TYPES[mimeType]

  if (!extension) {
    throw new Error(
      `Formato de imagen no soportado (${mimeType || 'desconocido'}). Solo se aceptan JPEG, PNG y WebP.`
    )
  }

  return {
    extension,
    mimeType,
    size: file.size,
  }
}

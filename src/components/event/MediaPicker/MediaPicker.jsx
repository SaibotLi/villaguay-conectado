import { useEffect, useRef, useState } from 'react'
import Button from '../../ui/Button/Button'
import styles from './MediaPicker.module.css'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function MediaPicker({
  currentImageUrl = '',
  selectedFile = null,
  onFileSelect,
  onRemoveExisting,
  disabled = false,
  uploadStatusMessage = '',
}) {
  const fileInputRef = useRef(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [localError, setLocalError] = useState('')

  // Limpieza de ObjectURL al desmontar o cambiar la URL para evitar fugas de memoria
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  function handleOpenSelector() {
    if (disabled) return
    setLocalError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
      fileInputRef.current.click()
    }
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    setLocalError('')

    // 1. Validar tipo MIME
    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      setLocalError('Formato no soportado. Seleccioná una imagen en formato JPG, PNG o WebP.')
      return
    }

    // 2. Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      setLocalError(
        `El archivo supera el tamaño máximo de 5 MB (${formatFileSize(file.size)}).`
      )
      return
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    onFileSelect(file)
  }

  function handleCancelNewSelection() {
    setLocalError('')
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setPreviewUrl('')
    onFileSelect(null)
  }

  const hasNewFile = Boolean(selectedFile && previewUrl)
  const hasExistingImage = Boolean(currentImageUrl && !hasNewFile)

  return (
    <div className={styles.container}>
      <label className={styles.label}>Flyer del evento (opcional)</label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className={styles.hiddenInput}
        tabIndex={-1}
        aria-hidden="true"
        disabled={disabled}
      />

      {/* ESTADO A: Nuevo archivo local seleccionado */}
      {hasNewFile && (
        <div className={styles.previewCard}>
          <div className={styles.previewMedia}>
            <img
              src={previewUrl}
              alt="Vista previa del nuevo flyer"
              className={styles.previewImage}
            />
            <span className={styles.previewBadge}>Nuevo flyer seleccionado</span>
          </div>

          <div className={styles.previewMeta}>
            <span className={styles.fileName}>{selectedFile.name}</span>
            <span className={styles.fileSize}>{formatFileSize(selectedFile.size)}</span>
          </div>

          <div className={styles.actionsRow}>
            <Button
              type="button"
              variant="secondary"
              onClick={handleOpenSelector}
              disabled={disabled}
            >
              Cambiar imagen
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancelNewSelection}
              disabled={disabled}
            >
              Cancelar selección
            </Button>
          </div>
        </div>
      )}

      {/* ESTADO B: Imagen existente en el evento (sin nuevo archivo) */}
      {hasExistingImage && (
        <div className={styles.previewCard}>
          <div className={styles.previewMedia}>
            <img
              src={currentImageUrl}
              alt="Flyer actual del evento"
              className={styles.previewImage}
            />
            <span className={styles.previewBadge}>Flyer actual</span>
          </div>

          <div className={styles.actionsRow}>
            <Button
              type="button"
              variant="secondary"
              onClick={handleOpenSelector}
              disabled={disabled}
            >
              Reemplazar flyer
            </Button>
            {onRemoveExisting && (
              <Button
                type="button"
                variant="danger"
                onClick={onRemoveExisting}
                disabled={disabled}
              >
                Quitar flyer
              </Button>
            )}
          </div>
        </div>
      )}

      {/* ESTADO C: Sin imagen ni archivo seleccionado */}
      {!hasNewFile && !hasExistingImage && (
        <div className={`${styles.pickerBox} ${disabled ? styles.disabled : ''}`}>
          <div className={styles.iconContainer}>
            <svg
              className={styles.icon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>

          <div className={styles.infoText}>
            <p className={styles.prompt}>¿Tenés un flyer o imagen para este evento?</p>
            <p className={styles.hint}>JPG, PNG o WebP (máximo 5 MB)</p>
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={handleOpenSelector}
            disabled={disabled}
          >
            Seleccionar flyer
          </Button>
        </div>
      )}

      {uploadStatusMessage ? (
        <p className={styles.hint}>{uploadStatusMessage}</p>
      ) : null}

      {localError ? <p className={styles.errorText}>{localError}</p> : null}
    </div>
  )
}

export default MediaPicker

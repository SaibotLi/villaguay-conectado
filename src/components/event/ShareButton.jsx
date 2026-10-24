import { useState } from 'react'
import { Share2 } from 'lucide-react'
import Button from '../ui/Button/Button'
import Icon from '../ui/Icon/Icon'
import styles from './ShareButton.module.css'

function ShareButton({ title, eventId }) {
  const [feedbackMessage, setFeedbackMessage] = useState('')

  async function handleShare() {
    const eventUrl = `${window.location.origin}/eventos/${eventId}`

    setFeedbackMessage('')

    // Prioriza la API nativa de compartir cuando está disponible.
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: eventUrl,
        })
        return
      } catch (err) {
        if (err?.name === 'AbortError') {
          // El usuario canceló la acción de compartir de forma normal.
          return
        }
        // Si ocurrió otro error, continúa al fallback del portapapeles.
      }
    }

    // Usa el portapapeles como alternativa cuando no hay Web Share API o falla.
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(eventUrl)
        setFeedbackMessage('Enlace copiado al portapapeles.')
      } else {
        setFeedbackMessage('No se pudo copiar el enlace automáticamente.')
      }
    } catch {
      setFeedbackMessage('No se pudo copiar el enlace en este navegador.')
    }
  }

  return (
    <div className={styles.container}>
      <Button type="button" variant="secondary" onClick={handleShare}>
        <Icon icon={Share2} size={16} />
        Compartir evento
      </Button>
      {feedbackMessage ? (
        <p className={styles.feedback} role="status" aria-live="polite">
          {feedbackMessage}
        </p>
      ) : null}
    </div>
  )
}

export default ShareButton

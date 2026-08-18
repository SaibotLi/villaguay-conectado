import { useState } from 'react'
import Button from '../ui/Button/Button'
import styles from './ShareButton.module.css'

function ShareButton({ title, eventId }) {
  const [feedbackMessage, setFeedbackMessage] = useState('')

  async function handleShare() {
    const eventUrl = `${window.location.origin}/eventos/${eventId}`

    setFeedbackMessage('')

    // Prioriza la API nativa de compartir cuando esta disponible.
    if (navigator.share) {
      await navigator.share({
        title,
        url: eventUrl,
      })
      return
    }

    // Usa el portapapeles como alternativa cuando no hay Web Share API.
    await navigator.clipboard.writeText(eventUrl)
    setFeedbackMessage('Enlace copiado al portapapeles.')
  }

  return (
    <div className={styles.container}>
      <Button type="button" variant="secondary" onClick={handleShare}>
        Compartir evento
      </Button>
      {feedbackMessage ? <p className={styles.feedback}>{feedbackMessage}</p> : null}
    </div>
  )
}

export default ShareButton

import { useState } from 'react'
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
      <button type="button" className={styles.button} onClick={handleShare}>
        Compartir evento
      </button>
      {feedbackMessage ? <p className={styles.feedback}>{feedbackMessage}</p> : null}
    </div>
  )
}

export default ShareButton

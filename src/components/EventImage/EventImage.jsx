import { useState } from 'react'
import EventPlaceholder from '../EventPlaceholder/EventPlaceholder'
import styles from './EventImage.module.css'

function EventImage({ event }) {
  const [failedUrl, setFailedUrl] = useState(null)
  const imageUrl = event?.imageUrl?.trim() || ''

  const isFailed = failedUrl === imageUrl
  const shouldShowImage = Boolean(imageUrl) && !isFailed

  return (
    <div className={styles.media}>
      {/* Centraliza la decision de mostrar imagen real o placeholder institucional con fallback en caso de error */}
      {shouldShowImage ? (
        <img
          src={imageUrl}
          alt={`Flyer de ${event?.title || 'evento'}`}
          className={styles.image}
          loading="lazy"
          onError={() => setFailedUrl(imageUrl)}
        />
      ) : (
        <EventPlaceholder
          title={event?.title || ''}
          date={event?.date || ''}
          time={event?.time || ''}
        />
      )}
    </div>
  )
}

export default EventImage

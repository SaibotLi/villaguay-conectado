import { useState } from 'react'
import { ZoomIn } from 'lucide-react'
import Icon from '../ui/Icon/Icon'
import EventPlaceholder from '../EventPlaceholder/EventPlaceholder'
import styles from './EventImage.module.css'

function EventImage({ event, onExpand }) {
  const [failedUrl, setFailedUrl] = useState(null)
  const imageUrl = event?.imageUrl?.trim() || ''

  const isFailed = failedUrl === imageUrl
  const shouldShowImage = Boolean(imageUrl) && !isFailed

  return (
    <div className={styles.media}>
      {shouldShowImage ? (
        <div className={styles.imageWrapper}>
          <img
            src={imageUrl}
            alt={`Flyer de ${event?.title || 'evento'}`}
            className={styles.image}
            loading="lazy"
            onError={() => setFailedUrl(imageUrl)}
            onClick={onExpand}
            style={onExpand ? { cursor: 'pointer' } : undefined}
          />
          {onExpand ? (
            <button
              type="button"
              className={styles.expandButton}
              onClick={onExpand}
              aria-label={`Ampliar flyer de ${event?.title || 'evento'}`}
              title="Ampliar flyer"
            >
              <Icon icon={ZoomIn} size={15} />
              <span>Ampliar</span>
            </button>
          ) : null}
        </div>
      ) : (
        <EventPlaceholder />
      )}
    </div>
  )
}

export default EventImage

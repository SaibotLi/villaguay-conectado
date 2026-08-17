import EventPlaceholder from '../EventPlaceholder/EventPlaceholder'
import styles from './EventImage.module.css'

function EventImage({ event }) {
  const hasImage = Boolean(event.imageUrl?.trim())

  return (
    <div className={styles.media}>
      {/* Centraliza la decision de mostrar imagen real o placeholder institucional. */}
      {hasImage ? (
        <img src={event.imageUrl} alt={`Flyer de ${event.title}`} className={styles.image} />
      ) : (
        <EventPlaceholder title={event.title} date={event.date} time={event.time} />
      )}
    </div>
  )
}

export default EventImage

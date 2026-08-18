import { Link } from 'react-router-dom'
import EventImage from '../EventImage/EventImage'
import Button from '../ui/Button/Button'
import styles from './EventCard.module.css'

function EventCard({ event }) {
  return (
    <article className={styles.card}>
      <EventImage event={event} />
      <div className={styles.content}>
        <h3 className={styles.title}>{event.title}</h3>
        <p className={styles.description}>{event.description}</p>
        <p className={styles.meta}>📅 {event.date} · {event.time}</p>
        <p className={styles.meta}>📍 {event.location}</p>
        <Button
          as={Link}
          to={`/eventos/${event.id}`}
          variant="ghost"
          className={styles.detailButton}
        >
          Ver detalle →
        </Button>
      </div>
    </article>
  )
}

export default EventCard

import { Link } from 'react-router-dom'
import EventImage from '../EventImage/EventImage'
import Badge from '../ui/Badge/Badge'
import Button from '../ui/Button/Button'
import { formatDisplayDate } from '../../utils/dateUtils'
import styles from './AdminCard.module.css'

function AdminPublishedEventCard({ event, onDelete }) {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <EventImage event={event} />
      </div>

      <div className={styles.headerRow}>
        <h3 className={styles.title}>{event.title}</h3>
        <Badge variant="approved">Publicado</Badge>
      </div>

      <div className={styles.metaGroup}>
        <p className={styles.meta}>📅 {formatDisplayDate(event.date)} · {event.time}</p>
        <p className={styles.meta}>📍 {event.location}</p>
      </div>

      <div className={styles.actions}>
        <Button as={Link} to={`/admin/eventos/${event.id}/editar`} variant="secondary">
          Editar
        </Button>
        <Button type="button" variant="danger" onClick={() => onDelete(event.id)}>
          Eliminar
        </Button>
      </div>
    </article>
  )
}

export default AdminPublishedEventCard

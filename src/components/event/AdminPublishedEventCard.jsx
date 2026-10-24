import { Link } from 'react-router-dom'
import { Calendar, MapPin } from 'lucide-react'
import EventImage from '../EventImage/EventImage'
import Badge from '../ui/Badge/Badge'
import Button from '../ui/Button/Button'
import Icon from '../ui/Icon/Icon'
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
        <p className={styles.meta}>
          <Icon icon={Calendar} size={15} />
          <span>{formatDisplayDate(event.date)} · {event.time}</span>
        </p>
        <p className={styles.meta}>
          <Icon icon={MapPin} size={15} />
          <span>{event.location}</span>
        </p>
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

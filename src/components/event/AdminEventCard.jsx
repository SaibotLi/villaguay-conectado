import { Calendar, MapPin } from 'lucide-react'
import EventImage from '../EventImage/EventImage'
import Badge from '../ui/Badge/Badge'
import Button from '../ui/Button/Button'
import Icon from '../ui/Icon/Icon'
import { formatDisplayDate } from '../../utils/dateUtils'
import styles from './AdminCard.module.css'

function AdminEventCard({ event, onApprove, onReject }) {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <EventImage event={event} />
      </div>

      <div className={styles.headerRow}>
        <h3 className={styles.title}>{event.title}</h3>
        <Badge variant="pending">Pendiente</Badge>
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
        <Button type="button" variant="accent" onClick={() => onApprove(event.id)}>
          Aprobar
        </Button>
        <Button type="button" variant="danger" onClick={() => onReject(event.id)}>
          Rechazar
        </Button>
      </div>
    </article>
  )
}

export default AdminEventCard

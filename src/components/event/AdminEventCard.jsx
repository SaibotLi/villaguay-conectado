import Badge from '../ui/Badge/Badge'
import Button from '../ui/Button/Button'
import styles from './AdminCard.module.css'

function AdminEventCard({ event, onApprove, onReject }) {
  return (
    <article className={styles.card}>
      <div className={styles.headerRow}>
        <h3 className={styles.title}>{event.title}</h3>
        <Badge variant="pending">Pendiente</Badge>
      </div>

      <div className={styles.metaGroup}>
        <p className={styles.meta}>📅 {event.date} · {event.time}</p>
        <p className={styles.meta}>📍 {event.location}</p>
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

import styles from './AdminEventCard.module.css'

function AdminEventCard({ event, onApprove, onReject }) {
  return (
    <article className={styles.card}>
      <h2 className={styles.title}>{event.title}</h2>
      <p className={styles.meta}>Ubicacion: {event.location}</p>
      <p className={styles.meta}>Fecha: {event.date}</p>
      <p className={styles.meta}>Hora: {event.time}</p>
      <p className={styles.meta}>Estado: {event.status}</p>
      <div className={styles.actions}>
        <button type="button" className={styles.approveButton} onClick={() => onApprove(event.id)}>
          Aprobar
        </button>
        <button type="button" className={styles.rejectButton} onClick={() => onReject(event.id)}>
          Rechazar
        </button>
      </div>
    </article>
  )
}

export default AdminEventCard

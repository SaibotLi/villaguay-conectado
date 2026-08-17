import styles from './AdminPublishedEventCard.module.css'

function AdminPublishedEventCard({ event, onDelete }) {
  return (
    <article className={styles.card}>
      <h2 className={styles.title}>{event.title}</h2>
      <p className={styles.meta}>Ubicacion: {event.location}</p>
      <p className={styles.meta}>Fecha: {event.date}</p>
      <p className={styles.meta}>Hora: {event.time}</p>
      <div className={styles.actions}>
        <button type="button" className={styles.deleteButton} onClick={() => onDelete(event.id)}>
          Eliminar
        </button>
      </div>
    </article>
  )
}

export default AdminPublishedEventCard

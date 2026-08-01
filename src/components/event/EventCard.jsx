import { Link } from 'react-router-dom'
import styles from './EventCard.module.css'

function EventCard({ event }) {
  return (
    <article className={styles.card}>
      <h2 className={styles.title}>{event.title}</h2>
      <p className={styles.description}>{event.description}</p>
      <p className={styles.meta}>Ubicacion: {event.location}</p>
      <p className={styles.meta}>Fecha: {event.date}</p>
      <p className={styles.meta}>Hora: {event.time}</p>
      {/* Deja preparada la navegacion al detalle para la siguiente iteracion. */}
      <Link to={`/eventos/${event.id}`} className={styles.detailButton}>
        Ver detalle
      </Link>
    </article>
  )
}

export default EventCard

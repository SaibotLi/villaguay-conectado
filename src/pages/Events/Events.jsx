import styles from './Events.module.css'
import { useEvents } from '../../hooks/useEvents'
import EventCard from '../../components/event/EventCard'

function Events() {
  const { events, loading, error } = useEvents()

  if (loading) {
    return (
      <section className={styles.page}>
        <h1>Eventos</h1>
        <p className={styles.message}>Cargando eventos...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className={styles.page}>
        <h1>Eventos</h1>
        <p className={styles.message}>Ocurrio un problema al cargar los eventos. Intenta nuevamente en unos minutos.</p>
      </section>
    )
  }

  if (events.length === 0) {
    return (
      <section className={styles.page}>
        <h1>Eventos</h1>
        <p className={styles.message}>No hay eventos disponibles.</p>
      </section>
    )
  }

  return (
    <section className={styles.page}>
      <h1>Eventos</h1>
      <ul className={styles.list}>
        {events.map((event) => (
          <li key={event.id} className={styles.item}>
            <EventCard event={event} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Events

import styles from './Events.module.css'
import { useEvents } from '../../hooks/useEvents'
import EventCard from '../../components/event/EventCard'

function Events() {
  const { events, loading, error } = useEvents()

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1>Eventos</h1>
        <p className={styles.subtitle}>Descubri todo lo que esta pasando en Villaguay.</p>
      </header>

      {loading && <p className={styles.message}>Cargando eventos...</p>}

      {!loading && error && (
        <p className={styles.message}>
          Ocurrio un problema al cargar los eventos. Intenta nuevamente en unos minutos.
        </p>
      )}

      {!loading && !error && events.length === 0 && (
        <p className={styles.message}>Todavia no hay eventos disponibles. Volve pronto.</p>
      )}

      {!loading && !error && events.length > 0 && (
        <ul className={styles.list}>
          {events.map((event) => (
            <li key={event.id} className={styles.item}>
              <EventCard event={event} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default Events

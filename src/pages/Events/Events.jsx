import styles from './Events.module.css'
import { useEvents } from '../../hooks/useEvents'
import EventCard from '../../components/event/EventCard'

function Events() {
  const { events, loading, error } = useEvents()

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1>Eventos</h1>
        <p className={styles.subtitle}>Descubrí todo lo que está pasando en Villaguay.</p>
      </header>

      {loading && <p className={styles.message}>Cargando eventos...</p>}

      {!loading && error && (
        <p className={styles.message}>
          Ocurrió un problema al cargar los eventos. Intentá nuevamente en unos minutos.
        </p>
      )}

      {!loading && !error && events.length === 0 && (
        <p className={styles.message}>Todavía no hay eventos disponibles. Volvé pronto.</p>
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

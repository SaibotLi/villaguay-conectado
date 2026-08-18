import EventCard from '../../components/event/EventCard'
import useAuth from '../../hooks/useAuth'
import { useMyInterests } from '../../hooks/useMyInterests'
import EmptyState from '../../components/ui/EmptyState/EmptyState'
import styles from './MyInterests.module.css'

function MyInterests() {
  const { user } = useAuth()
  const { events, loading, error } = useMyInterests(user?.uid)

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1>Mis intereses</h1>
        <p className={styles.subtitle}>Los eventos que marcaste como que te interesan.</p>
      </header>

      {loading ? <p className={styles.message}>Cargando...</p> : null}

      {!loading && error ? (
        <p className={styles.message}>
          Ocurrio un problema al cargar tus eventos guardados. Intenta nuevamente en unos minutos.
        </p>
      ) : null}

      {!loading && !error && events.length === 0 ? (
        <EmptyState
          title="Todavia no tenes eventos guardados"
          description="Marca '❤️ Me interesa' en un evento para encontrarlo rapido aca."
        />
      ) : null}

      {!loading && !error && events.length > 0 ? (
        <ul className={styles.list}>
          {events.map((event) => (
            <li key={event.id} className={styles.item}>
              <EventCard event={event} />
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}

export default MyInterests

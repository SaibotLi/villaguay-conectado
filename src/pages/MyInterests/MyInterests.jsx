import EventCard from '../../components/event/EventCard'
import useAuth from '../../hooks/useAuth'
import { useMyInterests } from '../../hooks/useMyInterests'
import styles from './MyInterests.module.css'

function MyInterests() {
  const { user } = useAuth()
  const { events, loading, error } = useMyInterests(user?.uid)

  if (loading) {
    return (
      <section className={styles.page}>
        <h1>Mis intereses</h1>
        <p className={styles.message}>Cargando...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className={styles.page}>
        <h1>Mis intereses</h1>
        <p className={styles.message}>Ocurrio un problema al cargar tus eventos guardados. Intenta nuevamente en unos minutos.</p>
      </section>
    )
  }

  if (events.length === 0) {
    return (
      <section className={styles.page}>
        <h1>Mis intereses</h1>
        <p className={styles.message}>No tienes eventos guardados.</p>
      </section>
    )
  }

  return (
    <section className={styles.page}>
      <h1>Mis intereses</h1>
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

export default MyInterests

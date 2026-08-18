import { Link } from 'react-router-dom'
import { useEvents } from '../../hooks/useEvents'
import EventCard from '../../components/event/EventCard'
import Button from '../../components/ui/Button/Button'
import styles from './Home.module.css'

const RECENT_EVENTS_LIMIT = 3

const reasons = [
  {
    title: 'Eventos actualizados',
    description: 'La agenda se mantiene al dia con las propuestas aprobadas por la comunidad.',
  },
  {
    title: 'Guarda tus favoritos',
    description: 'Marca los eventos que te interesan y encontralos facil en un solo lugar.',
  },
  {
    title: 'Encontra actividades facil',
    description: 'Toda la informacion clave de cada evento, a simple vista, sin vueltas.',
  },
]

function Home() {
  const { events, loading, error } = useEvents()
  const recentEvents = events.slice(0, RECENT_EVENTS_LIMIT)

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1>VillaguayConectado</h1>
        <p className={styles.subtitle}>
          Descubri todos los eventos de la ciudad en un solo lugar.
        </p>
        <div className={styles.actions}>
          <Button as={Link} to="/eventos" variant="primary" className={styles.heroButton}>
            Explorar eventos
          </Button>
          <Button as={Link} to="/proponer-evento" variant="accent" className={styles.heroButton}>
            Proponer evento
          </Button>
        </div>
      </section>

      <section className={styles.reasons} aria-labelledby="reasons-heading">
        <h2 id="reasons-heading">¿Por que usar VillaguayConectado?</h2>
        <ul className={styles.reasonsList}>
          {reasons.map((reason) => (
            <li key={reason.title} className={styles.reasonItem}>
              <h3>{reason.title}</h3>
              <p>{reason.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.recentEvents} aria-labelledby="recent-events-heading">
        <div className={styles.recentEventsHeader}>
          <h2 id="recent-events-heading">Eventos recientes</h2>
          <Link to="/eventos" className={styles.link}>
            Ver todos
          </Link>
        </div>

        {loading && <p className={styles.message}>Cargando eventos...</p>}

        {!loading && error && (
          <p className={styles.message}>
            Ocurrio un problema al cargar los eventos. Intenta nuevamente en unos minutos.
          </p>
        )}

        {!loading && !error && recentEvents.length === 0 && (
          <p className={styles.message}>
            Todavia no hay eventos publicados. Volve pronto.
          </p>
        )}

        {!loading && !error && recentEvents.length > 0 && (
          <ul className={styles.recentEventsList}>
            {recentEvents.map((event) => (
              <li key={event.id} className={styles.recentEventsItem}>
                <EventCard event={event} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default Home


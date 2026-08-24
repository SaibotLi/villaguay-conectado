import { Link } from 'react-router-dom'
import { useEvents } from '../../hooks/useEvents'
import EventCard from '../../components/event/EventCard'
import Button from '../../components/ui/Button/Button'
import styles from './Home.module.css'

const RECENT_EVENTS_LIMIT = 3

const reasons = [
  {
    number: '01',
    title: 'Descubrí',
    description: 'Explorá los eventos publicados y encontrá actividades para disfrutar en la ciudad.',
  },
  {
    number: '02',
    title: 'Participá',
    description: 'Guardá los eventos que te interesan y compartilos con otras personas.',
  },
  {
    number: '03',
    title: 'Proponé',
    description: 'Enviá una propuesta para que pueda revisarse antes de su publicación.',
  },
]

function Home() {
  const { events, loading, error } = useEvents()
  const recentEvents = events.slice(0, RECENT_EVENTS_LIMIT)

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>La agenda digital de la ciudad</p>
        <h1>VillaguayConectado</h1>
        <p className={styles.subtitle}>
          Descubrí los eventos, actividades y propuestas que hacen mover a Villaguay.
        </p>
        <div className={styles.actions}>
          <Button as={Link} to="/eventos" variant="primary" className={styles.heroButton}>
            Ver eventos
          </Button>
          <Button as={Link} to="/proponer-evento" variant="accent" className={styles.heroButton}>
            Proponer evento
          </Button>
        </div>
      </section>

      <section className={styles.reasons} aria-labelledby="reasons-heading">
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Todo en un mismo lugar</p>
          <h2 id="reasons-heading">Así funciona VillaguayConectado</h2>
        </div>
        <ul className={styles.reasonsList}>
          {reasons.map((reason) => (
            <li key={reason.title} className={styles.reasonItem}>
              <span className={styles.reasonNumber}>{reason.number}</span>
              <h3>{reason.title}</h3>
              <p>{reason.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.recentEvents} aria-labelledby="recent-events-heading">
        <div className={styles.recentEventsHeader}>
          <div>
            <p className={styles.eyebrow}>Agenda actualizada</p>
            <h2 id="recent-events-heading">Eventos recientes</h2>
          </div>
          <Link to="/eventos" className={styles.link}>
            Ver todos
          </Link>
        </div>

        {loading && <p className={styles.message}>Cargando eventos...</p>}

        {!loading && error && (
          <p className={styles.message}>
            Ocurrió un problema al cargar los eventos. Intentá nuevamente en unos minutos.
          </p>
        )}

        {!loading && !error && recentEvents.length === 0 && (
          <p className={styles.message}>
            Todavía no hay eventos publicados. Volvé pronto.
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


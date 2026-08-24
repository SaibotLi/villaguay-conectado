import { Link } from 'react-router-dom'
import { useEvents } from '../../hooks/useEvents'
import EventCard from '../../components/event/EventCard'
import Button from '../../components/ui/Button/Button'
import heroImg from '../../assets/images/hero.jpg'
import descubriImg from '../../assets/images/descubri.jpg'
import participaImg from '../../assets/images/participa.jpg'
import proponeImg from '../../assets/images/propone.jpg'
import styles from './Home.module.css'

const RECENT_EVENTS_LIMIT = 3

function Home() {
  const { events, loading, error } = useEvents()
  const recentEvents = events.slice(0, RECENT_EVENTS_LIMIT)

  return (
    <div className={styles.page}>
      {/* SECCIÓN 1 — HERO */}
      <section className={styles.hero} aria-label="Introducción a VillaguayConectado">
        <img
          src={heroImg}
          alt="Vecinos y familias compartiendo actividades en la plaza principal de Villaguay"
          className={styles.heroBgImage}
          fetchPriority="high"
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>La agenda digital de la ciudad</p>
          <h1 className={styles.heroTitle}>VillaguayConectado</h1>
          <p className={styles.heroSubtitle}>
            Descubrí todos los eventos de la ciudad en un solo lugar.
          </p>
          <div className={styles.heroActions}>
            <Button as={Link} to="/eventos" variant="primary" className={styles.heroButton}>
              Ver eventos
            </Button>
            <Button as={Link} to="/proponer-evento" variant="accent" className={styles.heroButton}>
              Proponer evento
            </Button>
          </div>
        </div>
      </section>

      {/* SECCIÓN 2 — ASÍ FUNCIONA VILLAGUAYCONECTADO */}
      <section className={styles.howItWorks} aria-labelledby="how-it-works-heading">
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Todo en un mismo lugar</p>
          <h2 id="how-it-works-heading">Así funciona VillaguayConectado</h2>
        </div>

        <div className={styles.stepsList}>
          {/* BLOQUE 01 — DESCUBRÍ */}
          <article className={styles.stepBlock}>
            <div className={styles.stepImageWrapper}>
              <img
                src={descubriImg}
                alt="Vecinos organizando y descubriendo propuestas al aire libre en Villaguay"
                className={styles.stepImage}
                loading="lazy"
              />
            </div>
            <div className={styles.stepContent}>
              <span className={styles.stepNumber}>01</span>
              <h3 className={styles.stepTitle}>Descubrí</h3>
              <p className={styles.stepDescription}>
                Explorá los eventos publicados y encontrá actividades para disfrutar en la ciudad. Desde ferias y festivales hasta talleres y encuentros comunitarios.
              </p>
              <div>
                <Button as={Link} to="/eventos" variant="primary">
                  Ver eventos
                </Button>
              </div>
            </div>
          </article>

          {/* BLOQUE 02 — PARTICIPÁ */}
          <article className={`${styles.stepBlock} ${styles.stepBlockReversed}`}>
            <div className={styles.stepImageWrapper}>
              <img
                src={participaImg}
                alt="Vecinos de todas las edades participando en un taller comunitario de alfarería"
                className={styles.stepImage}
                loading="lazy"
              />
            </div>
            <div className={styles.stepContent}>
              <span className={styles.stepNumber}>02</span>
              <h3 className={styles.stepTitle}>Participá</h3>
              <p className={styles.stepDescription}>
                Guardá los eventos que te interesan, sumate a las iniciativas locales y compartilos con amigos y familia para ser parte de la vida comunitaria.
              </p>
              <div>
                <Button as={Link} to="/eventos" variant="secondary">
                  Explorar actividades
                </Button>
              </div>
            </div>
          </article>

          {/* BLOQUE 03 — PROPONÉ */}
          <article className={styles.stepBlock}>
            <div className={styles.stepImageWrapper}>
              <img
                src={proponeImg}
                alt="Organización y preparación de folletos para un taller de arte en la ciudad"
                className={styles.stepImage}
                loading="lazy"
              />
            </div>
            <div className={styles.stepContent}>
              <span className={styles.stepNumber}>03</span>
              <h3 className={styles.stepTitle}>Proponé</h3>
              <p className={styles.stepDescription}>
                ¿Tenés un taller, peña, muestra o actividad? Enviá tu propuesta para que el equipo municipal la revise y se publique en la agenda oficial.
              </p>
              <div>
                <Button as={Link} to="/proponer-evento" variant="accent">
                  Proponer evento
                </Button>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* SECCIÓN 3 — EVENTOS RECIENTES */}
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

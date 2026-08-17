import { Link, useParams } from 'react-router-dom'
import { useEvent } from '../../hooks/useEvent'
import InterestButton from '../../components/event/InterestButton'
import ShareButton from '../../components/event/ShareButton'
import styles from './EventDetail.module.css'

function EventDetail() {
  const { id } = useParams()
  const { event, loading, error } = useEvent(id)

  if (loading) {
    return (
      <section className={styles.page}>
        <p className={styles.message}>Cargando evento...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className={styles.page}>
        <p className={styles.message}>
          No pudimos cargar el evento en este momento. Intentalo nuevamente.
        </p>
      </section>
    )
  }

  if (!event) {
    return (
      <section className={styles.page}>
        <h1 className={styles.title}>Evento no encontrado</h1>
        <p className={styles.message}>
          El evento que buscabas no existe o ya no esta disponible.
        </p>
        <Link to="/eventos" className={styles.backLink}>
          Volver al listado de eventos
        </Link>
      </section>
    )
  }

  return (
    <section className={styles.page}>
      <article className={styles.card}>
        <h1 className={styles.title}>{event.title}</h1>
        <p className={styles.description}>{event.description}</p>

        <div className={styles.metaGroup}>
          <p className={styles.meta}>Ubicacion: {event.location}</p>
          <p className={styles.meta}>Fecha: {event.date}</p>
          <p className={styles.meta}>Hora: {event.time}</p>
        </div>

        {event.mapsUrl ? (
          <a
            href={event.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mapsButton}
          >
            Ver ubicacion en Google Maps
          </a>
        ) : null}

        <InterestButton eventId={event.id} />
        <ShareButton title={event.title} eventId={event.id} />
      </article>
    </section>
  )
}

export default EventDetail

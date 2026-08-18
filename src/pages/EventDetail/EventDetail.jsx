import { Link, useParams } from 'react-router-dom'
import { useEvent } from '../../hooks/useEvent'
import EventImage from '../../components/EventImage/EventImage'
import InterestButton from '../../components/event/InterestButton'
import ShareButton from '../../components/event/ShareButton'
import Button from '../../components/ui/Button/Button'
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
      <Link to="/eventos" className={styles.backLink}>
        ← Volver a eventos
      </Link>

      <article className={styles.card}>
        <EventImage event={event} />

        <div className={styles.content}>
          <h1 className={styles.title}>{event.title}</h1>

          <div className={styles.metaGroup}>
            <p className={styles.meta}>📅 {event.date} · {event.time}</p>
            <p className={styles.meta}>📍 {event.location}</p>
          </div>

          <p className={styles.description}>{event.description}</p>

          <div className={styles.actions}>
            <InterestButton eventId={event.id} />
            <ShareButton title={event.title} eventId={event.id} />
            {event.mapsUrl ? (
              <Button
                as="a"
                href={event.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
              >
                Ver en Google Maps
              </Button>
            ) : null}
          </div>
        </div>
      </article>
    </section>
  )
}

export default EventDetail

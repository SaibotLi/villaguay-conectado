import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, CalendarPlus, MapPin } from 'lucide-react'
import { useEvent } from '../../hooks/useEvent'
import EventImage from '../../components/EventImage/EventImage'
import InterestButton from '../../components/event/InterestButton'
import ShareButton from '../../components/event/ShareButton'
import Button from '../../components/ui/Button/Button'
import Icon from '../../components/ui/Icon/Icon'
import { buildGoogleCalendarUrl } from '../../utils/googleCalendar'
import { formatDisplayDate } from '../../utils/dateUtils'
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
          No pudimos cargar el evento en este momento. Intentá nuevamente.
        </p>
      </section>
    )
  }

  if (!event) {
    return (
      <section className={styles.page}>
        <h1 className={styles.title}>Evento no encontrado</h1>
        <p className={styles.message}>
          El evento que buscabas no existe o ya no está disponible.
        </p>
        <Link to="/eventos" className={styles.backLink}>
          <Icon icon={ArrowLeft} size={16} />
          <span>Volver al listado de eventos</span>
        </Link>
      </section>
    )
  }

  const calendarUrl = buildGoogleCalendarUrl(event)

  return (
    <section className={styles.page}>
      <Link to="/eventos" className={styles.backLink}>
        <Icon icon={ArrowLeft} size={16} />
        <span>Volver a eventos</span>
      </Link>

      <article className={styles.card}>
        <EventImage event={event} />

        <div className={styles.content}>
          <h1 className={styles.title}>{event.title}</h1>

          <div className={styles.metaGroup}>
            <p className={styles.meta}>
              <Icon icon={Calendar} size={16} />
              <span>{formatDisplayDate(event.date)} · {event.time}</span>
            </p>
            <p className={styles.meta}>
              <Icon icon={MapPin} size={16} />
              <span>{event.location}</span>
            </p>
          </div>

          <p className={styles.description}>{event.description}</p>

          <div className={styles.actions}>
            <InterestButton eventId={event.id} />
            <ShareButton title={event.title} eventId={event.id} />
            {calendarUrl ? (
              <Button
                as="a"
                href={calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
              >
                <Icon icon={CalendarPlus} size={16} />
                Agregar a Google Calendar
              </Button>
            ) : null}
            {event.mapsUrl ? (
              <Button
                as="a"
                href={event.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
              >
                <Icon icon={MapPin} size={16} />
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

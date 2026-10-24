import { Link, useLocation } from 'react-router-dom'
import { Calendar, MapPin } from 'lucide-react'
import EventImage from '../EventImage/EventImage'
import Button from '../ui/Button/Button'
import Icon from '../ui/Icon/Icon'
import { formatDisplayDate, isEventPast } from '../../utils/dateUtils'
import styles from './EventCard.module.css'

function EventCard({ event }) {
  const location = useLocation()
  const isPast = isEventPast(event?.date)

  return (
    <article className={styles.card}>
      <EventImage event={event} />
      <div className={styles.content}>
        {isPast ? (
          <span className={styles.pastBadge}>Evento finalizado</span>
        ) : null}
        <h3 className={styles.title}>{event.title}</h3>
        <p className={styles.description}>{event.description}</p>
        <p className={styles.meta}>
          <Icon icon={Calendar} size={15} />
          <span>{formatDisplayDate(event.date)} · {event.time}</span>
        </p>
        <p className={styles.meta}>
          <Icon icon={MapPin} size={15} />
          <span>{event.location}</span>
        </p>
        <Button
          as={Link}
          to={`/eventos/${event.id}`}
          state={{ from: `${location.pathname}${location.search}` }}
          variant="ghost"
          className={styles.detailButton}
        >
          Ver detalle →
        </Button>
      </div>
    </article>
  )
}

export default EventCard

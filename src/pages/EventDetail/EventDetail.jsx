import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, CalendarPlus, MapPin, X } from 'lucide-react'
import { useEvent } from '../../hooks/useEvent'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import EventImage from '../../components/EventImage/EventImage'
import InterestButton from '../../components/event/InterestButton'
import ShareButton from '../../components/event/ShareButton'
import Button from '../../components/ui/Button/Button'
import Icon from '../../components/ui/Icon/Icon'
import { buildGoogleCalendarUrl } from '../../utils/googleCalendar'
import { formatDisplayDate, isEventPast } from '../../utils/dateUtils'
import styles from './EventDetail.module.css'

function EventDetail() {
  const { id } = useParams()
  const location = useLocation()
  const { event, loading, error } = useEvent(id)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const modalCloseButtonRef = useRef(null)
  const modalDialogRef = useRef(null)
  const previousFocusRef = useRef(null)

  const returnUrl =
    typeof location.state?.from === 'string' &&
    location.state.from.startsWith('/') &&
    !location.state.from.startsWith('//')
      ? location.state.from
      : '/eventos'

  // Título dinámico para la pestaña del navegador según el estado de carga y el evento
  let pageTitle = 'Detalle de evento'
  if (loading) {
    pageTitle = 'Detalle de evento'
  } else if (error) {
    pageTitle = 'Error al cargar evento'
  } else if (!event) {
    pageTitle = 'Evento no encontrado'
  } else if (event.title) {
    pageTitle = event.title
  }

  useDocumentTitle(pageTitle)

  // Manejo accesible del modal de ampliación de flyer (Escape, foco, bloqueo de scroll)
  useEffect(() => {
    if (!isModalOpen) return

    previousFocusRef.current = document.activeElement
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Enfocar botón de cierre tras renderizar el modal
    const focusTimeout = setTimeout(() => {
      modalCloseButtonRef.current?.focus()
    }, 50)

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleCloseModal()
        return
      }

      // Atrapado de foco (Focus Trap) accesible dentro del diálogo
      if (e.key === 'Tab') {
        const dialog = modalDialogRef.current
        if (!dialog) return

        const focusable = dialog.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )

        if (focusable.length === 0) {
          e.preventDefault()
          return
        }

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      clearTimeout(focusTimeout)
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus()
      }
    }
  }, [isModalOpen])

  function handleOpenModal() {
    setIsModalOpen(true)
  }

  function handleCloseModal() {
    setIsModalOpen(false)
  }

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
  const isPast = isEventPast(event.date)
  const imageUrl = event?.imageUrl?.trim() || ''

  return (
    <section className={styles.page}>
      <Link to={returnUrl} className={styles.backLink}>
        <Icon icon={ArrowLeft} size={16} />
        <span>{returnUrl === '/' ? 'Volver al inicio' : 'Volver a eventos'}</span>
      </Link>

      <article className={styles.card}>
        <EventImage event={event} onExpand={imageUrl ? handleOpenModal : undefined} />

        <div className={styles.content}>
          <div className={styles.headerArea}>
            {isPast ? (
              <span className={styles.pastBadge} role="status">
                Evento finalizado
              </span>
            ) : null}
            <h1 className={styles.title}>{event.title}</h1>
          </div>

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

      {/* Modal accesible para visualización ampliada del flyer */}
      {isModalOpen && imageUrl ? (
        <div className={styles.modalBackdrop} onClick={handleCloseModal}>
          <div
            ref={modalDialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Afiche ampliado: ${event.title}`}
            className={styles.modalDialog}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={modalCloseButtonRef}
              type="button"
              className={styles.modalCloseButton}
              onClick={handleCloseModal}
              aria-label="Cerrar vista ampliada"
              title="Cerrar (Esc)"
            >
              <Icon icon={X} size={22} />
            </button>
            <div className={styles.modalImageWrapper}>
              <img
                src={imageUrl}
                alt={`Flyer ampliado de ${event.title}`}
                className={styles.modalImage}
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default EventDetail

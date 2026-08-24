import { useMemo, useState } from 'react'
import { useEvents } from '../../hooks/useEvents'
import EventCard from '../../components/event/EventCard'
import EmptyState from '../../components/ui/EmptyState/EmptyState'
import styles from './Events.module.css'

/**
 * Parsea una fecha en formato YYYY-MM-DD y una hora HH:mm opcional en la zona horaria local.
 *
 * @param {string} dateStr - Cadena de fecha (ej. "2026-08-25")
 * @param {string} [timeStr] - Cadena de hora (ej. "18:30")
 * @returns {Date|null} Objeto Date representativo o null si el formato no es válido.
 */
function parseEventDate(dateStr, timeStr) {
  if (!dateStr || typeof dateStr !== 'string') return null
  const dateParts = dateStr.trim().split('-')
  if (dateParts.length !== 3) return null

  const year = parseInt(dateParts[0], 10)
  const month = parseInt(dateParts[1], 10) - 1 // 0-indexado
  const day = parseInt(dateParts[2], 10)

  if (isNaN(year) || isNaN(month) || isNaN(day)) return null

  let hours = 0
  let minutes = 0
  if (timeStr && typeof timeStr === 'string') {
    const timeParts = timeStr.trim().split(':')
    if (timeParts.length >= 2) {
      const parsedHours = parseInt(timeParts[0], 10)
      const parsedMinutes = parseInt(timeParts[1], 10)
      if (!isNaN(parsedHours) && !isNaN(parsedMinutes)) {
        hours = parsedHours
        minutes = parsedMinutes
      }
    }
  }

  return new Date(year, month, day, hours, minutes, 0, 0)
}

/**
 * Determina si la fecha del evento corresponde al día actual.
 */
function isToday(eventDate, now = new Date()) {
  if (!eventDate) return false
  return (
    eventDate.getFullYear() === now.getFullYear() &&
    eventDate.getMonth() === now.getMonth() &&
    eventDate.getDate() === now.getDate()
  )
}

/**
 * Determina si la fecha del evento se encuentra dentro de la semana calendario actual (lunes a domingo).
 */
function isThisWeek(eventDate, now = new Date()) {
  if (!eventDate) return false
  const dayOfWeek = now.getDay() // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  const distanceToMonday = (dayOfWeek + 6) % 7

  const startOfWeek = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - distanceToMonday,
    0,
    0,
    0,
    0
  )
  const endOfWeek = new Date(
    startOfWeek.getFullYear(),
    startOfWeek.getMonth(),
    startOfWeek.getDate() + 6,
    23,
    59,
    59,
    999
  )

  return eventDate >= startOfWeek && eventDate <= endOfWeek
}

/**
 * Ordena eventos de forma ascendente: del más próximo al más lejano.
 */
function sortEventsByDateAsc(events) {
  return [...events].sort((firstEvent, secondEvent) => {
    const firstDate = parseEventDate(firstEvent.date, firstEvent.time)
    const secondDate = parseEventDate(secondEvent.date, secondEvent.time)

    if (firstDate && secondDate) {
      return firstDate.getTime() - secondDate.getTime()
    }
    if (firstDate && !secondDate) return -1
    if (!firstDate && secondDate) return 1
    return 0
  })
}

function Events() {
  const { events, loading, error } = useEvents()
  const [activeFilter, setActiveFilter] = useState('all') // 'all' | 'today' | 'week'

  const filteredAndSortedEvents = useMemo(() => {
    const sorted = sortEventsByDateAsc(events)
    const now = new Date()

    if (activeFilter === 'today') {
      return sorted.filter((event) => isToday(parseEventDate(event.date, event.time), now))
    }

    if (activeFilter === 'week') {
      return sorted.filter((event) => isThisWeek(parseEventDate(event.date, event.time), now))
    }

    return sorted
  }, [events, activeFilter])

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1>Eventos</h1>
        <p className={styles.subtitle}>Encontrá las próximas actividades de Villaguay.</p>
      </header>

      {/* Controles de filtro temporal */}
      <div className={styles.toolbar}>
        <div className={styles.filterGroup} role="group" aria-label="Filtrar eventos por fecha">
          <button
            type="button"
            className={`${styles.filterButton} ${activeFilter === 'all' ? styles.active : ''}`}
            onClick={() => setActiveFilter('all')}
            aria-pressed={activeFilter === 'all'}
          >
            Todos
          </button>
          <button
            type="button"
            className={`${styles.filterButton} ${activeFilter === 'today' ? styles.active : ''}`}
            onClick={() => setActiveFilter('today')}
            aria-pressed={activeFilter === 'today'}
          >
            Hoy
          </button>
          <button
            type="button"
            className={`${styles.filterButton} ${activeFilter === 'week' ? styles.active : ''}`}
            onClick={() => setActiveFilter('week')}
            aria-pressed={activeFilter === 'week'}
          >
            Esta semana
          </button>
        </div>
      </div>

      {loading && <p className={styles.message}>Cargando eventos...</p>}

      {!loading && error && (
        <p className={styles.message}>
          Ocurrió un problema al cargar los eventos. Intentá nuevamente en unos minutos.
        </p>
      )}

      {!loading && !error && filteredAndSortedEvents.length === 0 && (
        <>
          {activeFilter === 'today' && (
            <EmptyState
              title="Hoy no hay eventos programados"
              description="Revisá las actividades de los próximos días o cambiá el filtro para ver la agenda completa."
            />
          )}
          {activeFilter === 'week' && (
            <EmptyState
              title="No hay eventos para esta semana"
              description="No encontramos actividades programadas para esta semana. Podés consultar la agenda completa en “Todos”."
            />
          )}
          {activeFilter === 'all' && (
            <EmptyState
              title="Todavía no hay eventos disponibles"
              description="Volvé a consultar pronto para enterarte de las próximas actividades de Villaguay."
            />
          )}
        </>
      )}

      {!loading && !error && filteredAndSortedEvents.length > 0 && (
        <ul className={styles.list}>
          {filteredAndSortedEvents.map((event) => (
            <li key={event.id} className={styles.item}>
              <EventCard event={event} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default Events

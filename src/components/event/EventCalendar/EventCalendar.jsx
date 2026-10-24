import { useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Icon from '../../ui/Icon/Icon'
import EmptyState from '../../ui/EmptyState/EmptyState'
import EventCard from '../EventCard'
import {
  MONTH_NAMES,
  WEEKDAY_NAMES_SHORT,
  WEEKDAY_NAMES_FULL,
  getMonthCalendarGrid,
  groupEventsByDate,
  formatDayHeading,
  getAdjacentMonth,
  formatIsoDate,
} from '../../../utils/dateUtils'
import styles from './EventCalendar.module.css'

function EventCalendar({
  events = [],
  todayIso = '',
  selectedDateIso = '',
  onSelectDate,
  year,
  month,
  onChangeMonth,
}) {
  // Mapa de eventos agrupados por fecha ISO "YYYY-MM-DD"
  const eventsByDate = useMemo(() => groupEventsByDate(events), [events])

  // Celdas calculadas para el mes y año en pantalla
  const calendarCells = useMemo(
    () => getMonthCalendarGrid(year, month, todayIso),
    [year, month, todayIso]
  )

  // Eventos correspondientes al día seleccionado
  const selectedDayEvents = useMemo(() => {
    if (!selectedDateIso || !eventsByDate[selectedDateIso]) return []
    return [...eventsByDate[selectedDateIso]].sort((a, b) =>
      (a.time || '').localeCompare(b.time || '')
    )
  }, [eventsByDate, selectedDateIso])

  function handlePrevMonth() {
    const prev = getAdjacentMonth(year, month, -1)
    const newSelectedDate = formatIsoDate(prev.year, prev.month, 1)
    onChangeMonth(prev.year, prev.month, newSelectedDate)
  }

  function handleNextMonth() {
    const next = getAdjacentMonth(year, month, 1)
    const newSelectedDate = formatIsoDate(next.year, next.month, 1)
    onChangeMonth(next.year, next.month, newSelectedDate)
  }

  function handleGoToToday() {
    if (!todayIso) return
    const [tYearStr, tMonthStr] = todayIso.split('-')
    const tYear = parseInt(tYearStr, 10)
    const tMonth = parseInt(tMonthStr, 10)
    onChangeMonth(tYear, tMonth, todayIso)
  }

  function handleCellClick(cell) {
    onSelectDate(cell.dateIso)
    // Si el usuario presiona un día visible del mes anterior o posterior, navega automáticamente a ese mes.
    if (!cell.isCurrentMonth) {
      onChangeMonth(cell.year, cell.month, cell.dateIso)
    }
  }

  return (
    <div className={styles.container}>
      <article className={styles.calendarCard}>
        {/* Cabecera de Navegación del Calendario */}
        <header className={styles.navHeader}>
          <div className={styles.titleGroup}>
            <h2 className={styles.monthTitle}>
              {MONTH_NAMES[month - 1]} {year}
            </h2>
          </div>

          <div className={styles.navActions}>
            <button
              type="button"
              className={styles.todayButton}
              onClick={handleGoToToday}
              aria-label="Ir al mes actual y seleccionar hoy"
            >
              Hoy
            </button>
            <button
              type="button"
              className={styles.navButton}
              onClick={handlePrevMonth}
              aria-label={`Ir al mes anterior (${MONTH_NAMES[month === 1 ? 11 : month - 2]})`}
              title="Mes anterior"
            >
              <Icon icon={ChevronLeft} size={20} />
            </button>
            <button
              type="button"
              className={styles.navButton}
              onClick={handleNextMonth}
              aria-label={`Ir al mes siguiente (${MONTH_NAMES[month === 12 ? 0 : month]})`}
              title="Mes siguiente"
            >
              <Icon icon={ChevronRight} size={20} />
            </button>
          </div>
        </header>

        {/* Cuadrícula Mensual */}
        <div className={styles.gridWrapper}>
          {/* Fila de días de la semana */}
          <div className={styles.weekdaysRow} role="row" aria-label="Días de la semana">
            {WEEKDAY_NAMES_SHORT.map((shortName, idx) => (
              <div key={shortName} className={styles.weekdayHeader} role="columnheader">
                <abbr title={WEEKDAY_NAMES_FULL[idx]}>{shortName}</abbr>
              </div>
            ))}
          </div>

          {/* Cuadrícula de 7 columnas */}
          <div className={styles.daysGrid} role="grid" aria-label={`Calendario de ${MONTH_NAMES[month - 1]} ${year}`}>
            {calendarCells.map((cell) => {
              const dayEvents = eventsByDate[cell.dateIso] || []
              const hasEvents = dayEvents.length > 0
              const isSelected = cell.dateIso === selectedDateIso

              const cellClasses = [
                styles.cell,
                cell.isCurrentMonth ? styles.currentMonth : styles.adjacentMonth,
                cell.isToday ? styles.today : '',
                isSelected ? styles.selected : '',
              ]
                .filter(Boolean)
                .join(' ')

              const countLabel = hasEvents
                ? `, ${dayEvents.length} ${dayEvents.length === 1 ? 'actividad' : 'actividades'}`
                : ', sin actividades'

              const cellAriaLabel = `${cell.dayNumber} de ${MONTH_NAMES[cell.month - 1]} de ${cell.year}${cell.isToday ? ', hoy' : ''}${countLabel}`

              return (
                <button
                  key={cell.dateIso}
                  type="button"
                  className={cellClasses}
                  onClick={() => handleCellClick(cell)}
                  aria-label={cellAriaLabel}
                  aria-pressed={isSelected}
                  aria-current={cell.isToday ? 'date' : undefined}
                >
                  <span className={styles.dayNumber}>{cell.dayNumber}</span>
                  {hasEvents ? (
                    <span className={styles.eventIndicator} aria-hidden="true" />
                  ) : null}
                </button>
              )
            })}
          </div>
        </div>
      </article>

      {/* Sección de actividades para la fecha seleccionada */}
      <section className={styles.dayDetailsSection} aria-labelledby="day-heading">
        <div className={styles.dayHeaderRow}>
          <h3 id="day-heading" className={styles.dayHeading}>
            {formatDayHeading(selectedDateIso)}
          </h3>
          <span className={styles.dayCountBadge}>
            {selectedDayEvents.length === 1
              ? '1 actividad'
              : `${selectedDayEvents.length} actividades`}
          </span>
        </div>

        {selectedDayEvents.length > 0 ? (
          <ul className={styles.dayEventList}>
            {selectedDayEvents.map((event) => (
              <li key={event.id} className={styles.dayEventItem}>
                <EventCard event={event} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="Sin actividades programadas"
            description="No encontramos eventos para este día. Podés seleccionar otra fecha en el calendario o consultar la agenda en la vista de lista."
          />
        )}
      </section>
    </div>
  )
}

export default EventCalendar

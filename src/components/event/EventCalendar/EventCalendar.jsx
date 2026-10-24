import { useMemo, useRef, useState } from 'react'
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
  getDaysInMonth,
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
  const cellsRef = useRef({})

  // Estado para el foco del teclado (roving tabindex)
  const [focusedDateIso, setFocusedDateIso] = useState('')

  // Mapa de eventos agrupados por fecha ISO "YYYY-MM-DD"
  const eventsByDate = useMemo(() => groupEventsByDate(events), [events])

  // Celdas calculadas para el mes y año en pantalla
  const calendarCells = useMemo(
    () => getMonthCalendarGrid(year, month, todayIso),
    [year, month, todayIso]
  )

  // Celda con foco activo en la cuadrícula (roving tabindex: exactamente 1 celda tiene tabIndex 0)
  const activeFocusedDate = useMemo(() => {
    if (focusedDateIso && calendarCells.some((c) => c.dateIso === focusedDateIso)) {
      return focusedDateIso
    }
    if (selectedDateIso && calendarCells.some((c) => c.dateIso === selectedDateIso)) {
      return selectedDateIso
    }
    return formatIsoDate(year, month, 1)
  }, [focusedDateIso, calendarCells, selectedDateIso, year, month])

  // Agrupa las celdas en semanas de 7 días para estructura semántica de filas y celdas (WAI-ARIA Grid)
  const weeks = useMemo(() => {
    const result = []
    for (let i = 0; i < calendarCells.length; i += 7) {
      result.push(calendarCells.slice(i, i + 7))
    }
    return result
  }, [calendarCells])

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
    setFocusedDateIso(newSelectedDate)
  }

  function handleNextMonth() {
    const next = getAdjacentMonth(year, month, 1)
    const newSelectedDate = formatIsoDate(next.year, next.month, 1)
    onChangeMonth(next.year, next.month, newSelectedDate)
    setFocusedDateIso(newSelectedDate)
  }

  function handleGoToToday() {
    if (!todayIso) return
    const [tYearStr, tMonthStr] = todayIso.split('-')
    const tYear = parseInt(tYearStr, 10)
    const tMonth = parseInt(tMonthStr, 10)
    onChangeMonth(tYear, tMonth, todayIso)
    setFocusedDateIso(todayIso)
    setTimeout(() => {
      cellsRef.current[todayIso]?.focus()
    }, 0)
  }

  function handleCellClick(cell) {
    setFocusedDateIso(cell.dateIso)
    onSelectDate(cell.dateIso)
    // Si el usuario presiona un día visible del mes anterior o posterior, navega automáticamente a ese mes.
    if (!cell.isCurrentMonth) {
      onChangeMonth(cell.year, cell.month, cell.dateIso)
    }
  }

  // Navegación por teclado dentro de la cuadrícula (WAI-ARIA Grid roving tabindex)
  function handleKeyDown(event, cell) {
    const currentIndex = calendarCells.findIndex((c) => c.dateIso === cell.dateIso)
    if (currentIndex === -1) return

    switch (event.key) {
      case 'ArrowLeft': {
        event.preventDefault()
        const targetIndex = currentIndex - 1
        if (targetIndex >= 0) {
          const targetCell = calendarCells[targetIndex]
          setFocusedDateIso(targetCell.dateIso)
          cellsRef.current[targetCell.dateIso]?.focus()
        } else {
          // Navegar suavemente al último día del mes anterior
          const prev = getAdjacentMonth(year, month, -1)
          const prevDays = getDaysInMonth(prev.year, prev.month)
          const targetIso = formatIsoDate(prev.year, prev.month, prevDays)
          onChangeMonth(prev.year, prev.month, targetIso)
          setFocusedDateIso(targetIso)
        }
        break
      }

      case 'ArrowRight': {
        event.preventDefault()
        const targetIndex = currentIndex + 1
        if (targetIndex < calendarCells.length) {
          const targetCell = calendarCells[targetIndex]
          setFocusedDateIso(targetCell.dateIso)
          cellsRef.current[targetCell.dateIso]?.focus()
        } else {
          // Navegar al primer día del mes siguiente
          const next = getAdjacentMonth(year, month, 1)
          const targetIso = formatIsoDate(next.year, next.month, 1)
          onChangeMonth(next.year, next.month, targetIso)
          setFocusedDateIso(targetIso)
        }
        break
      }

      case 'ArrowUp': {
        event.preventDefault()
        const targetIndex = currentIndex - 7
        if (targetIndex >= 0) {
          const targetCell = calendarCells[targetIndex]
          setFocusedDateIso(targetCell.dateIso)
          cellsRef.current[targetCell.dateIso]?.focus()
        }
        break
      }

      case 'ArrowDown': {
        event.preventDefault()
        const targetIndex = currentIndex + 7
        if (targetIndex < calendarCells.length) {
          const targetCell = calendarCells[targetIndex]
          setFocusedDateIso(targetCell.dateIso)
          cellsRef.current[targetCell.dateIso]?.focus()
        }
        break
      }

      case 'Home': {
        event.preventDefault()
        // Inicio de la fila / semana actual
        const targetIndex = currentIndex - (currentIndex % 7)
        if (targetIndex >= 0 && targetIndex < calendarCells.length) {
          const targetCell = calendarCells[targetIndex]
          setFocusedDateIso(targetCell.dateIso)
          cellsRef.current[targetCell.dateIso]?.focus()
        }
        break
      }

      case 'End': {
        event.preventDefault()
        // Fin de la fila / semana actual
        const targetIndex = currentIndex + (6 - (currentIndex % 7))
        if (targetIndex >= 0 && targetIndex < calendarCells.length) {
          const targetCell = calendarCells[targetIndex]
          setFocusedDateIso(targetCell.dateIso)
          cellsRef.current[targetCell.dateIso]?.focus()
        }
        break
      }

      case 'PageUp':
        event.preventDefault()
        handlePrevMonth()
        break

      case 'PageDown':
        event.preventDefault()
        handleNextMonth()
        break

      case 'Enter':
      case ' ':
        event.preventDefault()
        // Enter y Espacio activan la selección del día enfocado sin alterar la navegación pura de foco
        handleCellClick(cell)
        break

      default:
        break
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

        {/* Cuadrícula Mensual Accesible (WAI-ARIA Grid con filas, celdas y roving tabindex) */}
        <div
          className={styles.daysGrid}
          role="grid"
          aria-label={`Calendario de ${MONTH_NAMES[month - 1]} de ${year}`}
        >
          {/* Fila de días de la semana */}
          <div role="rowgroup">
            <div className={styles.weekdaysRow} role="row" aria-label="Días de la semana">
              {WEEKDAY_NAMES_SHORT.map((shortName, idx) => (
                <div
                  key={shortName}
                  className={styles.weekdayHeader}
                  role="columnheader"
                  aria-label={WEEKDAY_NAMES_FULL[idx]}
                >
                  <abbr title={WEEKDAY_NAMES_FULL[idx]} aria-hidden="true">
                    {shortName}
                  </abbr>
                </div>
              ))}
            </div>
          </div>

          {/* Semanas con filas y celdas accesibles */}
          <div role="rowgroup" className={styles.gridBody}>
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className={styles.weekRow} role="row">
                {week.map((cell) => {
                  const dayEvents = eventsByDate[cell.dateIso] || []
                  const hasEvents = dayEvents.length > 0
                  const isSelected = cell.dateIso === selectedDateIso
                  const isFocused = cell.dateIso === activeFocusedDate

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
                    <div key={cell.dateIso} role="gridcell" className={styles.gridCell}>
                      <button
                        ref={(el) => {
                          if (el) cellsRef.current[cell.dateIso] = el
                        }}
                        type="button"
                        className={cellClasses}
                        tabIndex={isFocused ? 0 : -1}
                        onClick={() => handleCellClick(cell)}
                        onKeyDown={(e) => handleKeyDown(e, cell)}
                        aria-label={cellAriaLabel}
                        aria-pressed={isSelected}
                        aria-current={cell.isToday ? 'date' : undefined}
                      >
                        <span className={styles.dayNumber}>{cell.dayNumber}</span>
                        {hasEvents ? (
                          <span className={styles.eventIndicator} aria-hidden="true" />
                        ) : null}
                      </button>
                    </div>
                  )
                })}
              </div>
            ))}
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

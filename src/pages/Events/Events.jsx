import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CalendarDays, LayoutList, Search, X } from 'lucide-react'
import { useEvents } from '../../hooks/useEvents'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import EventCard from '../../components/event/EventCard'
import EventCalendar from '../../components/event/EventCalendar/EventCalendar'
import EmptyState from '../../components/ui/EmptyState/EmptyState'
import Button from '../../components/ui/Button/Button'
import Icon from '../../components/ui/Icon/Icon'
import {
  MONTH_NAMES,
  formatDisplayDate,
  getArgentinaTodayIso,
  getArgentinaWeekRange,
  sortEventsByFilter,
} from '../../utils/dateUtils'
import { filterEvents, matchesSearchQuery } from '../../utils/searchUtils'
import styles from './Events.module.css'

const FILTER_PARAM_TO_ID = {
  proximos: 'upcoming',
  hoy: 'today',
  semana: 'week',
  todos: 'all',
}

const ID_TO_FILTER_PARAM = {
  upcoming: 'proximos',
  today: 'hoy',
  week: 'semana',
  all: 'todos',
}

const VIEW_PARAM_TO_ID = {
  lista: 'list',
  calendario: 'calendar',
}

function Events() {
  const { events, loading, error } = useEvents()
  const [searchParams, setSearchParams] = useSearchParams()

  useDocumentTitle('Eventos')

  // Fechas canónicas calculadas en la zona horaria oficial de Argentina (America/Argentina/Buenos_Aires)
  const todayIso = useMemo(() => getArgentinaTodayIso(), [])
  const weekRange = useMemo(() => getArgentinaWeekRange(), [])

  // Derivación directa y segura desde parámetros de URL (U1: persistencia en historial y recarga)
  const viewMode = VIEW_PARAM_TO_ID[searchParams.get('vista')] || 'list'
  const activeFilter = FILTER_PARAM_TO_ID[searchParams.get('filtro')] || 'upcoming'

  const paramDate = searchParams.get('fecha')
  const selectedCalendarDate =
    paramDate && /^\d{4}-\d{2}-\d{2}$/.test(paramDate) ? paramDate : todayIso

  const [calendarYear, calendarMonth] = useMemo(() => {
    const [yStr, mStr] = selectedCalendarDate.split('-')
    const y = parseInt(yStr, 10)
    const m = parseInt(mStr, 10)
    return [isNaN(y) ? 2026 : y, isNaN(m) ? 10 : m]
  }, [selectedCalendarDate])

  // Estado local para búsqueda textual instantánea en el input
  const urlQuery = searchParams.get('q') || ''
  const [searchQuery, setSearchQuery] = useState(urlQuery)
  const [liveAnnouncement, setLiveAnnouncement] = useState('')
  const prevUrlQueryRef = useRef(urlQuery)

  // Sincroniza el input cuando cambia el parámetro 'q' por navegación del navegador (Atrás / Adelante)
  useEffect(() => {
    if (urlQuery !== prevUrlQueryRef.current) {
      prevUrlQueryRef.current = urlQuery
      setSearchQuery(urlQuery)
    }
  }, [urlQuery])

  // Actualiza los parámetros de la URL sin generar entradas de historial redundantes (replace: true)
  const updateUrlParams = useCallback(
    (updates, replace = true) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)

          if ('q' in updates) {
            const qVal = updates.q?.trim()
            if (qVal) next.set('q', qVal)
            else next.delete('q')
          }

          if ('filtro' in updates) {
            const fVal = updates.filtro
            if (fVal && fVal !== 'upcoming') next.set('filtro', ID_TO_FILTER_PARAM[fVal] || fVal)
            else next.delete('filtro')
          }

          if ('vista' in updates) {
            const vVal = updates.vista
            if (vVal === 'calendar') next.set('vista', 'calendario')
            else next.delete('vista')
          }

          if ('fecha' in updates) {
            const dVal = updates.fecha
            if (dVal && dVal !== todayIso) next.set('fecha', dVal)
            else next.delete('fecha')
          }

          return next
        },
        { replace }
      )
    },
    [setSearchParams, todayIso]
  )

  // Eventos para la vista de Lista (combinan búsqueda + filtro temporal)
  const filteredAndSortedListEvents = useMemo(() => {
    const filtered = filterEvents(events, {
      query: searchQuery,
      activeFilter,
      todayIso,
      weekRange,
    })

    return sortEventsByFilter(filtered, activeFilter, todayIso)
  }, [events, searchQuery, activeFilter, todayIso, weekRange])

  // Eventos para la vista de Calendario (filtrados por búsqueda textual, la dimensión temporal la gestiona el mes)
  const calendarEvents = useMemo(() => {
    if (!searchQuery.trim()) return events
    return events.filter((event) => matchesSearchQuery(event, searchQuery))
  }, [events, searchQuery])

  // Sincroniza la búsqueda textual con la URL con debouncing para no saturar el historial
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentParamQ = searchParams.get('q') || ''
      if (searchQuery.trim() !== currentParamQ.trim()) {
        prevUrlQueryRef.current = searchQuery.trim()
        updateUrlParams({ q: searchQuery }, true)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, searchParams, updateUrlParams])

  // Anuncio debounced de resultados de búsqueda para lectores de pantalla
  useEffect(() => {
    const trimmed = searchQuery.trim()
    if (!trimmed || loading || error) return

    const timer = setTimeout(() => {
      if (viewMode === 'list') {
        const count = filteredAndSortedListEvents.length
        if (count === 0) {
          setLiveAnnouncement(`No hay eventos para la búsqueda “${trimmed}”.`)
        } else if (count === 1) {
          setLiveAnnouncement(`Se encontró 1 evento para “${trimmed}”.`)
        } else {
          setLiveAnnouncement(`Se encontraron ${count} eventos para “${trimmed}”.`)
        }
      } else {
        const count = calendarEvents.length
        if (count === 0) {
          setLiveAnnouncement(`No hay actividades para “${trimmed}” en el calendario.`)
        } else if (count === 1) {
          setLiveAnnouncement(`1 actividad coincide con “${trimmed}” en el calendario.`)
        } else {
          setLiveAnnouncement(`${count} actividades coinciden con “${trimmed}” en el calendario.`)
        }
      }
    }, 350)

    return () => clearTimeout(timer)
  }, [searchQuery, filteredAndSortedListEvents.length, calendarEvents.length, viewMode, loading, error])

  function handleFilterChange(newFilter) {
    updateUrlParams({ filtro: newFilter }, true)

    const filterLabels = {
      upcoming: 'próximos eventos',
      today: 'eventos de hoy',
      week: 'eventos de esta semana',
      all: 'todos los eventos',
    }
    const label = filterLabels[newFilter] || newFilter
    const filtered = filterEvents(events, {
      query: searchQuery,
      activeFilter: newFilter,
      todayIso,
      weekRange,
    })
    const count = filtered.length
    if (count === 0) {
      setLiveAnnouncement(`No hay actividades en ${label}.`)
    } else if (count === 1) {
      setLiveAnnouncement(`1 evento en ${label}.`)
    } else {
      setLiveAnnouncement(`${count} eventos en ${label}.`)
    }
  }

  function handleViewModeChange(newMode) {
    updateUrlParams({ vista: newMode }, true)

    if (newMode === 'calendar') {
      setLiveAnnouncement(`Vista de calendario activada. Mes de ${MONTH_NAMES[calendarMonth - 1]} de ${calendarYear}.`)
    } else {
      setLiveAnnouncement('Vista de lista activada.')
    }
  }

  function handleSelectCalendarDate(dateIso) {
    updateUrlParams({ fecha: dateIso }, true)

    const dayCount = calendarEvents.filter((e) => e.date === dateIso).length
    const heading = formatDisplayDate(dateIso)
    if (dayCount === 0) {
      setLiveAnnouncement(`${heading}: sin actividades programadas.`)
    } else if (dayCount === 1) {
      setLiveAnnouncement(`${heading}: 1 actividad programada.`)
    } else {
      setLiveAnnouncement(`${heading}: ${dayCount} actividades programadas.`)
    }
  }

  function handleClearSearch() {
    setSearchQuery('')
    updateUrlParams({ q: '' }, true)
    setLiveAnnouncement('Búsqueda restablecida.')
  }

  function handleResetFilters() {
    setSearchQuery('')
    updateUrlParams({ q: '', filtro: 'upcoming' }, true)
    setLiveAnnouncement('Filtros restablecidos a próximos eventos.')
  }

  function handleChangeMonth(newYear, newMonth, newSelectedDate) {
    const targetDate = newSelectedDate || `${newYear}-${String(newMonth).padStart(2, '0')}-01`
    updateUrlParams({ fecha: targetDate }, true)

    const dayCount = calendarEvents.filter((e) => e.date === targetDate).length
    setLiveAnnouncement(`Mes de ${MONTH_NAMES[newMonth - 1]} de ${newYear}. ${dayCount} actividades para la fecha seleccionada.`)
  }

  const hasSearchQuery = Boolean(searchQuery.trim())

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1>Eventos</h1>
        <p className={styles.subtitle}>Encontrá las actividades de Villaguay.</p>
      </header>

      {/* Región viva accesible para anuncios dinámicos de búsqueda, filtros y selección */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={styles.visuallyHidden}
      >
        {liveAnnouncement}
      </div>

      {/* Barra de Controles: Buscador + Selector de Vistas + Filtros Temporales */}
      <div className={styles.controls}>
        <div className={styles.toolbarTop}>
          {/* Buscador Instantáneo */}
          <div className={styles.searchWrapper}>
            <label htmlFor="events-search-input" className={styles.visuallyHidden}>
              Buscar eventos
            </label>
            <Icon icon={Search} size={18} className={styles.searchIcon} />
            <input
              id="events-search-input"
              type="search"
              role="searchbox"
              className={styles.searchInput}
              placeholder="Buscar por título, lugar o descripción..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoComplete="off"
            />
            {hasSearchQuery ? (
              <button
                type="button"
                className={styles.clearButton}
                onClick={handleClearSearch}
                aria-label="Limpiar búsqueda"
                title="Limpiar búsqueda"
              >
                <Icon icon={X} size={16} />
              </button>
            ) : null}
          </div>

          {/* Selector de Vistas: Lista vs Calendario */}
          <div className={styles.viewSelector} role="group" aria-label="Seleccionar vista de eventos">
            <button
              type="button"
              className={`${styles.viewButton} ${viewMode === 'list' ? styles.viewButtonActive : ''}`}
              onClick={() => handleViewModeChange('list')}
              aria-pressed={viewMode === 'list'}
            >
              <Icon icon={LayoutList} size={16} />
              <span>Lista</span>
            </button>
            <button
              type="button"
              className={`${styles.viewButton} ${viewMode === 'calendar' ? styles.viewButtonActive : ''}`}
              onClick={() => handleViewModeChange('calendar')}
              aria-pressed={viewMode === 'calendar'}
            >
              <Icon icon={CalendarDays} size={16} />
              <span>Calendario</span>
            </button>
          </div>
        </div>

        {/* Filtros Temporales: Activos únicamente en vista Lista */}
        {viewMode === 'list' ? (
          <div className={styles.filterGroup} role="group" aria-label="Filtrar eventos por período">
            <button
              type="button"
              className={`${styles.filterButton} ${activeFilter === 'upcoming' ? styles.active : ''}`}
              onClick={() => handleFilterChange('upcoming')}
              aria-pressed={activeFilter === 'upcoming'}
            >
              Próximos
            </button>
            <button
              type="button"
              className={`${styles.filterButton} ${activeFilter === 'today' ? styles.active : ''}`}
              onClick={() => handleFilterChange('today')}
              aria-pressed={activeFilter === 'today'}
            >
              Hoy
            </button>
            <button
              type="button"
              className={`${styles.filterButton} ${activeFilter === 'week' ? styles.active : ''}`}
              onClick={() => handleFilterChange('week')}
              aria-pressed={activeFilter === 'week'}
            >
              Esta semana
            </button>
            <button
              type="button"
              className={`${styles.filterButton} ${activeFilter === 'all' ? styles.active : ''}`}
              onClick={() => handleFilterChange('all')}
              aria-pressed={activeFilter === 'all'}
            >
              Todos
            </button>
          </div>
        ) : null}

        {/* Resumen de estado de búsqueda cuando hay texto ingresado */}
        {hasSearchQuery && !loading && !error ? (
          <div className={styles.searchStatus}>
            <p className={styles.searchCount}>
              {viewMode === 'list'
                ? filteredAndSortedListEvents.length === 1
                  ? `1 resultado para “${searchQuery.trim()}”`
                  : `${filteredAndSortedListEvents.length} resultados para “${searchQuery.trim()}”`
                : calendarEvents.length === 1
                  ? `1 actividad coincide con “${searchQuery.trim()}” en el calendario`
                  : `${calendarEvents.length} actividades coinciden con “${searchQuery.trim()}” en el calendario`}
            </p>
            <button
              type="button"
              className={styles.resetSearchInline}
              onClick={handleClearSearch}
            >
              Limpiar búsqueda
            </button>
          </div>
        ) : null}
      </div>

      {loading && <p className={styles.message}>Cargando eventos...</p>}

      {!loading && error && (
        <p className={styles.message}>
          Ocurrió un problema al cargar los eventos. Intentá nuevamente en unos minutos.
        </p>
      )}

      {/* Renderizado de Vistas */}
      {!loading && !error && (
        <>
          {viewMode === 'calendar' ? (
            <EventCalendar
              events={calendarEvents}
              todayIso={todayIso}
              selectedDateIso={selectedCalendarDate}
              onSelectDate={handleSelectCalendarDate}
              year={calendarYear}
              month={calendarMonth}
              onChangeMonth={handleChangeMonth}
            />
          ) : (
            <>
              {/* Vista Lista: Estados Vacíos Contextuales */}
              {filteredAndSortedListEvents.length === 0 ? (
                <>
                  {events.length === 0 ? (
                    <EmptyState
                      title="Todavía no hay eventos disponibles"
                      description="Volvé a consultar pronto para enterarte de las actividades de Villaguay."
                    />
                  ) : hasSearchQuery ? (
                    <EmptyState
                      title={`No encontramos eventos para “${searchQuery.trim()}”`}
                      description={
                        activeFilter !== 'all'
                          ? 'No hay coincidencias para este período. Podés buscar en “Todos” o limpiar la búsqueda.'
                          : 'Probá con otros términos o limpiá la búsqueda para ver todas las actividades.'
                      }
                    >
                      <Button variant="secondary" onClick={handleClearSearch}>
                        Limpiar búsqueda
                      </Button>
                      {activeFilter !== 'all' ? (
                        <Button variant="ghost" onClick={() => handleFilterChange('all')}>
                          Buscar en todos los eventos
                        </Button>
                      ) : null}
                    </EmptyState>
                  ) : activeFilter === 'today' ? (
                    <EmptyState
                      title="Hoy no hay eventos programados"
                      description="Revisá las actividades de los próximos días o cambiá el filtro para ver la agenda completa."
                    >
                      <Button variant="secondary" onClick={() => handleFilterChange('upcoming')}>
                        Ver próximos eventos
                      </Button>
                    </EmptyState>
                  ) : activeFilter === 'week' ? (
                    <EmptyState
                      title="No hay eventos para esta semana"
                      description="No encontramos actividades programadas entre el lunes y el domingo de esta semana. Podés consultar los próximos eventos programados."
                    >
                      <Button variant="secondary" onClick={() => handleFilterChange('upcoming')}>
                        Ver próximos eventos
                      </Button>
                    </EmptyState>
                  ) : activeFilter === 'upcoming' ? (
                    <EmptyState
                      title="No hay próximos eventos programados"
                      description="Actualmente no hay actividades futuras registradas. Podés consultar eventos anteriores en “Todos”."
                    >
                      <Button variant="secondary" onClick={() => handleFilterChange('all')}>
                        Ver todos los eventos
                      </Button>
                    </EmptyState>
                  ) : (
                    <EmptyState
                      title="No hay eventos registrados"
                      description="Volvé a consultar pronto para enterarte de las actividades de Villaguay."
                    >
                      <Button variant="secondary" onClick={handleResetFilters}>
                        Restablecer filtros
                      </Button>
                    </EmptyState>
                  )}
                </>
              ) : (
                <ul className={styles.list}>
                  {filteredAndSortedListEvents.map((event) => (
                    <li key={event.id} className={styles.item}>
                      <EventCard event={event} />
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </>
      )}
    </section>
  )
}

export default Events

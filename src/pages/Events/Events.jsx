import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { useEvents } from '../../hooks/useEvents'
import EventCard from '../../components/event/EventCard'
import EmptyState from '../../components/ui/EmptyState/EmptyState'
import Button from '../../components/ui/Button/Button'
import Icon from '../../components/ui/Icon/Icon'
import {
  getArgentinaTodayIso,
  getArgentinaWeekRange,
  sortEventsByFilter,
} from '../../utils/dateUtils'
import { filterEvents } from '../../utils/searchUtils'
import styles from './Events.module.css'

function Events() {
  const { events, loading, error } = useEvents()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('upcoming') // 'upcoming' | 'today' | 'week' | 'all'

  // Fechas de referencia calculadas en la zona horaria canónica de Argentina (America/Argentina/Buenos_Aires).
  const todayIso = useMemo(() => getArgentinaTodayIso(), [])
  const weekRange = useMemo(() => getArgentinaWeekRange(), [])

  // Filtrado y ordenamiento combinados
  const filteredAndSortedEvents = useMemo(() => {
    const filtered = filterEvents(events, {
      query: searchQuery,
      activeFilter,
      todayIso,
      weekRange,
    })

    return sortEventsByFilter(filtered, activeFilter, todayIso)
  }, [events, searchQuery, activeFilter, todayIso, weekRange])

  function handleClearSearch() {
    setSearchQuery('')
  }

  function handleResetFilters() {
    setSearchQuery('')
    setActiveFilter('upcoming')
  }

  const hasSearchQuery = Boolean(searchQuery.trim())

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1>Eventos</h1>
        <p className={styles.subtitle}>Encontrá las próximas actividades de Villaguay.</p>
      </header>

      {/* Barra de Controles: Buscador + Filtros Temporales */}
      <div className={styles.controls}>
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

        <div className={styles.filterGroup} role="group" aria-label="Filtrar eventos por período">
          <button
            type="button"
            className={`${styles.filterButton} ${activeFilter === 'upcoming' ? styles.active : ''}`}
            onClick={() => setActiveFilter('upcoming')}
            aria-pressed={activeFilter === 'upcoming'}
          >
            Próximos
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
          <button
            type="button"
            className={`${styles.filterButton} ${activeFilter === 'all' ? styles.active : ''}`}
            onClick={() => setActiveFilter('all')}
            aria-pressed={activeFilter === 'all'}
          >
            Todos
          </button>
        </div>

        {/* Resumen de estado de búsqueda cuando hay texto ingresado */}
        {hasSearchQuery && !loading && !error && filteredAndSortedEvents.length > 0 ? (
          <div className={styles.searchStatus}>
            <p className={styles.searchCount}>
              {filteredAndSortedEvents.length === 1
                ? `1 resultado para “${searchQuery.trim()}”`
                : `${filteredAndSortedEvents.length} resultados para “${searchQuery.trim()}”`}
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

      {/* Estados vacíos contextuales */}
      {!loading && !error && filteredAndSortedEvents.length === 0 && (
        <>
          {events.length === 0 ? (
            <EmptyState
              title="Todavía no hay eventos disponibles"
              description="Volvé a consultar pronto para enterarte de las próximas actividades de Villaguay."
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
                <Button variant="ghost" onClick={() => setActiveFilter('all')}>
                  Buscar en todos los eventos
                </Button>
              ) : null}
            </EmptyState>
          ) : activeFilter === 'today' ? (
            <EmptyState
              title="Hoy no hay eventos programados"
              description="Revisá las actividades de los próximos días o cambiá el filtro para ver la agenda completa."
            >
              <Button variant="secondary" onClick={() => setActiveFilter('upcoming')}>
                Ver próximos eventos
              </Button>
            </EmptyState>
          ) : activeFilter === 'week' ? (
            <EmptyState
              title="No hay eventos para esta semana"
              description="No encontramos actividades programadas entre el lunes y el domingo de esta semana. Podés consultar los próximos eventos programados."
            >
              <Button variant="secondary" onClick={() => setActiveFilter('upcoming')}>
                Ver próximos eventos
              </Button>
            </EmptyState>
          ) : activeFilter === 'upcoming' ? (
            <EmptyState
              title="No hay próximos eventos programados"
              description="Actualmente no hay actividades futuras registradas. Podés consultar eventos anteriores en “Todos”."
            >
              <Button variant="secondary" onClick={() => setActiveFilter('all')}>
                Ver todos los eventos
              </Button>
            </EmptyState>
          ) : (
            <EmptyState
              title="No hay eventos registrados"
              description="Volvé a consultar pronto para enterarte de las próximas actividades de Villaguay."
            >
              <Button variant="secondary" onClick={handleResetFilters}>
                Restablecer filtros
              </Button>
            </EmptyState>
          )}
        </>
      )}

      {/* Listado de eventos */}
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

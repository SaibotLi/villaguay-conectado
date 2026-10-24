/**
 * Normaliza una cadena de texto para búsquedas insensibles a mayúsculas, minúsculas y tildes/diacríticos.
 *
 * Utiliza descomposición canónica NFD para separar caracteres de sus tildes y luego remueve
 * los bloques de diacríticos Unicode, además de limpiar espacios excedentes.
 *
 * @param {string} text - Texto original a normalizar.
 * @returns {string} Cadena normalizada en minúsculas, sin tildes ni espacios superfluos.
 */
export function normalizeSearchText(text) {
  if (!text || typeof text !== 'string') return ''

  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

/**
 * Evalúa si un evento individual cumple con el término de búsqueda ingresado.
 * La búsqueda evalúa si el término normalizado está contenido en el título, descripción o ubicación.
 *
 * @param {Object} event - Objeto que representa el evento.
 * @param {string} query - Término de búsqueda escrito por el usuario.
 * @returns {boolean} True si el evento coincide o si la búsqueda está vacía.
 */
export function matchesSearchQuery(event, query) {
  const normalizedQuery = normalizeSearchText(query)
  if (!normalizedQuery) return true
  if (!event) return false

  const matchTitle = normalizeSearchText(event.title).includes(normalizedQuery)
  const matchDesc = normalizeSearchText(event.description).includes(normalizedQuery)
  const matchLoc = normalizeSearchText(event.location).includes(normalizedQuery)

  return matchTitle || matchDesc || matchLoc
}

/**
 * Aplica de forma combinada los filtros de búsqueda textual y período temporal a una lista de eventos.
 *
 * @param {Array<Object>} events - Lista de eventos aprobados.
 * @param {Object} params - Parámetros de filtrado.
 * @param {string} [params.query] - Texto de búsqueda.
 * @param {'upcoming'|'today'|'week'|'all'} [params.activeFilter='upcoming'] - Filtro temporal.
 * @param {string} [params.todayIso] - Fecha ISO de hoy en Argentina.
 * @param {{ startOfWeek: string, endOfWeek: string }} [params.weekRange] - Rango ISO lunes-domingo de la semana actual.
 * @returns {Array<Object>} Lista filtrada resultante.
 */
export function filterEvents(events, { query = '', activeFilter = 'upcoming', todayIso = '', weekRange = null }) {
  if (!Array.isArray(events)) return []

  return events.filter((event) => {
    // 1. Filtrado textual instantáneo
    if (!matchesSearchQuery(event, query)) {
      return false
    }

    const eventDate = event?.date || ''

    // 2. Filtrado temporal
    if (activeFilter === 'today') {
      return eventDate === todayIso
    }

    if (activeFilter === 'week' && weekRange) {
      return eventDate >= weekRange.startOfWeek && eventDate <= weekRange.endOfWeek
    }

    if (activeFilter === 'upcoming') {
      return Boolean(todayIso && eventDate >= todayIso)
    }

    if (activeFilter === 'all') {
      return true
    }

    return true
  })
}

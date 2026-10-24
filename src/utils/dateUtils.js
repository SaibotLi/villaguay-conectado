/**
 * Zona horaria canónica oficial de Villaguay / Argentina.
 */
export const ARGENTINA_TIMEZONE = 'America/Argentina/Buenos_Aires'

/**
 * Formatea una fecha en formato ISO (YYYY-MM-DD) al formato estándar utilizado en Argentina (DD/MM/YYYY).
 *
 * @param {string} dateStr - Cadena de fecha en formato YYYY-MM-DD (ej. "2026-12-24")
 * @returns {string} Fecha formateada en formato DD/MM/YYYY (ej. "24/12/2026") o la cadena original si no es válida.
 */
export function formatDisplayDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return ''

  const parts = dateStr.trim().split('-')
  if (parts.length !== 3) return dateStr

  const [year, month, day] = parts
  if (year.length === 4 && month.length === 2 && day.length === 2) {
    return `${day}/${month}/${year}`
  }

  return dateStr
}

/**
 * Obtiene la fecha actual en la zona horaria de Argentina (America/Argentina/Buenos_Aires)
 * en formato ISO estándar YYYY-MM-DD.
 *
 * Utiliza Intl.DateTimeFormat con formatToParts() construyendo explícitamente el formato
 * YYYY-MM-DD, evitando cualquier dependencia del formato de salida localizado de un locale en particular.
 *
 * @param {Date} [now=new Date()] - Instancia Date de referencia (permite inyectar fechas en pruebas).
 * @returns {string} Fecha en formato "YYYY-MM-DD"
 */
export function getArgentinaTodayIso(now = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: ARGENTINA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const parts = formatter.formatToParts(now)
  let year = ''
  let month = ''
  let day = ''

  for (const part of parts) {
    if (part.type === 'year') year = part.value
    if (part.type === 'month') month = part.value
    if (part.type === 'day') day = part.value
  }

  return `${year}-${month}-${day}`
}

/**
 * Calcula el rango de fechas (lunes a domingo) de la semana calendario en curso en Argentina.
 *
 * La semana se define formalmente de lunes a domingo e incluye todas las fechas de la semana actual,
 * incluso aquellas previas al día de hoy dentro de la misma semana.
 *
 * Los cálculos se realizan fijando mediodía UTC a partir de los componentes de año, mes y día
 * obtenidos para Argentina, garantizando inmunidad frente a transiciones de huso horario o límites de mes/año.
 *
 * @param {Date} [now=new Date()] - Instancia Date de referencia.
 * @returns {{ startOfWeek: string, endOfWeek: string }} Fechas ISO "YYYY-MM-DD" del lunes y domingo.
 */
export function getArgentinaWeekRange(now = new Date()) {
  const todayIso = getArgentinaTodayIso(now)
  const [yearStr, monthStr, dayStr] = todayIso.split('-')
  const year = parseInt(yearStr, 10)
  const month = parseInt(monthStr, 10) - 1
  const day = parseInt(dayStr, 10)

  // Mediodía UTC correspondiente al día actual en Argentina
  const refDate = new Date(Date.UTC(year, month, day, 12, 0, 0))

  // getUTCDay: 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  const dayOfWeek = refDate.getUTCDay()
  // Distancia hacia el lunes previo (Lunes = 0, Martes = 1, ..., Domingo = 6)
  const distanceToMonday = (dayOfWeek + 6) % 7

  const monday = new Date(refDate)
  monday.setUTCDate(refDate.getUTCDate() - distanceToMonday)

  const sunday = new Date(monday)
  sunday.setUTCDate(monday.getUTCDate() + 6)

  const formatUtcIso = (d) => {
    const y = d.getUTCFullYear()
    const m = String(d.getUTCMonth() + 1).padStart(2, '0')
    const dt = String(d.getUTCDate()).padStart(2, '0')
    return `${y}-${m}-${dt}`
  }

  return {
    startOfWeek: formatUtcIso(monday),
    endOfWeek: formatUtcIso(sunday),
  }
}

/**
 * Ordena eventos según el filtro temporal activo y la fecha de referencia:
 *
 * - Para "upcoming", "today" y "week": orden cronológico ascendente (el más cercano primero: hoy -> mañana -> próximo mes).
 * - Para "all": los eventos futuros y de hoy se muestran primero en orden ascendente (más próximos primero);
 *   a continuación se muestran los eventos pasados/históricos en orden descendente (los más recientes primero).
 *
 * @param {Array<Object>} events - Lista de eventos a ordenar.
 * @param {'upcoming'|'today'|'week'|'all'} activeFilter - Filtro temporal activo.
 * @param {string} todayIso - Fecha ISO "YYYY-MM-DD" de referencia para hoy en Argentina.
 * @returns {Array<Object>} Nueva lista ordenada.
 */
export function sortEventsByFilter(events, activeFilter = 'upcoming', todayIso = '') {
  if (!Array.isArray(events)) return []

  return [...events].sort((a, b) => {
    const aDate = a?.date || ''
    const bDate = b?.date || ''
    const aTime = a?.time || ''
    const bTime = b?.time || ''

    if (activeFilter === 'all' && todayIso) {
      const aIsUpcoming = aDate >= todayIso
      const bIsUpcoming = bDate >= todayIso

      // Eventos próximos/actuales van antes que los históricos
      if (aIsUpcoming && !bIsUpcoming) return -1
      if (!aIsUpcoming && bIsUpcoming) return 1

      // Entre eventos próximos: ascendente (el más cercano primero)
      if (aIsUpcoming && bIsUpcoming) {
        if (aDate !== bDate) return aDate.localeCompare(bDate)
        return aTime.localeCompare(bTime)
      }

      // Entre eventos históricos: descendente (el más reciente primero)
      if (aDate !== bDate) return bDate.localeCompare(aDate)
      return bTime.localeCompare(aTime)
    }

    // Para upcoming, today y week: orden ascendente (más cercano primero)
    if (aDate !== bDate) return aDate.localeCompare(bDate)
    return aTime.localeCompare(bTime)
  })
}

/**
 * Zona horaria canónica oficial de Villaguay / Argentina.
 */
export const ARGENTINA_TIMEZONE = 'America/Argentina/Buenos_Aires'

/**
 * Nombres oficiales en español de los 12 meses del año.
 */
export const MONTH_NAMES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

/**
 * Nombres abreviados de los días de la semana (Lunes a Domingo).
 */
export const WEEKDAY_NAMES_SHORT = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

/**
 * Nombres completos de los días de la semana (Lunes a Domingo).
 */
export const WEEKDAY_NAMES_FULL = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
]

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
 * Construye una cadena de fecha canónica ISO "YYYY-MM-DD" a partir de componentes numéricos.
 *
 * @param {number} year - Año (ej. 2026)
 * @param {number} month - Mes 1-12 (ej. 10)
 * @param {number} day - Día 1-31 (ej. 24)
 * @returns {string} Fecha formateada "YYYY-MM-DD"
 */
export function formatIsoDate(year, month, day) {
  const y = String(year).padStart(4, '0')
  const m = String(month).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${y}-${m}-${d}`
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
 * Calcula el número de días que tiene un mes en un año específico (28 a 31).
 * Maneja automáticamente años bisiestos utilizando métodos puramente UTC.
 *
 * @param {number} year - Año de cuatro dígitos (ej. 2024, 2026).
 * @param {number} month - Mes 1-12 (1 = Enero, 12 = Diciembre).
 * @returns {number} Cantidad de días del mes.
 */
export function getDaysInMonth(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate()
}

/**
 * Obtiene el índice de día de la semana (0 = Lunes, ..., 6 = Domingo) en el que inicia el mes.
 *
 * @param {number} year - Año de cuatro dígitos.
 * @param {number} month - Mes 1-12.
 * @returns {number} Índice de 0 a 6 (0 = Lunes, 6 = Domingo).
 */
export function getFirstDayOfWeekInMonth(year, month) {
  const ref = new Date(Date.UTC(year, month - 1, 1, 12, 0, 0))
  const day = ref.getUTCDay() // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  return (day + 6) % 7
}

/**
 * Obtiene el año y mes adyacente navegando hacia adelante o atrás.
 *
 * @param {number} year - Año actual.
 * @param {number} month - Mes actual 1-12.
 * @param {-1|1} direction - Dirección (-1 anterior, 1 siguiente).
 * @returns {{ year: number, month: number }}
 */
export function getAdjacentMonth(year, month, direction) {
  if (direction === -1) {
    return month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 }
  }
  return month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 }
}

/**
 * Genera la cuadrícula de celdas para el calendario mensual.
 *
 * Maneja meses que ocupan 4, 5 o 6 semanas en el calendario gregoriano estándar (semana de Lunes a Domingo).
 * Mantiene un mínimo de 5 filas (35 celdas) por consistencia visual y hasta 6 filas (42 celdas) cuando el mes lo requiere.
 *
 * Todos los cálculos emplean métodos UTC puros para evitar desfasajes con zonas horarias locales.
 *
 * @param {number} year - Año 4 dígitos.
 * @param {number} month - Mes 1-12.
 * @param {string} [todayIso=''] - Fecha de hoy en Argentina en formato ISO para marcar isToday.
 * @returns {Array<{ dateIso: string, dayNumber: number, isCurrentMonth: boolean, month: number, year: number, isToday: boolean }>}
 */
export function getMonthCalendarGrid(year, month, todayIso = '') {
  const daysInCurrentMonth = getDaysInMonth(year, month)
  const firstDayOffset = getFirstDayOfWeekInMonth(year, month) // 0 a 6 días de relleno previo

  const { year: prevYear, month: prevMonth } = getAdjacentMonth(year, month, -1)
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth)

  const { year: nextYear, month: nextMonth } = getAdjacentMonth(year, month, 1)

  const cells = []

  // 1. Días de relleno del mes anterior
  for (let i = firstDayOffset - 1; i >= 0; i--) {
    const dayNumber = daysInPrevMonth - i
    const dateIso = formatIsoDate(prevYear, prevMonth, dayNumber)
    cells.push({
      dateIso,
      dayNumber,
      isCurrentMonth: false,
      month: prevMonth,
      year: prevYear,
      isToday: dateIso === todayIso,
    })
  }

  // 2. Días del mes en curso
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    const dateIso = formatIsoDate(year, month, d)
    cells.push({
      dateIso,
      dayNumber: d,
      isCurrentMonth: true,
      month,
      year,
      isToday: dateIso === todayIso,
    })
  }

  // 3. Días de relleno del mes siguiente (garantizando filas completas de 7 celdas y mínimo 5 semanas)
  const remainder = cells.length % 7
  let nextPaddingCount = remainder === 0 ? 0 : 7 - remainder

  while (cells.length + nextPaddingCount < 35) {
    nextPaddingCount += 7
  }

  for (let d = 1; d <= nextPaddingCount; d++) {
    const dateIso = formatIsoDate(nextYear, nextMonth, d)
    cells.push({
      dateIso,
      dayNumber: d,
      isCurrentMonth: false,
      month: nextMonth,
      year: nextYear,
      isToday: dateIso === todayIso,
    })
  }

  return cells
}

/**
 * Agrupa una lista de eventos por su fecha ISO "YYYY-MM-DD".
 *
 * @param {Array<Object>} events - Lista de eventos.
 * @returns {Record<string, Array<Object>>} Mapa indexado por fecha.
 */
export function groupEventsByDate(events) {
  if (!Array.isArray(events)) return {}

  const map = {}
  for (const event of events) {
    const date = event?.date
    if (!date || typeof date !== 'string') continue
    if (!map[date]) {
      map[date] = []
    }
    map[date].push(event)
  }
  return map
}

/**
 * Formatea un encabezado amigable para la fecha seleccionada en el calendario.
 * Ejemplo: "Sábado 24 de Octubre de 2026"
 *
 * @param {string} dateIso - Cadena de fecha "YYYY-MM-DD"
 * @returns {string} Fecha formateada en español o la cadena original si es inválida.
 */
export function formatDayHeading(dateIso) {
  if (!dateIso || typeof dateIso !== 'string') return ''
  const parts = dateIso.trim().split('-')
  if (parts.length !== 3) return dateIso

  const [yStr, mStr, dStr] = parts
  const y = parseInt(yStr, 10)
  const m = parseInt(mStr, 10)
  const d = parseInt(dStr, 10)
  if (isNaN(y) || isNaN(m) || isNaN(d) || m < 1 || m > 12) return dateIso

  const dateUtc = new Date(Date.UTC(y, m - 1, d, 12, 0, 0))
  const dayOfWeek = (dateUtc.getUTCDay() + 6) % 7
  const weekday = WEEKDAY_NAMES_FULL[dayOfWeek]
  const monthName = MONTH_NAMES[m - 1]

  return `${weekday} ${d} de ${monthName.toLowerCase()} de ${y}`
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

/**
 * Determina si una fecha ISO YYYY-MM-DD corresponde a un evento finalizado
 * comparándola con la fecha actual de Argentina.
 *
 * @param {string} dateStr - Cadena de fecha en formato YYYY-MM-DD.
 * @param {string} [todayIso] - Fecha canónica actual en Argentina (opcional).
 * @returns {boolean} True si la fecha es estrictamente anterior a todayIso.
 */
export function isEventPast(dateStr, todayIso = getArgentinaTodayIso()) {
  if (!dateStr || typeof dateStr !== 'string') return false
  const trimmed = dateStr.trim()
  if (!trimmed || !todayIso) return false
  return trimmed < todayIso
}

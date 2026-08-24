const DEFAULT_TIMEZONE = 'America/Argentina/Buenos_Aires'
const DEFAULT_DURATION_HOURS = 1

/**
 * Formatea un número con ceros a la izquierda a dos dígitos.
 * @param {number} num
 * @returns {string}
 */
function pad2(num) {
  return String(num).padStart(2, '0')
}

/**
 * Formatea un objeto Date a formato compacto YYYYMMDDTHHmmss (hora local).
 * @param {Date} date
 * @returns {string}
 */
function formatDateTimeCompact(date) {
  const year = date.getFullYear()
  const month = pad2(date.getMonth() + 1)
  const day = pad2(date.getDate())
  const hours = pad2(date.getHours())
  const minutes = pad2(date.getMinutes())
  const seconds = pad2(date.getSeconds())
  return `${year}${month}${day}T${hours}${minutes}${seconds}`
}

/**
 * Formatea un objeto Date a formato compacto YYYYMMDD (fecha sin hora).
 * @param {Date} date
 * @returns {string}
 */
function formatDateCompact(date) {
  const year = date.getFullYear()
  const month = pad2(date.getMonth() + 1)
  const day = pad2(date.getDate())
  return `${year}${month}${day}`
}

/**
 * Construye el string de fechas (start/end) para Google Calendar a partir de los campos del evento.
 *
 * Si el evento no cuenta con hora de finalización, se aplica un fallback técnico
 * estándar de 1 hora de duración para que Google Calendar configure un bloque de tiempo válido.
 * Si el evento no tiene hora de inicio, se formatea como evento de todo el día.
 *
 * @param {string} dateStr - Fecha en formato YYYY-MM-DD
 * @param {string} [timeStr] - Hora en formato HH:mm
 * @returns {string|null} Rango de fechas compacto (ej. "20260825T183000/20260825T193000") o null si no es válida.
 */
export function formatCalendarDates(dateStr, timeStr) {
  if (!dateStr || typeof dateStr !== 'string') return null

  const dateParts = dateStr.trim().split('-')
  if (dateParts.length !== 3) return null

  const year = parseInt(dateParts[0], 10)
  const month = parseInt(dateParts[1], 10) - 1
  const day = parseInt(dateParts[2], 10)

  if (isNaN(year) || isNaN(month) || isNaN(day)) return null

  const hasTime = Boolean(timeStr && typeof timeStr === 'string' && timeStr.includes(':'))

  if (hasTime) {
    const timeParts = timeStr.trim().split(':')
    const hours = parseInt(timeParts[0], 10)
    const minutes = parseInt(timeParts[1], 10)

    if (!isNaN(hours) && !isNaN(minutes)) {
      const startDate = new Date(year, month, day, hours, minutes, 0, 0)
      const endDate = new Date(startDate.getTime() + DEFAULT_DURATION_HOURS * 60 * 60 * 1000)

      return `${formatDateTimeCompact(startDate)}/${formatDateTimeCompact(endDate)}`
    }
  }

  // Evento de todo el día (sin hora específica o inválida)
  const startDate = new Date(year, month, day, 0, 0, 0, 0)
  const endDate = new Date(year, month, day + 1, 0, 0, 0, 0)

  return `${formatDateCompact(startDate)}/${formatDateCompact(endDate)}`
}

/**
 * Construye la URL de plantilla de Google Calendar para precompletar el evento.
 *
 * @param {Object} event - Objeto del evento con title, description, date, time, location
 * @returns {string|null} URL completa de Google Calendar o null si no se puede construir
 */
export function buildGoogleCalendarUrl(event) {
  if (!event || !event.date) return null

  const datesParam = formatCalendarDates(event.date, event.time)
  if (!datesParam) return null

  const params = new URLSearchParams()
  params.set('action', 'TEMPLATE')

  if (event.title) {
    params.set('text', event.title.trim())
  }

  params.set('dates', datesParam)

  if (event.description) {
    params.set('details', event.description.trim())
  }

  if (event.location) {
    params.set('location', event.location.trim())
  }

  // Parámetros de zona horaria oficial para Argentina
  params.set('ctz', DEFAULT_TIMEZONE)
  params.set('stz', DEFAULT_TIMEZONE)
  params.set('etz', DEFAULT_TIMEZONE)

  return `https://calendar.google.com/calendar/r/eventedit?${params.toString()}`
}

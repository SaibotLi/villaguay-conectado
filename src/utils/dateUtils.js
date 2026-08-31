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

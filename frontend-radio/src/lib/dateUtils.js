// Convierte cualquier string seguro o Date a YYYY-MM-DD string
export function normalizeDateToString(date) {
  if (!date) return '';
  if (typeof date === 'string') {
    const match = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
    return match ? `${match[1]}-${match[2]}-${match[3]}` : '';
  }
  if (date instanceof Date && !isNaN(date.getTime())) {
    return date.toISOString().slice(0, 10);
  }
  return '';
}

// Para inputs tipo <input type="date">
export function formatDateForInput(date) {
  return normalizeDateToString(date);
}

// Para mostrar en tabla o UI DD/MM/YYYY
export function formatDateLocal(date) {
  const str = normalizeDateToString(date);
  if (!str) return '—';
  return str.split('-').reverse().join('/');
}

// Comparar fechas string YYYY-MM-DD
export function compareDateStrings(a, b) {
  if (!a || !b) return 0;
  return a.localeCompare(b);
}

// Fecha de hoy en local YYYY-MM-DD
export function todayLocal() {
  const t = new Date();
  return t.toISOString().slice(0, 10);
}
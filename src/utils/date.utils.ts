const LOCALE = 'es-EC'

export const dateUtils = {
  /** Full date + time: "23/02/2026, 14:35" — returns "—" if the value is missing or unparseable */
  format(dateString: string | null | undefined): string {
    if (!dateString) return '—'
    const d = new Date(dateString)
    if (isNaN(d.getTime())) return '—'
    return new Intl.DateTimeFormat(LOCALE, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d)
  },

  /** Date only: "23/02/2026" — returns "—" if the value is missing or unparseable */
  formatDate(dateString: string | null | undefined): string {
    if (!dateString) return '—'
    const d = new Date(dateString)
    if (isNaN(d.getTime())) return '—'
    return new Intl.DateTimeFormat(LOCALE, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(d)
  },

  /** Currency amount: "$1,250.00" */
  formatCurrency(amount: number, currency = 'USD'): string {
    return new Intl.NumberFormat(LOCALE, {
      style: 'currency',
      currency,
    }).format(amount)
  },
}

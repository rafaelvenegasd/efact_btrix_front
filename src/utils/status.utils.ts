import {
  InvoiceStatus,
  PENDING_STATUSES,
  TERMINAL_STATUSES,
} from '@/features/invoices/types/invoice.types'

export const statusUtils = {
  isPending(status: InvoiceStatus): boolean {
    return PENDING_STATUSES.includes(status)
  },

  isTerminal(status: InvoiceStatus): boolean {
    return TERMINAL_STATUSES.includes(status)
  },

  isAuthorized(status: InvoiceStatus): boolean {
    return status === InvoiceStatus.AUTHORIZED
  },

  /** Human-readable Spanish label for each status. */
  getLabel(status: InvoiceStatus): string {
    const labels: Record<InvoiceStatus, string> = {
      [InvoiceStatus.DRAFT]: 'Borrador',
      [InvoiceStatus.SIGNED]: 'Firmada',
      [InvoiceStatus.SENT]: 'Enviada al SRI',
      [InvoiceStatus.AUTHORIZED]: 'Autorizada',
      [InvoiceStatus.REJECTED]: 'Rechazada',
      [InvoiceStatus.ERROR]: 'Error',
    }
    return labels[status]
  },

  /** Tailwind color classes for the status badge. */
  getColorClass(status: InvoiceStatus): string {
    const colors: Record<InvoiceStatus, string> = {
      [InvoiceStatus.DRAFT]: 'bg-gray-100 text-gray-700',
      [InvoiceStatus.SIGNED]: 'bg-blue-100 text-blue-700',
      [InvoiceStatus.SENT]: 'bg-yellow-100 text-yellow-700',
      [InvoiceStatus.AUTHORIZED]: 'bg-green-100 text-green-700',
      [InvoiceStatus.REJECTED]: 'bg-red-100 text-red-700',
      [InvoiceStatus.ERROR]: 'bg-orange-100 text-orange-700',
    }
    return colors[status]
  },
}

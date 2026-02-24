// ─── Status enum ────────────────────────────────────────────────────────────

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SIGNED = 'SIGNED',
  SENT = 'SENT',
  AUTHORIZED = 'AUTHORIZED',
  REJECTED = 'REJECTED',
  ERROR = 'ERROR',
}

/**
 * Statuses that indicate the invoice is still being processed by the SRI.
 * Polling should be active while in any of these states.
 */
export const PENDING_STATUSES: InvoiceStatus[] = [
  InvoiceStatus.DRAFT,
  InvoiceStatus.SIGNED,
  InvoiceStatus.SENT,
]

/**
 * Statuses that indicate the SRI process has finished (success or failure).
 * Polling must stop once any of these states is reached.
 */
export const TERMINAL_STATUSES: InvoiceStatus[] = [
  InvoiceStatus.AUTHORIZED,
  InvoiceStatus.REJECTED,
  InvoiceStatus.ERROR,
]

// ─── Domain models ───────────────────────────────────────────────────────────

export interface Invoice {
  id: string
  accessKey: string
  status: InvoiceStatus
  issueDate: string
  buyerName: string
  buyerTaxId: string
  totalAmount: number
  currency: string
  pdfUrl?: string
  xmlUrl?: string
  createdAt: string
  updatedAt: string
}

export interface InvoiceStatusResponse {
  id: string
  status: InvoiceStatus
  updatedAt: string
  authorizationNumber?: string
  rejectionReason?: string
}

// ─── Request / Response DTOs ─────────────────────────────────────────────────

export type TipoIdentificacion = '04' | '05' | '06' | '07'

export interface EmitInvoiceComprador {
  tipoIdentificacion: TipoIdentificacion
  razonSocial: string
  identificacion: string
  email?: string
}

export interface EmitInvoiceItem {
  codigoPrincipal: string
  descripcion: string
  cantidad: number
  precioUnitario: number
}

export interface EmitInvoicePayload {
  dealId: string
  ambiente?: 'TEST' | 'PROD'
  comprador: EmitInvoiceComprador
  items: EmitInvoiceItem[]
}

export interface EmitInvoiceResponse {
  invoiceId: string
  status: InvoiceStatus
  message: string
}

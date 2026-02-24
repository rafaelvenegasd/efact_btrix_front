import { Spinner } from '@/components/ui/Spinner'
import { dateUtils } from '@/utils/date.utils'
import { statusUtils } from '@/utils/status.utils'
import { InvoiceStatus, type Invoice } from '../types/invoice.types'
import { InvoiceStatusBadge } from './InvoiceStatusBadge'

interface InvoiceDetailProps {
  invoice: Invoice
  /** True while the status polling loop is active */
  isPolling?: boolean
}

export function InvoiceDetail({ invoice, isPolling = false }: InvoiceDetailProps) {
  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Factura Electrónica</h2>
          <p className="mt-1 text-sm text-gray-500">
            Emitida el {dateUtils.format(invoice.issueDate)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isPolling && (
            <span className="flex items-center gap-1.5 text-xs text-yellow-600">
              <Spinner size="sm" />
              Verificando con SRI...
            </span>
          )}
          <InvoiceStatusBadge status={invoice.status} />
        </div>
      </div>

      {/* ── Pending banner ───────────────────────────────────────────────── */}
      {statusUtils.isPending(invoice.status) && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3">
          <p className="text-sm font-medium text-yellow-800">
            Factura en proceso de autorización
          </p>
          <p className="mt-0.5 text-xs text-yellow-600">
            El SRI está procesando la solicitud. El estado se actualizará automáticamente.
          </p>
        </div>
      )}

      {/* ── Rejected banner ──────────────────────────────────────────────── */}
      {invoice.status === InvoiceStatus.REJECTED && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-800">Factura rechazada por el SRI</p>
        </div>
      )}

      {/* ── Data grid ───────────────────────────────────────────────────── */}
      <dl className="grid grid-cols-1 gap-4 rounded-lg border border-gray-200 p-4 sm:grid-cols-2">
        <InfoRow label="Comprador" value={invoice.buyerName} />
        <InfoRow label="RUC / Cédula" value={invoice.buyerTaxId} />
        <InfoRow
          label="Total"
          value={dateUtils.formatCurrency(invoice.totalAmount, invoice.currency)}
        />
        <InfoRow label="Clave de acceso" value={invoice.accessKey} mono />
      </dl>

      {/* ── PDF download (only when authorized) ─────────────────────────── */}
      {invoice.status === InvoiceStatus.AUTHORIZED && invoice.pdfUrl && (
        <div className="flex justify-end">
          <a
            href={invoice.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Descargar PDF
          </a>
        </div>
      )}
    </div>
  )
}

// ── Internal helper ──────────────────────────────────────────────────────────

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className={`mt-0.5 text-sm text-gray-900 ${mono ? 'break-all font-mono text-xs' : ''}`}>
        {value}
      </dd>
    </div>
  )
}

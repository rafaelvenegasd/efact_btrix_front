import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Spinner } from '@/components/ui/Spinner'
import { InvoiceListTable } from '../components/InvoiceListTable'
import { useInvoices } from '../hooks/useInvoices'

export function InvoicesPage() {
  const { invoices, isLoading, error, refresh } = useInvoices()

  return (
    <div className="space-y-5">
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Historial de facturas</h1>
        <button
          onClick={refresh}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          Actualizar
        </button>
      </div>

      {/* ── Loading ─────────────────────────────────────────────────────── */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      )}

      {/* ── Error ───────────────────────────────────────────────────────── */}
      {!isLoading && error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-700">Error al cargar las facturas</p>
          <p className="mt-1 text-xs text-red-500">{error.message}</p>
          <button
            onClick={refresh}
            className="mt-3 text-sm font-medium text-blue-600 hover:underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* ── Table ───────────────────────────────────────────────────────── */}
      {!isLoading && !error && (
        <ErrorBoundary>
          <InvoiceListTable invoices={invoices} />
        </ErrorBoundary>
      )}
    </div>
  )
}

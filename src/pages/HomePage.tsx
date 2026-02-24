import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Spinner } from '@/components/ui/Spinner'
import { useBitrixContext } from '@/features/bitrix/hooks/useBitrixContext'
import { useBitrixDealData } from '@/features/bitrix/hooks/useBitrixDealData'
import { InvoiceForm } from '@/features/invoices/components/InvoiceForm'
import { InvoiceStatusBadge } from '@/features/invoices/components/InvoiceStatusBadge'
import { useInvoiceStatus } from '@/features/invoices/hooks/useInvoiceStatus'
import { statusUtils } from '@/utils/status.utils'

/**
 * Main entry point rendered inside the Bitrix24 iframe.
 *
 * Flow:
 *  1. Reads the Bitrix24 placement context (dealId, etc.)
 *  2. Fetches deal + contact data from Btrix (simulated with useBitrixDealData)
 *  3. Pre-populates an editable form so the user can review/adjust before emitting
 *  4. After emission, tracks the invoice status with live polling
 */
export function HomePage() {
  const { context, isLoading: isLoadingContext } = useBitrixContext()
  const { data: dealData, isLoading: isLoadingDeal } = useBitrixDealData(context)

  const [lastInvoiceId, setLastInvoiceId] = useState<string | null>(null)

  const { statusData, isPolling, isLoading: isLoadingStatus } = useInvoiceStatus(lastInvoiceId)

  const handleInvoiceEmitted = (invoiceId: string) => {
    setLastInvoiceId(invoiceId)
  }

  const isLoadingData = isLoadingContext || isLoadingDeal

  return (
    <div className="space-y-6">
      {/* ── Emit card ────────────────────────────────────────────────────── */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">Emitir nueva factura</h2>
        <p className="mt-1 text-sm text-gray-500">
          Revisa y ajusta los datos antes de emitir la factura electrónica para el
          negocio&nbsp;
          {context?.dealId ? (
            <span className="font-medium text-gray-700">#{context.dealId}</span>
          ) : (
            'actual'
          )}
        </p>

        <div className="mt-5">
          {isLoadingData ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Spinner size="sm" />
              <span>Cargando datos desde Bitrix...</span>
            </div>
          ) : dealData ? (
            <InvoiceForm initialData={dealData} onSuccess={handleInvoiceEmitted} />
          ) : (
            <p className="text-sm text-red-600">
              No se pudieron cargar los datos del negocio.
            </p>
          )}
        </div>
      </section>

      {/* ── Status card (shown after first emit) ─────────────────────────── */}
      {lastInvoiceId && (
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Estado de la factura</h2>

          {isLoadingStatus ? (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <Spinner size="sm" />
              <span>Consultando estado...</span>
            </div>
          ) : statusData ? (
            <div className="mt-4 space-y-3">
              {/* Badge + live indicator */}
              <div className="flex items-center gap-3">
                <InvoiceStatusBadge status={statusData.status} />

                {isPolling && (
                  <span className="flex items-center gap-1.5 text-xs text-yellow-600">
                    <Spinner size="sm" />
                    Verificando con el SRI...
                  </span>
                )}
              </div>

              {/* Pending message */}
              {statusUtils.isPending(statusData.status) && (
                <p className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                  Factura en proceso de autorización
                </p>
              )}

              {/* Link to detail once we have a terminal state */}
              {statusUtils.isTerminal(statusData.status) && (
                <Link
                  to={`/invoices/${lastInvoiceId}`}
                  className="inline-block text-sm font-medium text-blue-600 hover:underline"
                >
                  Ver detalle completo →
                </Link>
              )}
            </div>
          ) : null}
        </section>
      )}
    </div>
  )
}

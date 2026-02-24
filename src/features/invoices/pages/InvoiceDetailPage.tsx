import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import useSWR from 'swr'
import { Spinner } from '@/components/ui/Spinner'
import { invoicesApi } from '@/api/invoices.api'
import { statusUtils } from '@/utils/status.utils'
import { InvoiceDetail } from '../components/InvoiceDetail'
import { useInvoiceStatus } from '../hooks/useInvoiceStatus'
import type { Invoice } from '../types/invoice.types'

export function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>()

  // ── Fetch full invoice data ───────────────────────────────────────────────
  const {
    data: invoice,
    error,
    isLoading,
    mutate: revalidateInvoice,
  } = useSWR<Invoice>(
    id ? `/invoices/${id}` : null,
    () => invoicesApi.getById(id!),
    { revalidateOnFocus: false }
  )

  // ── Poll status separately ───────────────────────────────────────────────
  const { statusData, isPolling } = useInvoiceStatus(id ?? null)

  // When SRI finishes processing, re-fetch the full invoice
  // (so we get the fresh pdfUrl, authorizationNumber, etc.)
  useEffect(() => {
    if (statusData && statusUtils.isTerminal(statusData.status)) {
      void revalidateInvoice()
    }
    // revalidateInvoice is stable — only re-run when status changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusData?.status])

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    )
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error || !invoice) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-700">No se pudo cargar la factura</p>
        <Link
          to="/invoices"
          className="mt-3 block text-sm font-medium text-blue-600 hover:underline"
        >
          ← Volver al historial
        </Link>
      </div>
    )
  }

  // Merge the live status into the invoice so InvoiceDetail is always current
  const effectiveInvoice: Invoice = statusData
    ? { ...invoice, status: statusData.status }
    : invoice

  return (
    <div className="space-y-4">
      <Link
        to="/invoices"
        className="inline-block text-sm font-medium text-blue-600 hover:underline"
      >
        ← Volver al historial
      </Link>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <InvoiceDetail invoice={effectiveInvoice} isPolling={isPolling} />
      </div>
    </div>
  )
}

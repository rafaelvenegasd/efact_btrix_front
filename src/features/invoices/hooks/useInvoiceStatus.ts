import useSWR from 'swr'
import { invoicesApi } from '@/api/invoices.api'
import { statusUtils } from '@/utils/status.utils'
import type { InvoiceStatusResponse } from '../types/invoice.types'

const POLLING_MS = Number(import.meta.env.VITE_POLLING_INTERVAL_MS) || 5_000

/**
 * Polls GET /invoices/:id/status with a dynamic refresh interval.
 *
 * Polling strategy:
 *  - Active (every POLLING_MS) while status is DRAFT | SIGNED | SENT
 *  - Disabled automatically once status is AUTHORIZED | REJECTED | ERROR
 *
 * Pass `null` as invoiceId to disable the hook entirely (e.g. before emit).
 */
export function useInvoiceStatus(invoiceId: string | null) {
  const { data, error, isLoading } = useSWR<InvoiceStatusResponse>(
    invoiceId ? `/invoices/${invoiceId}/status` : null,
    () => invoicesApi.getStatus(invoiceId!),
    {
      revalidateOnFocus: false,
      /**
       * SWR v2 supports a function for refreshInterval.
       * Receives the latest cached data; returning 0 stops polling.
       */
      refreshInterval: (latestData: InvoiceStatusResponse | undefined) => {
        if (!latestData) return POLLING_MS
        return statusUtils.isPending(latestData.status) ? POLLING_MS : 0
      },
    }
  )

  return {
    statusData: data,
    /** True while the SRI is still processing (polling is active). */
    isPolling: data ? statusUtils.isPending(data.status) : false,
    isTerminal: data ? statusUtils.isTerminal(data.status) : false,
    isAuthorized: data ? statusUtils.isAuthorized(data.status) : false,
    isLoading,
    error: error as Error | undefined,
  }
}

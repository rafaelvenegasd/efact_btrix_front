import useSWR from 'swr'
import { invoicesApi } from '@/api/invoices.api'
import type { Invoice } from '../types/invoice.types'

const INVOICES_KEY = '/invoices'

/**
 * Fetches the full invoice list.
 * Revalidates on mount; does NOT poll (list is not time-critical).
 */
export function useInvoices() {
  const { data, error, isLoading, mutate } = useSWR<Invoice[]>(
    INVOICES_KEY,
    () => invoicesApi.getAll(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 10_000,
    }
  )

  return {
    invoices: data ?? [],
    isLoading,
    error: error as Error | undefined,
    /** Manually trigger a refetch (e.g. after emitting a new invoice). */
    refresh: () => mutate(),
  }
}

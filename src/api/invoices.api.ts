import { apiClient } from './axios'
import type {
  Invoice,
  InvoiceStatusResponse,
} from '@/features/invoices/types/invoice.types'

/**
 * HTTP services for the /invoices resource.
 * All methods are pure async functions — no local state, no side effects.
 */
export const invoicesApi = {
  async getAll(): Promise<Invoice[]> {
    const { data } = await apiClient.get<Invoice[] | { data: Invoice[] }>('/invoices')
    return Array.isArray(data) ? data : (data.data ?? [])
  },

  async getById(id: string): Promise<Invoice> {
    const { data } = await apiClient.get<Invoice>(`/invoices/${id}`)
    return data
  },

  async getStatus(id: string): Promise<InvoiceStatusResponse> {
    const { data } = await apiClient.get<InvoiceStatusResponse>(
      `/invoices/${id}/status`
    )
    return data
  },
}

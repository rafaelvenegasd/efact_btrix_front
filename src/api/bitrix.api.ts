import { apiClient } from './axios'
import type {
  EmitInvoicePayload,
  EmitInvoiceResponse,
} from '@/features/invoices/types/invoice.types'

/**
 * HTTP services for Bitrix24-specific backend endpoints.
 */
export const bitrixApi = {
  async emitInvoice(payload: EmitInvoicePayload): Promise<EmitInvoiceResponse> {
    const { data } = await apiClient.post<EmitInvoiceResponse>(
      '/bitrix/emit-invoice',
      payload
    )
    return data
  },
}

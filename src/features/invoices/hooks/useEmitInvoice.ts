import { useState } from 'react'
import { bitrixApi } from '@/api/bitrix.api'
import { AppApiError } from '@/api/axios'
import type { EmitInvoicePayload, EmitInvoiceResponse } from '../types/invoice.types'

interface UseEmitInvoiceReturn {
  emitInvoice: (payload: EmitInvoicePayload) => Promise<EmitInvoiceResponse | null>
  isLoading: boolean
  error: string | null
  reset: () => void
}

/**
 * Encapsulates the emit-invoice mutation.
 * Returns null on failure so callers can branch without try/catch.
 */
export function useEmitInvoice(): UseEmitInvoiceReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const emitInvoice = async (
    payload: EmitInvoicePayload
  ): Promise<EmitInvoiceResponse | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await bitrixApi.emitInvoice(payload)
      return result
    } catch (err) {
      const message =
        err instanceof AppApiError ? err.message : 'Error al emitir la factura'
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    emitInvoice,
    isLoading,
    error,
    reset: () => setError(null),
  }
}

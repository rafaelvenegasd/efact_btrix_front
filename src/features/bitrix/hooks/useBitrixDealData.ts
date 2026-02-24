import { useEffect, useState } from 'react'
import type { EmitInvoicePayload } from '@/features/invoices/types/invoice.types'
import type { BitrixContext } from '../types/bitrix.types'

interface UseBitrixDealDataReturn {
  data: EmitInvoicePayload | null
  isLoading: boolean
  error: string | null
}

/**
 * Simulates an async call to Bitrix24 to fetch deal + contact data.
 *
 * In production this would call the Btrix REST API (or BX24.callMethod) to
 * retrieve deal fields, contact details, and product rows, then map them to
 * an EmitInvoicePayload.
 *
 * For now it returns hard-coded sample data after a short artificial delay so
 * the loading state and form pre-population flow can be developed and tested
 * without a real Bitrix instance.
 */
export function useBitrixDealData(context: BitrixContext | null): UseBitrixDealDataReturn {
  const [data, setData] = useState<EmitInvoicePayload | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!context) return

    setIsLoading(true)
    setError(null)
    setData(null)

    // Simulate network latency of a Btrix API call
    const timer = setTimeout(() => {
      setData({
        dealId: context.dealId ?? '456',
        ambiente: 'TEST',
        comprador: {
          tipoIdentificacion: '05',
          razonSocial: 'Juan Pérez',
          identificacion: '0912345678',
          email: 'juan@example.com',
        },
        items: [
          {
            codigoPrincipal: 'PROD-001',
            descripcion: 'Servicio de consultoría',
            cantidad: 1,
            precioUnitario: 100.0,
          },
        ],
      })
      setIsLoading(false)
    }, 900)

    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context])

  return { data, isLoading, error }
}

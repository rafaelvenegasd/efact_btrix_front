import { Button } from '@/components/ui/Button'
import { useToast } from '@/hooks/useToast'
import { useEmitInvoice } from '../hooks/useEmitInvoice'
import type { EmitInvoicePayload } from '../types/invoice.types'

interface EmitInvoiceButtonProps {
  payload: EmitInvoicePayload
  onSuccess?: (invoiceId: string) => void
}

/**
 * Presentational wrapper around the emit-invoice mutation.
 * Owns the loading state and toast feedback; delegates HTTP to useEmitInvoice.
 */
export function EmitInvoiceButton({ payload, onSuccess }: EmitInvoiceButtonProps) {
  const { emitInvoice, isLoading } = useEmitInvoice()
  const toast = useToast()

  const handleClick = async () => {
    const result = await emitInvoice(payload)

    if (result) {
      toast.success('Factura emitida correctamente')
      onSuccess?.(result.invoiceId)
    } else {
      toast.error('No se pudo emitir la factura. Inténtelo nuevamente.')
    }
  }

  return (
    <Button onClick={handleClick} isLoading={isLoading} size="lg">
      Emitir factura
    </Button>
  )
}

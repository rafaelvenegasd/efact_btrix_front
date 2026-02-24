import { Badge } from '@/components/ui/Badge'
import { statusUtils } from '@/utils/status.utils'
import { type InvoiceStatus } from '../types/invoice.types'

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus
}

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  return (
    <Badge className={statusUtils.getColorClass(status)}>
      {statusUtils.getLabel(status)}
    </Badge>
  )
}

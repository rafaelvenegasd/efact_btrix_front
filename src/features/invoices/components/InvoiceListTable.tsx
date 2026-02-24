import { Link } from 'react-router-dom'
import { dateUtils } from '@/utils/date.utils'
import { InvoiceStatusBadge } from './InvoiceStatusBadge'
import type { Invoice } from '../types/invoice.types'

interface InvoiceListTableProps {
  invoices: Invoice[]
}

export function InvoiceListTable({ invoices }: InvoiceListTableProps) {
  if (invoices.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
        <p className="text-sm font-medium text-gray-500">No hay facturas emitidas todavía</p>
        <p className="mt-1 text-xs text-gray-400">
          Usa el botón "Emitir factura" para generar la primera
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <Th>Fecha</Th>
            <Th>Estado</Th>
            <Th>Clave de acceso</Th>
            <Th align="right">Acciones</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {dateUtils.formatDate(invoice.issueDate)}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <InvoiceStatusBadge status={invoice.status} />
              </td>
              <td className="px-6 py-4">
                <span
                  className="block max-w-xs truncate font-mono text-xs text-gray-600"
                  title={invoice.accessKey}
                >
                  {invoice.accessKey}
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right">
                <Link
                  to={`/invoices/${invoice.id}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Ver detalle
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Th({
  children,
  align = 'left',
}: {
  children: string
  align?: 'left' | 'right'
}) {
  return (
    <th
      className={`px-6 py-3 text-${align} text-xs font-medium uppercase tracking-wider text-gray-500`}
    >
      {children}
    </th>
  )
}

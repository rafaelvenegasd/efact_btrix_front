import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/hooks/useToast'
import { useEmitInvoice } from '../hooks/useEmitInvoice'
import type {
  EmitInvoiceItem,
  EmitInvoicePayload,
  TipoIdentificacion,
} from '../types/invoice.types'

interface InvoiceFormProps {
  initialData: EmitInvoicePayload
  onSuccess?: (invoiceId: string) => void
}

const TIPO_ID_OPTIONS: { value: TipoIdentificacion; label: string }[] = [
  { value: '04', label: '04 – RUC' },
  { value: '05', label: '05 – Cédula' },
  { value: '06', label: '06 – Pasaporte' },
  { value: '07', label: '07 – Consumidor Final' },
]

const INPUT_CLASS =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
const LABEL_CLASS = 'block text-sm font-medium text-gray-700 mb-1'
const ITEM_LABEL_CLASS = 'block text-xs font-medium text-gray-600 mb-1'
const ITEM_INPUT_CLASS =
  'w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

const IVA_RATE = 0.15

function fmt(n: number) {
  return n.toFixed(2)
}

/**
 * Editable form for reviewing and adjusting invoice data before emission.
 *
 * Pre-populated with data fetched from Bitrix24 (or simulated).
 * The user can modify any field and then submit to emit the invoice.
 */
type Tab = 'comprador' | 'items'

export function InvoiceForm({ initialData, onSuccess }: InvoiceFormProps) {
  const [payload, setPayload] = useState<EmitInvoicePayload>(initialData)
  const [activeTab, setActiveTab] = useState<Tab>('comprador')
  const { emitInvoice, isLoading } = useEmitInvoice()
  const toast = useToast()

  const updateComprador = (
    field: keyof EmitInvoicePayload['comprador'],
    value: string,
  ) => {
    setPayload((prev) => ({
      ...prev,
      comprador: { ...prev.comprador, [field]: value },
    }))
  }

  const updateItem = (
    index: number,
    field: keyof EmitInvoiceItem,
    value: string | number,
  ) => {
    setPayload((prev) => {
      const items = [...prev.items]
      items[index] = { ...items[index], [field]: value }
      return { ...prev, items }
    })
  }

  const addItem = () => {
    setPayload((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { codigoPrincipal: '', descripcion: '', cantidad: 1, precioUnitario: 0 },
      ],
    }))
  }

  const removeItem = (index: number) => {
    setPayload((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const subtotal = payload.items.reduce(
    (sum, item) => sum + item.cantidad * item.precioUnitario,
    0,
  )
  const ivaAmount = subtotal * IVA_RATE
  const total = subtotal + ivaAmount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await emitInvoice(payload)
    if (result) {
      toast.success('Factura emitida correctamente')
      onSuccess?.(result.invoiceId)
    } else {
      toast.error('No se pudo emitir la factura. Inténtelo nuevamente.')
    }
  }

  const TAB_BASE = 'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors focus:outline-none'
  const TAB_ACTIVE = 'border-blue-500 text-blue-600'
  const TAB_INACTIVE = 'border-transparent text-gray-500 hover:text-gray-700'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Pestañas */}
      <div className="flex border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab('comprador')}
          className={`${TAB_BASE} ${activeTab === 'comprador' ? TAB_ACTIVE : TAB_INACTIVE}`}
        >
          Comprador
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('items')}
          className={`${TAB_BASE} ${activeTab === 'items' ? TAB_ACTIVE : TAB_INACTIVE}`}
        >
          Ítems y valores
        </button>
      </div>

      {/* ── Pestaña: Comprador ─────────────────────────────────────────────── */}
      {activeTab === 'comprador' && (
        <div className="space-y-4">
          {/* Ambiente */}
          <div>
            <label className={LABEL_CLASS}>Ambiente</label>
            <select
              value={payload.ambiente ?? 'TEST'}
              onChange={(e) =>
                setPayload((prev) => ({
                  ...prev,
                  ambiente: e.target.value as 'TEST' | 'PROD',
                }))
              }
              className={INPUT_CLASS}
            >
              <option value="TEST">TEST</option>
              <option value="PROD">PRODUCCIÓN</option>
            </select>
          </div>

          {/* Datos del comprador */}
          <div>
            <label className={LABEL_CLASS}>Tipo de identificación</label>
            <select
              value={payload.comprador.tipoIdentificacion}
              onChange={(e) => updateComprador('tipoIdentificacion', e.target.value)}
              className={INPUT_CLASS}
            >
              {TIPO_ID_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLASS}>Razón social</label>
              <input
                type="text"
                value={payload.comprador.razonSocial}
                onChange={(e) => updateComprador('razonSocial', e.target.value)}
                className={INPUT_CLASS}
                required
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Identificación</label>
              <input
                type="text"
                value={payload.comprador.identificacion}
                onChange={(e) => updateComprador('identificacion', e.target.value)}
                className={INPUT_CLASS}
                required
              />
            </div>
          </div>

          <div>
            <label className={LABEL_CLASS}>Email</label>
            <input
              type="email"
              value={payload.comprador.email ?? ''}
              onChange={(e) => updateComprador('email', e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>
      )}

      {/* ── Pestaña: Ítems y valores ───────────────────────────────────────── */}
      {activeTab === 'items' && (
        <div className="space-y-4">
          {/* Lista de ítems */}
          <div className="space-y-3">
            {payload.items.map((item, index) => (
              <div key={index} className="rounded-lg bg-gray-50 border border-gray-200 p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Ítem {index + 1}</span>
                  {payload.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-xs text-red-600 hover:text-red-800 font-medium"
                    >
                      Eliminar
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={ITEM_LABEL_CLASS}>Código principal</label>
                    <input
                      type="text"
                      value={item.codigoPrincipal}
                      onChange={(e) => updateItem(index, 'codigoPrincipal', e.target.value)}
                      className={ITEM_INPUT_CLASS}
                      required
                    />
                  </div>
                  <div>
                    <label className={ITEM_LABEL_CLASS}>Descripción</label>
                    <input
                      type="text"
                      value={item.descripcion}
                      onChange={(e) => updateItem(index, 'descripcion', e.target.value)}
                      className={ITEM_INPUT_CLASS}
                      required
                    />
                  </div>
                  <div>
                    <label className={ITEM_LABEL_CLASS}>Cantidad</label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={item.cantidad}
                      onChange={(e) => updateItem(index, 'cantidad', Number(e.target.value))}
                      className={ITEM_INPUT_CLASS}
                      required
                    />
                  </div>
                  <div>
                    <label className={ITEM_LABEL_CLASS}>Precio unitario</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.precioUnitario}
                      onChange={(e) =>
                        updateItem(index, 'precioUnitario', Number(e.target.value))
                      }
                      className={ITEM_INPUT_CLASS}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <span className="text-xs text-gray-500 mr-2 self-center">Precio total:</span>
                  <span className="text-sm font-semibold text-gray-800">
                    ${fmt(item.cantidad * item.precioUnitario)}
                  </span>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addItem}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              + Agregar ítem
            </button>
          </div>

          {/* Resumen de totales */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-5 py-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>${fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>IVA ({(IVA_RATE * 100).toFixed(0)}%)</span>
              <span>${fmt(ivaAmount)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-gray-900 border-t border-gray-200 pt-2 mt-2">
              <span>Total</span>
              <span>${fmt(total)}</span>
            </div>
          </div>
        </div>
      )}

      <Button type="submit" isLoading={isLoading} size="lg" className="w-full">
        Emitir factura
      </Button>
    </form>
  )
}

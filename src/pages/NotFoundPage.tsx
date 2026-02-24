import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <p className="text-5xl font-bold text-gray-200">404</p>
        <p className="mt-3 text-lg font-medium text-gray-700">Página no encontrada</p>
        <p className="mt-1 text-sm text-gray-400">
          La URL solicitada no existe en esta aplicación
        </p>
        <Link
          to="/"
          className="mt-5 inline-block text-sm font-medium text-blue-600 hover:underline"
        >
          ← Volver al inicio
        </Link>
      </div>
    </div>
  )
}

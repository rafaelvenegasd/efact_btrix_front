import { NavLink, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

export function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <header className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span className="text-base font-semibold text-gray-900">
            Facturación Electrónica
          </span>

          <nav className="flex gap-5">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
                }`
              }
            >
              Inicio
            </NavLink>
            <NavLink
              to="/invoices"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
                }`
              }
            >
              Historial
            </NavLink>
          </nav>
        </div>
      </header>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-5xl px-6 py-8">
        <Outlet />
      </main>

      {/* ── Global toast container ───────────────────────────────────────── */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { fontSize: '0.875rem' },
        }}
      />
    </div>
  )
}

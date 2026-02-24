import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SWRConfig } from 'swr'
import { AuthProvider } from './context/AuthContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import { MainLayout } from './layouts/MainLayout'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { InvoicesPage } from './features/invoices/pages/InvoicesPage'
import { InvoiceDetailPage } from './features/invoices/pages/InvoiceDetailPage'
import { AppApiError } from './api/axios'

export default function App() {
  return (
    <AuthProvider>
      <SWRConfig
        value={{
          // Centralized SWR error handler
          onError: (error: unknown) => {
            if (error instanceof AppApiError) {
              console.error('[SWR]', error.statusCode, error.message)
            }
          },
          // Do not retry on 401 — token is invalid
          shouldRetryOnError: (error: unknown) => {
            if (error instanceof AppApiError && error.statusCode === 401) return false
            return true
          },
          errorRetryCount: 3,
          revalidateOnFocus: false,
        }}
      >
        <ErrorBoundary>
          <BrowserRouter>
            <Routes>
              <Route element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="invoices" element={<InvoicesPage />} />
                <Route path="invoices/:id" element={<InvoiceDetailPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ErrorBoundary>
      </SWRConfig>
    </AuthProvider>
  )
}

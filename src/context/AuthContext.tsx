import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react'
import { tokenUtils } from '@/utils/token.utils'

// ─── Shape ───────────────────────────────────────────────────────────────────

interface AuthContextValue {
  isAuthenticated: boolean
  /** Re-reads ?token= from URL (e.g. after a redirect), stores it, returns true if found. */
  initializeAuth: () => boolean
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null)

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resolveToken(): string | null {
  const urlToken = tokenUtils.extractFromUrl()
  const devToken = import.meta.env.VITE_DEV_TOKEN as string | undefined
  return urlToken ?? (devToken || null)
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  // Lazy initializer runs synchronously before the first render,
  // so any child's useEffect (e.g. SWR) already sees the token.
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = resolveToken()
    if (token) {
      tokenUtils.setToken(token)
      return true
    }
    return false
  })

  const initializeAuth = useCallback((): boolean => {
    const token = resolveToken()
    if (token) {
      tokenUtils.setToken(token)
      setIsAuthenticated(true)
      return true
    }
    return false
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, initializeAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

// ─── Consumer hook ────────────────────────────────────────────────────────────

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within <AuthProvider>')
  return ctx
}

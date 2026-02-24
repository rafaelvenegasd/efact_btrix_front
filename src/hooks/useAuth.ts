import { useAuthContext } from '@/context/AuthContext'

/** Thin hook — keeps feature code decoupled from context internals. */
export function useAuth() {
  return useAuthContext()
}

/**
 * Token stored in module-level memory.
 * Intentionally NOT persisted to localStorage/sessionStorage —
 * the iframe context receives a fresh token on each Bitrix24 page load.
 */
let _authToken: string | null = null

export const tokenUtils = {
  getToken(): string | null {
    return _authToken
  },

  setToken(token: string): void {
    _authToken = token
  },

  clearToken(): void {
    _authToken = null
  },

  hasToken(): boolean {
    return _authToken !== null
  },

  /** Reads ?token=xxx from the current URL (called once on app init). */
  extractFromUrl(): string | null {
    const params = new URLSearchParams(window.location.search)
    return params.get('token')
  },
}

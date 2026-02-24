import type { BitrixContext } from '../types/bitrix.types'

/**
 * Abstraction layer for the Bitrix24 JS SDK (BX24).
 *
 * When running inside the real Bitrix24 iframe the global `BX24` object is
 * injected by the platform. This service wraps all SDK calls so the rest of
 * the codebase never touches `window.BX24` directly, making it trivial to:
 *   - Mock in unit tests
 *   - Run in local dev without Bitrix (falls back to query params)
 *   - Extend with additional BX24 calls later
 */

declare global {
  interface Window {
    BX24?: {
      placement: {
        getOption: (key: string) => unknown
      }
      getAuth: () => { access_token: string; domain: string }
    }
  }
}

export const bitrixService = {
  isBitrixAvailable(): boolean {
    return typeof window.BX24 !== 'undefined'
  },

  /**
   * Returns contextual data injected by Bitrix24.
   * In dev mode reads the same keys from query params so you can test with:
   *   ?dealId=42&userId=7&domain=mycompany.bitrix24.com
   */
  getContext(): BitrixContext {
    if (!this.isBitrixAvailable()) {
      const params = new URLSearchParams(window.location.search)
      return {
        dealId: params.get('dealId') ?? undefined,
        contactId: params.get('contactId') ?? undefined,
        companyId: params.get('companyId') ?? undefined,
        userId: params.get('userId') ?? undefined,
        domain: params.get('domain') ?? undefined,
      }
    }

    return {
      dealId: window.BX24!.placement.getOption('dealId') as string | undefined,
    }
  },
}

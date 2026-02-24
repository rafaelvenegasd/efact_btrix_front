import { useEffect, useState } from 'react'
import { bitrixService } from '../services/bitrix.service'
import type { BitrixContext } from '../types/bitrix.types'

/**
 * Reads the Bitrix24 placement context (dealId, userId, etc.)
 * Works both inside the real BX24 iframe and in local development.
 */
export function useBitrixContext() {
  const [context, setContext] = useState<BitrixContext | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const ctx = bitrixService.getContext()
    setContext(ctx)
    setIsLoading(false)
  }, [])

  return { context, isLoading }
}

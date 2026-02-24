import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios'
import { tokenUtils } from '@/utils/token.utils'
import type { ApiError } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

// ─── Axios instance ──────────────────────────────────────────────────────────

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
})

// ─── Request interceptor — attach JWT ────────────────────────────────────────

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenUtils.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: unknown) => Promise.reject(error)
)

// ─── Response interceptor — normalize errors ─────────────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const status = error.response?.status ?? 0
    const message = error.response?.data?.message ?? error.message

    if (status === 401) {
      tokenUtils.clearToken()
      // Future: dispatch a global logout event or notify Bitrix SDK
    }

    return Promise.reject(new AppApiError(message, status))
  }
)

// ─── Custom error class ───────────────────────────────────────────────────────

export class AppApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(message)
    this.name = 'AppApiError'
  }
}

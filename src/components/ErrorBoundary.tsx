import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Catches render-time errors in the subtree and shows a fallback UI.
 * Must be a class component — hooks cannot catch render errors.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Future: send to a monitoring service (Sentry, Datadog, etc.)
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex min-h-[200px] items-center justify-center p-8">
          <div className="text-center">
            <p className="text-lg font-semibold text-red-600">Algo salió mal</p>
            <p className="mt-1 text-sm text-gray-500">
              {this.state.error?.message ?? 'Error desconocido'}
            </p>
            <button
              onClick={this.handleRetry}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

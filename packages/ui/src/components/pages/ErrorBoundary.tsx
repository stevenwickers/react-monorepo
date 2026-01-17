import React, { ErrorInfo, ReactNode } from 'react'
import { ReactErrorPage } from './ReactErrorPage.tsx'

export interface ErrorBoundaryProps {
  children: ReactNode
  isDevEnv?: boolean
  fallback?: ReactNode
  onNavigateHome?: () => void // Passed down to ReactErrorPage
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('🚨 React Error Boundary Caught Error:', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      errorInfo: {
        componentStack: errorInfo.componentStack,
      },
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    })

    console.error('Component Stack Trace:', errorInfo.componentStack)

    console.error('Error Boundary Context:', {
      reactVersion: React.version,
      props: this.props,
      state: this.state,
    })
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: undefined })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <ReactErrorPage
          error={this.state.error}
          resetError={this.resetError}
          onNavigateHome={this.props.onNavigateHome}
          isDevEnv={this.props.isDevEnv ?? false}
        />
      )
    }

    return this.props.children
  }
}
import React from 'react'
import { Button } from '@/components/ui/button.tsx'

export interface ReactErrorPageProps {
  isDevEnv: boolean
  error?: Error
  resetError?: () => void
  onNavigateHome?: () => void // Callback instead of useNavigate
}

export const ReactErrorPage: React.FC<ReactErrorPageProps> = ({
  error,
  resetError,
  onNavigateHome,
  isDevEnv,
}) => {
  const handleNavHome = () => {
    if (resetError) {
      resetError()
    }
    onNavigateHome?.()
  }

  React.useEffect(() => {
    if (error) {
      console.error('🚨 React Error Caught by ErrorBoundary:', {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        errorType: 'react-component',
      })
    }
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="container-style rounded-lg px-6 py-8 ring shadow-xl ring-gray-900/5 flex flex-col items-center justify-center p-10 pt-3.5 max-w-lg">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Application Error
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Something went wrong in the application. We apologize for the
          inconvenience.
        </p>

        {isDevEnv && error ? (
          <details className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md max-w-lg w-full">
            <summary className="cursor-pointer text-red-700 font-medium">
              Error Details (Development Only)
            </summary>
            <div className="mt-2 text-xs text-red-600">
              <p><strong>Error:</strong> {error.name}</p>
              <p><strong>Message:</strong> {error.message}</p>
              {error.stack && (
                <pre className="mt-2 overflow-auto bg-red-100 p-2 rounded">
                  {error.stack}
                </pre>
              )}
            </div>
          </details>
        ) : null}

        <div className="mt-6 space-x-2">
          {resetError && (
            <Button variant="outline" onClick={resetError}>
              Try Again
            </Button>
          )}
          <Button variant="destructive" onClick={handleNavHome}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}
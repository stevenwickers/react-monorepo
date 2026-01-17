import React, {useEffect, useState} from 'react'
import { Button } from '@/components/ui'

export interface Error {
  name: string,
  message: string,
  stack: string
}

const initError: Error = {
  name: '',
  message: '',
  stack: ''
}

export interface ErrorProps {
  error: unknown,
  isDevEnv: boolean,
  handleNavHome: () => void
}

export const Error = ({ error, isDevEnv, handleNavHome } : ErrorProps) => {
  const [err, setError] = useState<Error>(initError)

  // Check if it's a 404 error
  const isNotFound =
    error &&
    typeof error === 'object' &&
    'status' in error &&
    error.status === 404

  // Log the error to the console when ErrorPage mounts
  useEffect(() => {
    console.log('🔍 ErrorPage mounted - checking for router error...')

    if (error) {
      const isError = error instanceof Error
      const _err = {
        name: isError ? (error as Error).name : '',
        message: isError ? (error as Error).message : '',
        stack: isError ? (error as Error).stack ?? '' : ''
      }

      console.error('🚨 Router Error Caught by ErrorPage:', {
        error,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        stack:
          error instanceof Error ? _err.stack : 'No stack trace available',
        errorType: 'router',
      })

      // Additional detailed logging for different error types
      if (error instanceof Error) {
        console.error('Router Error Details:', {
          name: _err.name,
          message: _err.message,
          stack: _err.stack,
        })
      } else if (typeof error === 'object' && error !== null) {
        console.error('Router Error Object:', JSON.stringify(error, null, 2))
      } else {
        console.error('Router Error (Unknown Type):', typeof error, error)
      }
      setError(_err)
    } else {
      console.log(
        '⚠️ No router error found - this ErrorPage might be used as a fallback or 404',
      )
    }
  }, [error])

  return (
    <div className="container-style rounded-lg px-6 py-8 ring shadow-xl ring-gray-900/5 flex flex-col items-center justify-center p-10 pt-3.5">
      <h1>{isNotFound ? 'Page Not Found' : 'Something went wrong!'}</h1>
      <p>
        {isNotFound
          ? 'The page you are looking for does not exist.'
          : 'We apologize for the inconvenience. Please try again later.'}
      </p>

      {/* Show error details in development */}
      {isDevEnv && error ? (
        <details className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md max-w-lg">
          <summary className="cursor-pointer text-red-700 font-medium">
            Error Details (Development Only)
          </summary>
          <pre className="mt-2 text-xs text-red-600 overflow-auto">
            {error instanceof Error
              ? err.stack
              : typeof error === 'string'
                ? error
                : JSON.stringify(error, null, 2)}
          </pre>
        </details>
      ) : null}

      <div className="mt-6">
        <Button variant="destructive" onClick={handleNavHome}>
          Home
        </Button>
      </div>
    </div>
  )
}
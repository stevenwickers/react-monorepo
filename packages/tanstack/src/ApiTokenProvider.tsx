import React, { useEffect, useRef, useMemo, createContext, useContext } from 'react'
import axios, { AxiosInstance } from 'axios'
import { useApiToken } from './useApiToken'
import { usePackageConfig } from './ConfigProvider'

// Context to share the configured axios instance
const ApiClientContext = createContext<AxiosInstance | null>(null)

/**
 * Hook to access the configured API client with authentication.
 * Must be used within an ApiTokenProvider.
 */
export const useApiClient = (): AxiosInstance => {
  const client = useContext(ApiClientContext)
  if (!client) {
    throw new Error(
      'useApiClient must be used within an ApiTokenProvider.'
    )
  }
  return client
}

/**
 * Provider that creates an authenticated axios client and attaches
 * bearer tokens to all requests automatically.
 *
 * Must be used within a TanstackConfigProvider and MsalProvider.
 */
export const ApiTokenProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { apiBaseUrl } = usePackageConfig()
  const { getToken } = useApiToken()

  // Use a ref to always have the latest getToken without re-registering interceptor
  const getTokenRef = useRef(getToken)
  getTokenRef.current = getToken

  // Create a shared axios instance for the package
  const apiClient = useMemo(
    () =>
      axios.create({
        baseURL: apiBaseUrl,
        withCredentials: true,
      }),
    [apiBaseUrl]
  )

  useEffect(() => {
    const interceptor = apiClient.interceptors.request.use(async (config) => {
      const token = await getTokenRef.current()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    return () => {
      apiClient.interceptors.request.eject(interceptor)
    }
  }, [apiClient])

  return (
    <ApiClientContext.Provider value={apiClient}>
      {children}
    </ApiClientContext.Provider>
  )
}

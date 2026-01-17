import React, { createContext, useContext } from 'react'
import { TanstackPackageConfig } from './types'

const ConfigContext = createContext<TanstackPackageConfig | null>(null)

/**
 * Hook to access the package configuration.
 * Must be used within a TanstackConfigProvider.
 */
export const usePackageConfig = (): TanstackPackageConfig => {
  const config = useContext(ConfigContext)
  if (!config) {
    throw new Error(
      'usePackageConfig must be used within a TanstackConfigProvider. ' +
        'Make sure to wrap your app with <TanstackConfigProvider config={...}>.'
    )
  }
  return config
}

/**
 * Provider component that supplies configuration to the package.
 * Wrap your app with this provider and pass in MSAL and API configuration.
 *
 * @example
 * ```tsx
 * const config = {
 *   apiBaseUrl: import.meta.env.VITE_APP_API_URL,
 *   apiScopes: [`${import.meta.env.VITE_API_CPQ_URL}/CPQ.Read`],
 *   msalInstance: msalInstance,
 * };
 *
 * <TanstackConfigProvider config={config}>
 *   <App />
 * </TanstackConfigProvider>
 * ```
 */
export const TanstackConfigProvider = ({
  config,
  children,
}: {
  config: TanstackPackageConfig;
  children: React.ReactNode;
}) => {
  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  )
}


import { useMsal, useAccount } from '@azure/msal-react'
import { useMemo } from 'react'
import { InteractionRequiredAuthError } from '@azure/msal-browser'
import { usePackageConfig } from './ConfigProvider'

/**
 * Hook that provides a function to acquire an access token for API calls.
 * Uses the configured MSAL instance and API scopes from TanstackConfigProvider.
 */
export const useApiToken = () => {
  const { apiScopes } = usePackageConfig()
  const { instance, accounts } = useMsal()
  const account = useAccount(accounts[0] || null)

  const apiRequest = useMemo(() => ({ scopes: apiScopes }), [apiScopes])

  const getToken = useMemo(
    () => async (): Promise<string | null> => {
      if (!account) return null

      try {
        const response = await instance.acquireTokenSilent({
          ...apiRequest,
          account,
        })
        return response.accessToken
      } catch (error) {
        // If silent fails due to consent/interaction required, try interactive
        if (error instanceof InteractionRequiredAuthError) {
          // Use REDIRECT instead of popup - popups are blocked
          instance.acquireTokenRedirect({
            ...apiRequest,
            account,
          })
          // Page will redirect, return null
          return null
        }
        console.error('Error acquiring token silently', error)
        return null
      }
    },
    [account, instance, apiRequest]
  )

  return { getToken, account }
}

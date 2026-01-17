import { useEffect } from 'react'
import { useMsal } from '@azure/msal-react'
import { AccountInfo } from '@azure/msal-browser'

/**
 * Dispatchers invoked when the MSAL account list changes.
 *
 * @template TAccount - Account entity type expected by the callbacks.
 */
export type UseAuthDispatchers<TAccount = AccountInfo> = {
  /**
   * Called with the active account once the user is signed in.
   *
   * @param account - The resolved account for the signed-in user.
   */
  onSignIn: (account: TAccount) => void
  /**
   * Called when no account is present, indicating the user is signed out.
   */
  onSignOut: () => void
}

/**
 * React hook that invokes supplied callbacks whenever MSAL account state changes.
 *
 * @template TAccount - Account entity type expected by the callbacks.
 * @param params - Callback handlers for sign-in and sign-out events.
 */
export const useAuth = <TAccount extends AccountInfo = AccountInfo>({
  onSignIn,
  onSignOut,
}: UseAuthDispatchers<TAccount>) => {
  const { accounts } = useMsal()

  useEffect(() => {
    if (accounts.length === 0) {
      onSignOut()
      return
    }

    onSignIn(accounts[0] as TAccount)
  }, [accounts, onSignIn, onSignOut])
}

import { useEffect, useRef, useCallback } from 'react'
import { useMsal } from '@azure/msal-react'

/**
 * Configuration options for the inactivity logout hook.
 */
interface UseInactivityLogoutOptions {
  /**
   * Minutes of inactivity before triggering logout. Defaults to 30 minutes.
   */
  timeoutMinutes?: number
  /**
   * Optional callback invoked just before MSAL logout executes.
   */
  onLogout?: () => void
  /**
   * Toggles the inactivity tracking behavior on or off.
   */
  enabled?: boolean
  /**
   * Reserved for future navigation logic following logout.
   */
  navigation?: string,
}

/**
 * Logs out users via MSAL after a period of inactivity.
 *
 * @param options - Optional configuration to control timeout and callbacks.
 * @returns Helpers for resetting the inactivity timer and forcing logout.
 */
export const useInactivityLogout = (options: UseInactivityLogoutOptions = {}) => {
  const { timeoutMinutes = 30, onLogout, enabled = true, navigation = '/'} = options
  const { instance, accounts } = useMsal()

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const timeoutRef = useRef<NodeJS.Timeout>()
  const lastActivityRef = useRef<number>(Date.now())

  const logout = useCallback(async () => {
    try {
      // Call custom logout handler if provided
      if (onLogout) {
        onLogout()
      }

      // Get the active account for logout
      const activeAccount = instance.getActiveAccount() || accounts[0]

      if (activeAccount) {
        await instance.logoutRedirect({
          account: activeAccount,
          postLogoutRedirectUri: window.location.origin + '/',
        })
      } else {
        await instance.logoutRedirect({
          postLogoutRedirectUri: window.location.origin + '/',
        })
      }

    } catch (error) {
      console.error('Error during inactivity logout:', error)
      // Still clear Redux state and navigate even if MSAL logout fails
      //navigate(navigation)
    }
  }, [instance, accounts, onLogout, timeoutMinutes])

  const resetTimer = useCallback(() => {
    if (!enabled || accounts.length === 0) return

    lastActivityRef.current = Date.now()

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout
    timeoutRef.current = setTimeout(
      () => {
        logout()
      },
      timeoutMinutes * 60 * 1000
    ) // Convert minutes to milliseconds
  }, [enabled, accounts.length, timeoutMinutes, logout])

  const handleActivity = useCallback(() => {
    resetTimer()
  }, [resetTimer])

  useEffect(() => {
    if (!enabled || accounts.length === 0) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      return
    }

    // Set up activity listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true)
    })

    resetTimer()

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true)
      })

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [enabled, accounts.length, handleActivity, resetTimer])

  return {
    resetTimer,
    logout,
  }
}

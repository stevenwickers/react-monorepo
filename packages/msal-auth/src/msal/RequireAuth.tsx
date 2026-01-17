import { PropsWithChildren, useEffect, useState } from 'react'
import { InteractionStatus } from '@azure/msal-browser'
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { loginRequest } from './msalConfig'
import { DEFAULT_SCOPES } from '../config/types'
import { Outlet } from 'react-router-dom'

interface RequireAuthProps extends PropsWithChildren {
  /** OAuth scopes to request during silent auth. Defaults to ['openid', 'profile', 'email']. */
  scopes?: string[];
  /** Custom loading component to display while bootstrapping auth. */
  loadingComponent?: React.ReactNode;
}

/**
 * Guard component that ensures MSAL authentication before rendering children.
 *
 * Attempts a silent token acquisition and redirects to the root path when authentication fails.
 *
 * @param props - React children that require authentication to render.
 * @returns Loading indicator while establishing auth or the secured children.
 */
export const RequireAuth = ({ 
  children, 
  scopes = DEFAULT_SCOPES,
  loadingComponent = <div>Loading…</div>,
}: RequireAuthProps) => {
  const { instance, inProgress, accounts } = useMsal()
  const isAuthenticatedHook = useIsAuthenticated()
  
  // Check both the hook AND accounts directly to handle React state sync timing
  const isAuthed = isAuthenticatedHook || (accounts.length > 0 && instance.getActiveAccount() !== null)
  const [bootstrapping, setBootstrapping] = useState(true)

  useEffect(() => {
    let cancelled = false

    const go = async () => {
      if (inProgress !== InteractionStatus.None) return
      if (isAuthed && accounts.length > 0) {
        if (!cancelled) setBootstrapping(false)
        return
      }

      const silentReq = {
        ...loginRequest(),
        account: instance.getActiveAccount() ?? accounts[0],
      }

      try {
        await instance.acquireTokenSilent(silentReq)
      } catch {
        if (!cancelled) {
          window.location.replace('/') // or instance.loginRedirect(createLoginRequest(scopes))
        }
      } finally {
        if (!cancelled) setBootstrapping(false)
      }
    }

    go()
    return () => {
      cancelled = true
    }
  }, [inProgress, isAuthed, accounts, instance, scopes])

  if (bootstrapping || inProgress !== InteractionStatus.None) {
    return <>{loadingComponent}</>
  }

  return isAuthed ? <>{children ?? <Outlet />}</> : null
}

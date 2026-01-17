import React, { PropsWithChildren, useEffect, useState, createContext, useContext, useCallback, useMemo } from 'react'
import { 
  PublicClientApplication, 
  Configuration, 
  LogLevel,
  AccountInfo,
  EventType,
  AuthenticationResult 
} from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import { MsalAuthConfig, DEFAULT_SCOPES } from '../config/types'
import { EnvSource, getMSALEnv } from '../config/env'

/**
 * Authentication state returned by useAuthState hook
 */
export interface AuthState {
  /** Whether the user is currently authenticated */
  isAuthenticated: boolean
  /** Whether authentication is still being determined */
  isLoading: boolean
  /** The current user's account info, if authenticated */
  account: AccountInfo | null
  /** Any error that occurred during authentication */
  error: Error | null
}

/**
 * Context value for authentication actions
 */
export interface AuthContextValue extends AuthState {
  /** Trigger login redirect */
  login: () => Promise<void>
  /** Trigger logout redirect */
  logout: () => Promise<void>
  /** Get access token for API calls */
  getAccessToken: (scopes?: string[]) => Promise<string | null>
  /** The MSAL instance for advanced usage */
  msalInstance: PublicClientApplication
  /** The resolved MSAL configuration (from envSource or config prop) */
  config: MsalAuthConfig
}

const AuthContext = createContext<AuthContextValue | null>(null)

/**
 * Props for the MsalAuthProvider component.
 * Provide either `envSource` (recommended) OR `config`, not both.
 */
export interface MsalAuthProviderProps extends PropsWithChildren {
  /** 
   * Environment source object (e.g., import.meta.env) - the package will 
   * auto-extract CLIENT_ID, AUTHORITY, etc. regardless of prefix.
   * This is the recommended approach.
   */
  envSource?: EnvSource
  /** 
   * Explicit MSAL configuration. Use this if you need full control.
   * If both envSource and config are provided, config takes precedence.
   */
  config?: MsalAuthConfig
  /** Optional callback when user signs in */
  onSignIn?: (account: AccountInfo) => void
  /** Optional callback when user signs out */
  onSignOut?: () => void
  /** Optional custom loading component */
  loadingComponent?: React.ReactNode
}

/**
 * Build MSAL Configuration from simplified config
 */
const buildMsalConfiguration = (config: MsalAuthConfig): Configuration => ({
  auth: {
    clientId: config.clientId,
    authority: config.authority,
    redirectUri: config.redirectUri ?? window.location.origin,
    postLogoutRedirectUri: config.postLogoutRedirectUri ?? window.location.origin,
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: 'sessionStorage',
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: LogLevel, message: string) => {
        if (level === LogLevel.Error) console.error('[MSAL]', message)
        else if (level === LogLevel.Warning) console.warn('[MSAL]', message)
      },
      piiLoggingEnabled: false,
      logLevel: LogLevel.Warning,
    },
  },
})

/**
 * Provider component that wraps your React app with MSAL authentication.
 * 
 * The package auto-extracts CLIENT_ID, AUTHORITY, REDIRECT_URI, etc. from 
 * your environment variables regardless of prefix (VITE_, REACT_APP_, etc.)
 * 
 * @example
 * ```tsx
 * // Recommended: Just pass your env source - msal-auth handles the rest
 * function App() {
 *   return (
 *     <MsalAuthProvider 
 *       envSource={import.meta.env}
 *       onSignIn={(account) => console.log('Signed in:', account.username)}
 *     >
 *       <YourApp />
 *     </MsalAuthProvider>
 *   )
 * }
 * 
 * // Alternative: Explicit config if needed
 * function App() {
 *   return (
 *     <MsalAuthProvider 
 *       config={{
 *         clientId: 'your-client-id',
 *         authority: 'https://login.microsoftonline.com/your-tenant',
 *       }}
 *     >
 *       <YourApp />
 *     </MsalAuthProvider>
 *   )
 * }
 * ```
 */
/**
 * Build MsalAuthConfig from environment source
 */
const buildConfigFromEnv = (envSource: EnvSource): MsalAuthConfig => {
  const values = getMSALEnv(envSource)
  return {
    clientId: values.CLIENT_ID,
    authority: values.AUTHORITY,
    redirectUri: values.REDIRECT_URI || undefined,
    postLogoutRedirectUri: values.LOGOUT_REDIRECT_URI || undefined,
    scopes: values.AZURE_SCOPES ? values.AZURE_SCOPES.split(' ') : undefined,
  }
}

export const MsalAuthProvider = ({
  envSource,
  config,
  onSignIn,
  onSignOut,
  loadingComponent,
  children,
}: MsalAuthProviderProps): React.JSX.Element => {
  // Resolve config from explicit config or envSource
  const resolvedConfig = useMemo<MsalAuthConfig>(() => {
    if (config) return config
    if (envSource) return buildConfigFromEnv(envSource)
    throw new Error('MsalAuthProvider requires either "envSource" or "config" prop')
  }, [config, envSource])

  const [msalInstance] = useState(() => {
    const msalConfig = buildMsalConfiguration(resolvedConfig)
    return new PublicClientApplication(msalConfig)
  })

  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    account: null,
    error: null,
  })

  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize MSAL and set up event callbacks
  useEffect(() => {
    const initializeMsal = async () => {
      try {
        // Initialize MSAL instance
        await msalInstance.initialize()

        // Handle redirect promise (for redirect flows)
        const response = await msalInstance.handleRedirectPromise()
        
        if (response) {
          // User just came back from redirect login
          msalInstance.setActiveAccount(response.account)
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            account: response.account,
            error: null,
          })
          onSignIn?.(response.account)
        } else {
          // Check for existing accounts
          const accounts = msalInstance.getAllAccounts()
          if (accounts.length > 0) {
            const activeAccount = msalInstance.getActiveAccount() ?? accounts[0]
            msalInstance.setActiveAccount(activeAccount)
            setAuthState({
              isAuthenticated: true,
              isLoading: false,
              account: activeAccount,
              error: null,
            })
            onSignIn?.(activeAccount)
          } else {
            setAuthState({
              isAuthenticated: false,
              isLoading: false,
              account: null,
              error: null,
            })
          }
        }

        setIsInitialized(true)
      } catch (error) {
        console.error('[MsalAuthProvider] Initialization error:', error)
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          account: null,
          error: error as Error,
        })
        setIsInitialized(true)
      }
    }

    initializeMsal()
  }, [msalInstance, onSignIn])

  // Subscribe to MSAL events
  useEffect(() => {
    if (!isInitialized) return

    const callbackId = msalInstance.addEventCallback((event) => {
      if (event.eventType === EventType.LOGIN_SUCCESS) {
        const result = event.payload as AuthenticationResult
        msalInstance.setActiveAccount(result.account)
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          account: result.account,
          error: null,
        })
        onSignIn?.(result.account)
      }

      if (event.eventType === EventType.LOGOUT_SUCCESS) {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          account: null,
          error: null,
        })
        onSignOut?.()
      }

      if (event.eventType === EventType.LOGIN_FAILURE || event.eventType === EventType.ACQUIRE_TOKEN_FAILURE) {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: new Error(event.error?.message ?? 'Authentication failed'),
        }))
      }
    })

    return () => {
      if (callbackId) {
        msalInstance.removeEventCallback(callbackId)
      }
    }
  }, [isInitialized, msalInstance, onSignIn, onSignOut])

  const login = useCallback(async () => {
    const scopes = resolvedConfig.scopes ?? DEFAULT_SCOPES
    try {
      await msalInstance.loginRedirect({ scopes })
    } catch (error) {
      console.error('[MsalAuthProvider] Login error:', error)
      throw error
    }
  }, [msalInstance, resolvedConfig.scopes])

  const logout = useCallback(async () => {
    try {
      const account = msalInstance.getActiveAccount()
      await msalInstance.logoutRedirect({
        account: account ?? undefined,
        postLogoutRedirectUri: resolvedConfig.postLogoutRedirectUri ?? window.location.origin,
      })
    } catch (error) {
      console.error('[MsalAuthProvider] Logout error:', error)
      throw error
    }
  }, [msalInstance, resolvedConfig.postLogoutRedirectUri])

  const getAccessToken = useCallback(async (scopes?: string[]): Promise<string | null> => {
    const requestScopes = scopes ?? resolvedConfig.scopes ?? DEFAULT_SCOPES
    const account = msalInstance.getActiveAccount()
    
    if (!account) {
      return null
    }

    try {
      const response = await msalInstance.acquireTokenSilent({
        scopes: requestScopes,
        account,
      })
      return response.accessToken
    } catch (error) {
      console.warn('[MsalAuthProvider] Silent token acquisition failed, trying redirect:', error)
      try {
        await msalInstance.acquireTokenRedirect({ scopes: requestScopes })
        return null // Will redirect
      } catch (redirectError) {
        console.error('[MsalAuthProvider] Token acquisition failed:', redirectError)
        return null
      }
    }
  }, [msalInstance, resolvedConfig.scopes])

  const contextValue: AuthContextValue = {
    ...authState,
    login,
    logout,
    getAccessToken,
    msalInstance,
    config: resolvedConfig,
  }

  // Show loading while initializing
  if (!isInitialized) {
    return <>{loadingComponent ?? <div>Initializing authentication...</div>}</>
  }

  return (
    <AuthContext.Provider value={contextValue}>
      <MsalProvider instance={msalInstance}>
        {children}
      </MsalProvider>
    </AuthContext.Provider>
  )
}

/**
 * Hook to access authentication state and actions.
 * Must be used within a MsalAuthProvider.
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isAuthenticated, account, login, logout } = useAuthState()
 *   
 *   if (!isAuthenticated) {
 *     return <button onClick={login}>Sign In</button>
 *   }
 *   
 *   return (
 *     <div>
 *       <p>Welcome, {account?.name}</p>
 *       <button onClick={logout}>Sign Out</button>
 *     </div>
 *   )
 * }
 * ```
 */
export const useAuthState = (): AuthContextValue => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthState must be used within a MsalAuthProvider')
  }
  return context
}


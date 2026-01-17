// Configuration types
export type { MsalAuthConfig } from './config/types'
export { DEFAULT_SCOPES } from './config/types'

// Main Provider and Auth State Hook (recommended API)
export { MsalAuthProvider, useAuthState } from './provider/MsalAuthProvider'
export type { 
  MsalAuthProviderProps, 
  AuthState, 
  AuthContextValue 
} from './provider/MsalAuthProvider'

// MSAL config/instance creation
export { createMsalConfig, createMsalInstance, loginRequest } from './msal/msalConfig'

// Auth components and hooks
export { RequireAuth } from './msal/RequireAuth'
export { useAuth } from './hooks/useAuth'
export type { UseAuthDispatchers } from './hooks/useAuth'
export { useInactivityLogout } from './hooks/useInactivityLogout'
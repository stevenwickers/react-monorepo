@wickers/msal-auth
===================

Utility hooks and components that standardize Microsoft Authentication Library (MSAL) usage across UniFirst React applications. This package centralizes common setup (instance configuration, route guards, Redux integration, inactivity logout) so consuming apps can adopt MSAL with minimal boilerplate.

## At a Glance
- Ships MSAL defaults (`msalInstance`, `loginRequest`) resolved from configurable env prefixes (defaults to `VITE_` with fallbacks for `MSAL_`, `REACT_APP_`, etc.).
- Provides a `RequireAuth` route guard that blocks unauthenticated routes until MSAL completes its bootstrap flow.
- Includes hooks for orchestrating sign-in/sign-out callbacks (`useAuth`) and handling inactivity-triggered sign-out (`useInactivityLogout`).
- Exposes helpers for building custom MSAL instances (`createMsalInstance`) without re-implementing configuration discovery.

## Peer Dependencies

Consuming apps must already provide these libraries. Versions shown are the minimums enforced by `peerDependencies`:

- `react` `>=18`
- `react-dom` `>=18`
- `react-router-dom` `>=7`
- `@azure/msal-browser` `>=3`
- `@azure/msal-react` `>=2`
- `vite-plugin-dts` `>=4` (needed when you build this package locally)

If the consuming application already satisfies (or exceeds) these semver ranges, npm/yarn/pnpm will not emit peer dependency warnings.

## Installation

1. Configure your `.npmrc` to point at the Azure Artifacts feed:

   ```
   registry=https://registry.npmjs.org/
   @wickers:registry=https://pkgs.dev.azure.com/[organization]/[project]/_packaging/[feed]/npm/registry/
   ```

   Replace the placeholders with your Azure DevOps feed credentials.

2. Install the package in your application:

   ```bash
   npm install @wickers/msal-auth
   ```

## Environment Variables

`msal-auth` discovers configuration via `getMSALEnv`, which inspects the provided source (defaults to `import.meta.env` + `process.env`). Keys that end with the suffixes below are picked up, regardless of prefix. By default we prioritize `VITE_` keys, then fall back to `MSAL_`, `REACT_APP_`, `NEXT_PUBLIC_`, and finally unprefixed keys. You can supply your own primary prefix when calling `createMsalInstance`, `buildMsalConfig`, or `loginRequest`.

Make sure your `.env` variables end with the following suffixes:

| Variable | Description |
| --- | --- |
| `CLIENT_ID` | Azure AD application (client) ID. |
| `AUTHORITY` | Authority URL (e.g. `https://login.microsoftonline.com/<tenant>`). |
| `REDIRECT_URI` | Redirect URI registered for the SPA. Defaults to `window.location.origin`. |
| `LOGOUT_REDIRECT_URI` | Post-logout redirect URI. Defaults to `window.location.origin`. |
| `AZURE_SCOPES` | Space-delimited list of scopes; defaults to `openid profile email`. |

## Usage

### Recommended: Using MsalAuthProvider (Simplest Approach)

The `MsalAuthProvider` component is the recommended way to integrate MSAL authentication. It handles all initialization, state management, and provides a clean API for your React app.

```tsx
// App.tsx
import { MsalAuthProvider, MsalAuthConfig, useAuthState } from '@wickers/msal-auth'

// Configuration from your .env file
const msalConfig: MsalAuthConfig = {
  clientId: import.meta.env.VITE_CLIENT_ID,
  authority: import.meta.env.VITE_AUTHORITY,
  redirectUri: import.meta.env.VITE_REDIRECT_URI,
  postLogoutRedirectUri: import.meta.env.VITE_POST_LOGOUT_REDIRECT_URI,
  scopes: import.meta.env.VITE_AZURE_SCOPES?.split(' '),
}

function App() {
  return (
    <MsalAuthProvider
      config={msalConfig}
      onSignIn={(account) => console.log('User signed in:', account.username)}
      onSignOut={() => console.log('User signed out')}
    >
      <YourApp />
    </MsalAuthProvider>
  )
}

// Inside any component wrapped by MsalAuthProvider:
function YourComponent() {
  const { 
    isAuthenticated, 
    isLoading, 
    account, 
    login, 
    logout, 
    getAccessToken 
  } = useAuthState()

  if (isLoading) return <div>Loading...</div>

  if (!isAuthenticated) {
    return <button onClick={login}>Sign In</button>
  }

  return (
    <div>
      <p>Welcome, {account?.name}</p>
      <button onClick={logout}>Sign Out</button>
      <button onClick={() => getAccessToken().then(console.log)}>Get Token</button>
    </div>
  )
}
```

### Alternative: Manual MSAL Setup with Redux

For more control or Redux integration, you can use the lower-level API:

```tsx
// app/bootstrap.tsx
import { MsalProvider } from '@azure/msal-react'
import { msalInstance, userReducer } from '@wickers/msal-auth'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'

const store = configureStore({
  reducer: {
    user: userReducer, // import from '@wickers/msal-auth/features/user'
  },
})

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <MsalProvider instance={msalInstance}>
      <Provider store={store}>{children}</Provider>
    </MsalProvider>
  )
}
```

### 2. Protect routes with `RequireAuth`

```tsx
// app/routes.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { RequireAuth } from '@wickers/msal-auth'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<PublicLanding />}
        />
        <Route element={<RequireAuth />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

`RequireAuth` waits for MSAL to finish processing redirects, attempts silent sign-in, and redirects unauthenticated users to `/`.

### 3. Sync account state into Redux

Use the provided `useAuth` hook to translate MSAL account changes into your store or local state. Provide callbacks for both sign-in and sign-out transitions:
```tsx
import { useAuth } from '@wickers/msal-auth'
import { useDispatch } from 'react-redux'
import { setSignedIn, setSignedOut } from '../features/user/userSlice'

export function useUserAuthBridge() {
  const dispatch = useDispatch()

  useAuth({
    onSignIn: account => {
      dispatch(
        setSignedIn({
          userName: account.username,
          name: account.name || '',
          homeAccountId: account.homeAccountId,
        })
      )
    },
    onSignOut: () => {
      dispatch(setSignedOut())
    },
  })
}
```

And create a feature
```tsx
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AccountInfo {
   userName: string
   name: string
   homeAccountId: string
}

interface UserState {
   account: AccountInfo | null
}

const initialState: UserState = {
   account: null,
}

const userSlice = createSlice({
   name: 'user',
   initialState,
   reducers: {
      setSignedIn: (state, action: PayloadAction<AccountInfo>) => {
         state.account = action.payload
      },
      setSignedOut: state => {
         state.account = null
      },
   },
})

export const { setSignedIn, setSignedOut } = userSlice.actions
export default userSlice.reducer
```


### 4. Optional inactivity logout

```tsx
import { useInactivityLogout } from '@wickers/msal-auth'

export function AppShell() {
  useInactivityLogout({
    timeoutMinutes: 30,
    navigation: '/logged-out',
    onLogout: () => console.info('User signed out after inactivity'),
  })

  return <Layout />
}
```

This hook wires DOM activity listeners, exposes helper methods (`resetTimer`, `logout`), and calls `logoutRedirect` when the timeout elapses.

## API Reference

### `useAuth`

The `useAuth` hook monitors MSAL account state and invokes callbacks when the authentication status changes. This allows you to synchronize MSAL authentication state with your application state management (Redux, Zustand, Context, etc.) or perform side effects on sign-in/sign-out events.

#### Type Definition

```typescript
type UseAuthDispatchers<TAccount = AccountInfo> = {
  onSignIn: (account: TAccount) => void
  onSignOut: () => void
}

function useAuth<TAccount extends AccountInfo = AccountInfo>(
  params: UseAuthDispatchers<TAccount>
): void
```

#### Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `onSignIn` | `(account: TAccount) => void` | Callback invoked when a user signs in. Receives the active MSAL account object. |
| `onSignOut` | `() => void` | Callback invoked when the user signs out or no active account is detected. |

#### Examples

##### Example 1: Simple State Management with React Context

```tsx
import { useAuth } from '@wickers/msal-auth'
import { useState, createContext, useContext } from 'react'
import { AccountInfo } from '@azure/msal-browser'

interface AuthContextType {
  account: AccountInfo | null
}

const AuthContext = createContext<AuthContextType>({ account: null })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<AccountInfo | null>(null)

  useAuth({
    onSignIn: (account) => {
      console.log('User signed in:', account.username)
      setAccount(account)
    },
    onSignOut: () => {
      console.log('User signed out')
      setAccount(null)
    },
  })

  return (
    <AuthContext.Provider value={{ account }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => useContext(AuthContext)
```

##### Example 2: Redux Integration (Shown in Usage Section Above)

See section **3. Sync account state into Redux** for a complete Redux example.

##### Example 3: Zustand Store Integration

```tsx
import { useAuth } from '@wickers/msal-auth'
import { create } from 'zustand'
import { AccountInfo } from '@azure/msal-browser'

interface UserStore {
  account: AccountInfo | null
  setAccount: (account: AccountInfo | null) => void
}

const useUserStore = create<UserStore>((set) => ({
  account: null,
  setAccount: (account) => set({ account }),
}))

export function AuthBridge() {
  const setAccount = useUserStore((state) => state.setAccount)

  useAuth({
    onSignIn: (account) => {
      setAccount(account)
    },
    onSignOut: () => {
      setAccount(null)
    },
  })

  return null
}
```

##### Example 4: Triggering API Calls on Authentication

```tsx
import { useAuth } from '@wickers/msal-auth'
import { useEffect, useState } from 'react'

export function UserProfileLoader() {
  const [userProfile, setUserProfile] = useState(null)

  useAuth({
    onSignIn: async (account) => {
      // Fetch user profile from your API when user signs in
      const response = await fetch(`/api/users/${account.username}`)
      const profile = await response.json()
      setUserProfile(profile)
    },
    onSignOut: () => {
      // Clear user profile on sign out
      setUserProfile(null)
    },
  })

  return userProfile ? (
    <div>Welcome, {userProfile.displayName}!</div>
  ) : null
}
```

##### Example 5: Custom Account Type with TypeScript

```tsx
import { useAuth } from '@wickers/msal-auth'
import { AccountInfo } from '@azure/msal-browser'

interface CustomAccountInfo extends AccountInfo {
  customRole?: string
  permissions?: string[]
}

export function CustomAuthHandler() {
  useAuth<CustomAccountInfo>({
    onSignIn: (account) => {
      console.log('User role:', account.customRole)
      console.log('Permissions:', account.permissions)
    },
    onSignOut: () => {
      console.log('User signed out')
    },
  })

  return null
}
```

#### Notes

- The hook automatically triggers when the MSAL account list changes
- `onSignIn` is called with the first account in the accounts array
- `onSignOut` is called when the accounts array is empty
- Both callbacks are required parameters
- The hook has no return value and is used purely for side effects

## Local Development

```bash
npm install
npm run build
npm run typecheck
```

Outputs are written to `dist/`. Update the version in `package.json` before publishing.

## Publishing

The included Azure DevOps pipeline (`pipeline.yaml`) builds and publishes on tag pushes (`v*`). To publish manually:

```bash
npm run build
npm publish --registry https://pkgs.dev.azure.com/StevenWickers0540/wickers/_packaging/msal/npm/registry/
```

Ensure you have authenticated with Azure Artifacts prior to running `npm publish`.

## License

Internal use only. Contact the UniFirst platform team for questions or requests.


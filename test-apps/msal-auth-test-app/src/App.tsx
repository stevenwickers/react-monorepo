import { MsalAuthProvider, useAuthState, RequireAuth } from '@unifirst/msal-auth'
import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { ProtectedPage } from './pages/ProtectedPage'

/**
 * No manual config needed! MsalAuthProvider auto-extracts from env:
 * 
 * Create a .env file with:
 * VITE_CLIENT_ID=your-azure-ad-client-id
 * VITE_AUTHORITY=https://login.microsoftonline.com/your-tenant-id
 * VITE_REDIRECT_URI=http://localhost:3000
 * VITE_POST_LOGOUT_REDIRECT_URI=http://localhost:3000
 * VITE_AZURE_SCOPES=openid profile email
 */

// Custom loading component
const LoadingScreen = () => (
  <div className="loading-container">
    <div className="loading-spinner" />
    <p>Initializing authentication...</p>
  </div>
)

function App() {
  return (
    <MsalAuthProvider
      envSource={import.meta.env}
      loadingComponent={<LoadingScreen />}
      onSignIn={(account) => {
        console.log('✅ User signed in:', account.username)
      }}
      onSignOut={() => {
        console.log('👋 User signed out')
      }}
    >
      <AppContent />
    </MsalAuthProvider>
  )
}

/**
 * Inner component that has access to auth state
 */
function AppContent() {
  const { isLoading, error } = useAuthState()

  if (error) {
    return (
      <div className="error-container">
        <h2>Authentication Error</h2>
        <p>{error.message}</p>
      </div>
    )
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Protected route - RequireAuth ensures user is authenticated */}
        <Route 
          path="/protected" 
          element={
            <RequireAuth loadingComponent={<LoadingScreen />}>
              <ProtectedPage />
            </RequireAuth>
          } 
        />
      </Routes>
    </div>
  )
}

export default App


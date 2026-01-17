import { useEffect, useState } from 'react'
import { useAuthState, RequireAuth } from '@unifirst/msal-auth'
import { useNavigate } from 'react-router-dom'

function ProtectedContent() {
  const { account, getAccessToken, logout } = useAuthState()
  const navigate = useNavigate()
  const [token, setToken] = useState<string | null>(null)
  const [tokenLoading, setTokenLoading] = useState(false)

  const handleGetToken = async () => {
    setTokenLoading(true)
    try {
      const accessToken = await getAccessToken()
      if (accessToken) {
        // Only show first 50 chars for security
        setToken(accessToken.substring(0, 50) + '...')
      }
    } catch (error) {
      console.error('Failed to get token:', error)
    } finally {
      setTokenLoading(false)
    }
  }

  return (
    <div className="page">
      <header className="header">
        <h1>🛡️ Protected Page</h1>
        <p>You can only see this if you're authenticated!</p>
      </header>

      <main className="content">
        <section className="auth-status">
          <div className="status-badge authenticated">
            ✅ You are authenticated as {account?.name}
          </div>
        </section>

        <section className="token-section">
          <h2>Access Token</h2>
          <p>Click the button below to retrieve an access token (for API calls):</p>
          
          <button 
            onClick={handleGetToken} 
            className="btn btn-primary"
            disabled={tokenLoading}
          >
            {tokenLoading ? '⏳ Getting Token...' : '🎫 Get Access Token'}
          </button>

          {token && (
            <div className="token-display">
              <strong>Token (truncated):</strong>
              <code>{token}</code>
            </div>
          )}
        </section>

        <section className="actions">
          <h2>Navigation</h2>
          <div className="button-group">
            <button onClick={() => navigate('/')} className="btn btn-secondary">
              🏠 Back to Home
            </button>
            <button onClick={logout} className="btn btn-danger">
              🚪 Sign Out
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

/**
 * Protected page that requires authentication.
 * Uses RequireAuth component from msal-auth to guard the route.
 */
export function ProtectedPage() {
  return (
    <RequireAuth loadingComponent={<div className="loading-container"><p>Verifying authentication...</p></div>}>
      <ProtectedContent />
    </RequireAuth>
  )
}


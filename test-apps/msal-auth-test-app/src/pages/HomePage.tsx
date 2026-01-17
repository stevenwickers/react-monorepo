import { useAuthState } from '@unifirst/msal-auth'
import { useNavigate } from 'react-router-dom'

export function HomePage() {
  const { isAuthenticated, account, login, logout, config } = useAuthState()
  const navigate = useNavigate()

  return (
    <div className="page">
      <header className="header">
        <h1>🔐 MSAL Auth Test App</h1>
        <p>Testing the @unifirst/msal-auth package</p>
      </header>

      <main className="content">
        <section className="auth-status">
          <h2>Authentication Status</h2>
          
          <div className={`status-badge ${isAuthenticated ? 'authenticated' : 'unauthenticated'}`}>
            {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
          </div>

          {isAuthenticated && account && (
            <div className="user-info">
              <h3>User Information</h3>
              <table>
                <tbody>
                  <tr>
                    <td><strong>Name:</strong></td>
                    <td>{account.name}</td>
                  </tr>
                  <tr>
                    <td><strong>Username:</strong></td>
                    <td>{account.username}</td>
                  </tr>
                  <tr>
                    <td><strong>Tenant ID:</strong></td>
                    <td>{account.tenantId}</td>
                  </tr>
                  <tr>
                    <td><strong>Local Account ID:</strong></td>
                    <td>{account.localAccountId}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="actions">
          <h2>Actions</h2>
          
          <div className="button-group">
            {!isAuthenticated ? (
              <button onClick={login} className="btn btn-primary">
                🔑 Sign In with Azure AD
              </button>
            ) : (
              <>
                <button onClick={logout} className="btn btn-danger">
                  🚪 Sign Out
                </button>
                <button onClick={() => navigate('/protected')} className="btn btn-secondary">
                  🛡️ Go to Protected Page
                </button>
              </>
            )}
          </div>
        </section>

        <section className="config-info">
          <h2>Configuration</h2>
          <p>Resolved MSAL configuration from MsalAuthProvider:</p>
          <pre>
            {JSON.stringify({
              clientId: config.clientId ? `✓ ${config.clientId.slice(0, 8)}...` : '✗ Missing',
              authority: config.authority ? `✓ ${config.authority}` : '✗ Missing',
              redirectUri: config.redirectUri ?? window.location.origin,
              scopes: config.scopes?.join(' ') ?? 'openid profile email',
            }, null, 2)}
          </pre>
        </section>
      </main>

      <footer className="footer">
        <p>@unifirst/msal-auth package test application</p>
      </footer>
    </div>
  )
}


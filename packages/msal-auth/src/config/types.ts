/**
 * Explicit configuration for creating an MSAL instance.
 * Apps should pass their environment values directly rather than
 * relying on the package to parse env vars.
 */
export interface MsalAuthConfig {
  /** Azure AD application (client) ID */
  clientId: string;
  /** Authority URL (e.g., https://login.microsoftonline.com/<tenant>) */
  authority: string;
  /** Redirect URI registered for the SPA. Defaults to window.location.origin */
  redirectUri?: string;
  /** Post-logout redirect URI. Defaults to window.location.origin */
  postLogoutRedirectUri?: string;
  /** OAuth scopes for login. Defaults to ['openid', 'profile', 'email'] */
  scopes?: string[];
}

/** Default scopes used when none are provided */
export const DEFAULT_SCOPES = ['openid', 'profile', 'email'];


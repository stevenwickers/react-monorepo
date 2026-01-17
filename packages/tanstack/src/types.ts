import { IPublicClientApplication } from '@azure/msal-browser'

export interface TanstackPackageConfig {
  /**
   * The base URL for API requests (e.g., "https://api.example.com")
   */
  apiBaseUrl: string;

  /**
   * The scopes required for API authentication
   * (e.g., ["api://your-client-id/CPQ.Read"])
   */
  apiScopes: string[];

  /**
   * The MSAL public client application instance
   */
  msalInstance: IPublicClientApplication;
}


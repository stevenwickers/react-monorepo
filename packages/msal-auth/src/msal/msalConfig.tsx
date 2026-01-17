// msal.ts
import {
  Configuration,
  LogLevel,
  PublicClientApplication,
} from '@azure/msal-browser'
import { EnvSource, getMSALEnv } from '../config/env'
import { MsalAuthConfig } from '../config/types'

export interface msalConfig {
  [key: string]: string | boolean;
}

/**
 * Build an MSAL browser configuration object from environment values.
 *
 * @param envSource - Optional environment override for MSAL values.
 * @param prefix - Primary prefix used when selecting env keys.
 * @returns The resolved values and corresponding MSAL configuration.
 */
const buildMsalConfig = (envSource?: EnvSource, prefix = 'VITE_') => {
  const values = getMSALEnv(envSource, prefix)

  return {
    values,
    config: {
      auth: {
        clientId: values.CLIENT_ID ?? '',
        authority: values.AUTHORITY ?? '',
        redirectUri: values.REDIRECT_URI ?? window.location.origin,
        postLogoutRedirectUri:
          values.LOGOUT_REDIRECT_URI ?? window.location.origin,
        navigateToLoginRequestUrl: true,
      },
      cache: { cacheLocation: 'sessionStorage' },
      system: {
        loggerOptions: {
          loggerCallback: (level: LogLevel, message: string) => {
            if (level === LogLevel.Error) console.error(message)
            else if (level === LogLevel.Warning) console.warn(message)
            else if (level === LogLevel.Info) console.info(message)
          },
          piiLoggingEnabled: false,
          logLevel: LogLevel.Warning,
        },
      },
    } satisfies Configuration,
  }
}

/**
 * Create an MsalAuthConfig object from environment values.
 * Use this if you need to inspect or modify the config before passing to MsalAuthProvider.
 *
 * @param envSource - Optional environment override for MSAL values.
 * @param prefix - Primary prefix used when selecting env keys.
 * @returns MsalAuthConfig object ready for MsalAuthProvider.
 */
export const createMsalConfig = (envSource?: EnvSource, prefix = 'VITE_'): MsalAuthConfig => {
  const values = getMSALEnv(envSource, prefix)
  return {
    clientId: values.CLIENT_ID,
    authority: values.AUTHORITY,
    redirectUri: values.REDIRECT_URI || undefined,
    postLogoutRedirectUri: values.LOGOUT_REDIRECT_URI || undefined,
    scopes: values.AZURE_SCOPES ? values.AZURE_SCOPES.split(' ') : undefined,
  }
}

/**
 * Create a configured MSAL `PublicClientApplication` instance.
 *
 * @param envSource - Optional environment override for MSAL values.
 * @param prefix - Primary prefix used when selecting env keys.
 * @returns A new MSAL `PublicClientApplication`.
 */
export const createMsalInstance = (envSource?: EnvSource, prefix = 'VITE_') => {
  const { config } = buildMsalConfig(envSource, prefix)
  return new PublicClientApplication(config)
}

// Keep the old exports for backward compatibility
const defaultConfig = buildMsalConfig()
export const msalConfig = defaultConfig.config
export const msalInstance = new PublicClientApplication(msalConfig)

/**
 * Derive scopes for login requests based on environment configuration.
 *
 * @param envSource - Optional environment override for MSAL values.
 * @param prefix - Primary prefix used when selecting env keys.
 * @returns An object containing requested scopes.
 */
export const loginRequest = (envSource?: EnvSource, prefix = 'VITE_') => {
  const values = getMSALEnv(envSource, prefix)
  return { scopes: values.AZURE_SCOPES.split(' ') ?? [] }
}

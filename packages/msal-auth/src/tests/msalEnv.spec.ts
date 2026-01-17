import { describe, expect, it, vi, beforeAll } from 'vitest'
import { getMSALEnv, __test } from '../config/env'
import type { EnvSource } from '../config/env'

const { resolveField, SUFFIX_MAP } = __test

// Mock window.location for tests
beforeAll(() => {
  vi.stubGlobal('location', { 
    origin: 'http://localhost:3000',
    href: 'http://localhost:3000/',
  })
})

// Test environment configuration
const TEST_ENV: EnvSource = {
  VITE_CLIENT_ID: 'client-123',
  VITE_AUTHORITY: 'https://login.microsoftonline.com/tenant-id',
  VITE_REDIRECT_URI: 'https://app.example.com/signin',
  VITE_POST_LOGOUT_REDIRECT_URI: 'https://app.example.com/signout',
  VITE_AZURE_SCOPES: 'openid profile email custom.scope',
}

describe('getMSALEnv', () => {
  it('extracts MSAL values from environment with VITE_ prefix', () => {
    const values = getMSALEnv(TEST_ENV)
    
    expect(values.CLIENT_ID).toBe('client-123')
    expect(values.AUTHORITY).toBe('https://login.microsoftonline.com/tenant-id')
    expect(values.REDIRECT_URI).toBe('https://app.example.com/signin')
    expect(values.LOGOUT_REDIRECT_URI).toBe('https://app.example.com/signout')
    expect(values.AZURE_SCOPES).toBe('openid profile email custom.scope')
  })

  it('returns default empty values when env vars are not present', () => {
    const values = getMSALEnv({})
    
    expect(values.CLIENT_ID).toBe('')
    expect(values.AUTHORITY).toBe('')
    expect(values.REDIRECT_URI).toBe('')
    expect(values.LOGOUT_REDIRECT_URI).toBe('')
    expect(values.AZURE_SCOPES).toBe('')
  })

  it('supports custom prefix', () => {
    const customEnv: EnvSource = {
      REACT_APP_CLIENT_ID: 'react-client',
      REACT_APP_AUTHORITY: 'https://login.microsoftonline.com/react-tenant',
    }
    
    const values = getMSALEnv(customEnv, 'REACT_APP_')
    
    expect(values.CLIENT_ID).toBe('react-client')
    expect(values.AUTHORITY).toBe('https://login.microsoftonline.com/react-tenant')
  })

  it('supports MSAL_ prefix as fallback', () => {
    const msalEnv: EnvSource = {
      MSAL_CLIENT_ID: 'msal-client',
      MSAL_AUTHORITY: 'https://login.microsoftonline.com/msal-tenant',
    }
    
    const values = getMSALEnv(msalEnv)
    
    expect(values.CLIENT_ID).toBe('msal-client')
    expect(values.AUTHORITY).toBe('https://login.microsoftonline.com/msal-tenant')
  })

  it('supports NEXT_PUBLIC_ prefix as fallback', () => {
    const nextEnv: EnvSource = {
      NEXT_PUBLIC_CLIENT_ID: 'next-client',
      NEXT_PUBLIC_AUTHORITY: 'https://login.microsoftonline.com/next-tenant',
    }
    
    const values = getMSALEnv(nextEnv)
    
    expect(values.CLIENT_ID).toBe('next-client')
    expect(values.AUTHORITY).toBe('https://login.microsoftonline.com/next-tenant')
  })
})

describe('resolveField', () => {
  it('resolves CLIENT_ID suffix', () => {
    expect(resolveField('VITE_CLIENT_ID')).toBe('CLIENT_ID')
    expect(resolveField('REACT_APP_CLIENT_ID')).toBe('CLIENT_ID')
  })

  it('resolves AUTHORITY suffix', () => {
    expect(resolveField('VITE_AUTHORITY')).toBe('AUTHORITY')
  })

  it('resolves REDIRECT_URI suffix', () => {
    expect(resolveField('VITE_REDIRECT_URI')).toBe('REDIRECT_URI')
  })

  it('resolves POST_LOGOUT_REDIRECT_URI to LOGOUT_REDIRECT_URI', () => {
    expect(resolveField('VITE_POST_LOGOUT_REDIRECT_URI')).toBe('LOGOUT_REDIRECT_URI')
  })

  it('resolves AZURE_SCOPES suffix', () => {
    expect(resolveField('VITE_AZURE_SCOPES')).toBe('AZURE_SCOPES')
  })

  it('returns null for unknown keys', () => {
    expect(resolveField('UNKNOWN_KEY')).toBeNull()
    expect(resolveField('VITE_SOMETHING_ELSE')).toBeNull()
  })

  it('is case insensitive', () => {
    expect(resolveField('vite_client_id')).toBe('CLIENT_ID')
    expect(resolveField('Vite_Authority')).toBe('AUTHORITY')
  })
})

describe('SUFFIX_MAP', () => {
  it('contains expected suffix mappings', () => {
    const suffixes = SUFFIX_MAP.map(([suffix]) => suffix)
    
    expect(suffixes).toContain('CLIENT_ID')
    expect(suffixes).toContain('AUTHORITY')
    expect(suffixes).toContain('REDIRECT_URI')
    expect(suffixes).toContain('POST_LOGOUT_REDIRECT_URI')
    expect(suffixes).toContain('AZURE_SCOPES')
  })

  it('prioritizes POST_LOGOUT_REDIRECT_URI over REDIRECT_URI', () => {
    const postLogoutIndex = SUFFIX_MAP.findIndex(([suffix]) => suffix === 'POST_LOGOUT_REDIRECT_URI')
    const redirectIndex = SUFFIX_MAP.findIndex(([suffix]) => suffix === 'REDIRECT_URI')
    
    // POST_LOGOUT should come before REDIRECT to ensure proper matching
    expect(postLogoutIndex).toBeLessThan(redirectIndex)
  })
})

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLIENT_ID: string
  readonly VITE_AUTHORITY: string
  readonly VITE_REDIRECT_URI: string
  readonly VITE_POST_LOGOUT_REDIRECT_URI: string
  readonly VITE_AZURE_SCOPES: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}


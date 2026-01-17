/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_APP_CPQ_AZURE_CLIENT_ID: string;
  readonly VITE_APP_CPQ_AZURE_AUTHORITY: string;
  readonly VITE_APP_CPQ_AZURE_REDIRECT_URI: string;
  readonly VITE_APP_CPQ_AZURE_POST_LOGOUT_REDIRECT_URI: string;
  readonly VITE_APP_CPQ_AZURE_SCOPES: string;

  readonly VITE_APP_ID?: string;
  readonly VITE_APP_NAME?: string;
  readonly VITE_SERVER_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __APP_VERSION__: string;

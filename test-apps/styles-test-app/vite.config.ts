/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgrPlugin from 'vite-plugin-svgr'
import path from 'path'
import fs from 'fs'

const __dirname = path.dirname(new URL(import.meta.url).pathname)
const packageJsonPath = path.resolve(__dirname, 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

export default defineConfig(({ mode }) => {
  return {
    plugins: [react(), tailwindcss(), svgrPlugin()],
    server: {
      port: 3001,
      open: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '&': path.resolve(__dirname, './src'),
      },
      // ADD THIS - Force single versions of these packages
      dedupe: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
        '@azure/msal-react',
        '@azure/msal-browser',
      ],
    },
    optimizeDeps: {
      // Force pre-bundling of these to ensure single instances
      include: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
      ],
    },
    define: {
      __APP_VERSION__: JSON.stringify(packageJson.version),
    },
    esbuild: {
      // Remove console.log in production
      pure: mode === 'production' ? ['console.log'] : [],
    },
  }
})

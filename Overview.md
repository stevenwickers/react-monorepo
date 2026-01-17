# CPQ Monorepo Overview

This document provides a high-level overview of the CPQ monorepo architecture and essential developer workflows, including adding packages to applications and debugging packages during development.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Workspace Structure](#workspace-structure)
- [Technology Stack](#technology-stack)
- [Adding Packages to Apps](#adding-packages-to-apps)
- [Debugging Packages in React Apps](#debugging-packages-in-react-apps)
- [VS Code Launch Configuration](#vs-code-launch-configuration)

---

## Architecture Overview

The CPQ monorepo is built using **pnpm workspaces**, providing a unified development environment for multiple applications and shared packages. This architecture enables:

```
┌─────────────────────────────────────────────────────────────────┐
│                        CPQ Monorepo                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────────────┐     ┌─────────────────────┐          │
│   │     cpq-app         │     │     data-app        │          │
│   │  (React + Vite)     │     │  (React + Vite)     │          │
│   │   Port: 3005        │     │                     │          │
│   └──────────┬──────────┘     └──────────┬──────────┘          │
│              │                           │                      │
│              └───────────┬───────────────┘                      │
│                          │                                      │
│                          ▼                                      │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │                  Shared Packages                         │  │
│   │  ┌──────────────────────┐  ┌──────────────────────┐     │  │
│   │  │  @unifirst/msal-auth │  │  @unifirst/tanstack  │     │  │
│   │  │  (Authentication)    │  │  (API/Query Utils)   │     │  │
│   │  └──────────────────────┘  └──────────────────────┘     │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Key Benefits

- **Shared Dependencies**: Common packages are hoisted and deduplicated
- **Local Package Linking**: Changes to packages are immediately available to apps via `workspace:*` protocol
- **Consistent Tooling**: Unified ESLint, Prettier, TypeScript, and Vite configurations
- **Efficient Disk Usage**: pnpm's content-addressable storage minimizes duplication

---

## Workspace Structure

```
cpq-monorepo/
├── apps/                           # Application projects
│   ├── cpq-app/                   # Main CPQ application
│   │   ├── src/
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── data-app/                  # Data management application
│       ├── src/
│       ├── package.json
│       └── vite.config.ts
│
├── packages/                       # Shared packages (libraries)
│   ├── msal-auth/                 # @unifirst/msal-auth
│   │   ├── src/
│   │   ├── dist/                  # Build output
│   │   └── package.json
│   ├── tanstack/                  # @unifirst/tanstack
│   │   ├── src/
│   │   ├── dist/
│   │   └── package.json
│   └── msal-auth-test-app/        # Test app for msal-auth development
│
├── package.json                    # Root package.json
├── pnpm-workspace.yaml            # Workspace configuration
└── pnpm-lock.yaml                 # Single lockfile for all packages
```

---

## Technology Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| Package Manager | pnpm 9.x | Workspace management, dependency resolution |
| Build Tool | Vite 5+/7+ | Fast dev server, optimized production builds |
| Framework | React 18+/19 | UI components |
| Routing | React Router 7.x | Client-side routing |
| State Management | Redux Toolkit, TanStack Query | Global state, server state |
| Authentication | MSAL (Azure AD) | Enterprise authentication |
| Styling | Tailwind CSS 4.x | Utility-first CSS |
| Testing | Vitest | Unit and component testing |
| TypeScript | 5.x | Type safety |

---

## Adding Packages to Apps

### Method 1: Add an Existing Workspace Package

To add a shared package from the monorepo to an application:

```bash
# From the monorepo root
pnpm --filter cpq-app add @unifirst/msal-auth

# Or from the app directory
cd apps/cpq-app
pnpm add @unifirst/msal-auth
```

This adds the dependency to your app's `package.json` with the `workspace:*` protocol:

```json
{
  "devDependencies": {
    "@unifirst/msal-auth": "workspace:*"
  }
}
```

**Important**: Before using the package, ensure it's built:

```bash
pnpm --filter @unifirst/msal-auth build
```

### Method 2: Add an External npm Package

```bash
# Add as a regular dependency
pnpm --filter cpq-app add axios

# Add as a dev dependency
pnpm --filter cpq-app add -D @types/lodash

# Add to root workspace (shared tooling)
pnpm add -D -w prettier
```

### Method 3: Create a New Shared Package

1. **Create the package structure:**

```bash
mkdir -p packages/my-package/src
cd packages/my-package
pnpm init
```

2. **Configure `package.json`:**

```json
{
  "name": "@unifirst/my-package",
  "version": "0.0.1",
  "private": false,
  "type": "module",
  "main": "dist/index.cjs",
  "module": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "scripts": {
    "build": "vite build",
    "dev": "vite build --watch"
  },
  "peerDependencies": {
    "react": ">=18"
  }
}
```

3. **Create `vite.config.ts`:**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    dts({
      entryRoot: 'src',
      insertTypesEntry: true,
      rollupTypes: true
    })
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'MyPackage',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs')
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
    sourcemap: true  // Critical for debugging!
  }
})
```

4. **Install dependencies and build:**

```bash
pnpm install
pnpm --filter @unifirst/my-package build
```

5. **Add to your app:**

```bash
pnpm --filter cpq-app add @unifirst/my-package
```

---

## Debugging Packages in React Apps

When developing shared packages alongside React applications, you need to be able to step through package source code in your debugger. Here are the essential techniques:

### Prerequisites

Ensure all packages are built with **source maps enabled**. In each package's `vite.config.ts`:

```typescript
build: {
  sourcemap: true,  // Generates .map files alongside dist output
  // ... rest of config
}
```

### Method 1: Browser DevTools Debugging

This is the simplest approach and works immediately with properly configured source maps.

1. **Build packages with source maps:**

```bash
pnpm --filter @unifirst/msal-auth build
```

2. **Start your React app:**

```bash
pnpm --filter cpq-app dev
```

3. **Open Chrome DevTools** (F12 or Cmd+Option+I)

4. **Navigate to Sources tab** → Look for your package under:
   - `webpack://` or `vite://` source tree
   - Or search for the file: `Cmd+P` → type the filename

5. **Set breakpoints** directly in the original TypeScript source files

6. **Debug as normal** – the browser will pause execution in your package code

### Method 2: Watch Mode Development (Recommended)

For active package development, use watch mode to automatically rebuild on changes:

**Terminal 1 – Package (watch mode):**

```bash
cd packages/msal-auth
pnpm dev
# Or if 'dev' doesn't support watch:
npx vite build --watch
```

**Terminal 2 – React App:**

```bash
pnpm --filter cpq-app dev
```

**Note:** After the package rebuilds, you may need to:
- Refresh the browser to pick up changes
- Some changes may require restarting the Vite dev server

### Method 3: VS Code Debugging

For a full IDE debugging experience with breakpoints, watches, and call stacks:

1. **Create `.vscode/launch.json`** in the monorepo root:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug CPQ App (Chrome)",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3005",
      "webRoot": "${workspaceFolder}/apps/cpq-app",
      "sourceMapPathOverrides": {
        "webpack:///./~/*": "${workspaceFolder}/node_modules/*",
        "webpack:///./*": "${webRoot}/*",
        "webpack:///*": "*",
        "meteor://💻app/*": "${webRoot}/*"
      },
      "sourceMaps": true,
      "resolveSourceMapLocations": [
        "${workspaceFolder}/**",
        "!**/node_modules/**"
      ]
    },
    {
      "name": "Debug CPQ App (Edge)",
      "type": "msedge",
      "request": "launch",
      "url": "http://localhost:3005",
      "webRoot": "${workspaceFolder}/apps/cpq-app",
      "sourceMaps": true
    }
  ],
  "compounds": [
    {
      "name": "Full Stack Debug",
      "configurations": ["Debug CPQ App (Chrome)"]
    }
  ]
}
```

2. **Start the Vite dev server** first:

```bash
pnpm --filter cpq-app dev
```

3. **Press F5** in VS Code to launch the debugger

4. **Set breakpoints** in any file – including package source files in `packages/*/src/`

### Method 4: Link Package Source Directly (Advanced)

For seamless debugging during heavy package development, you can configure Vite to resolve the package source directly instead of the built `dist/` folder:

**In your app's `vite.config.ts`:**

```typescript
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      // Override package resolution to use source directly
      '@unifirst/msal-auth': path.resolve(__dirname, '../../packages/msal-auth/src/index.ts'),
    },
  },
  // ... rest of config
})
```

**Benefits:**
- No need to rebuild the package after changes
- Hot Module Replacement (HMR) works for package code
- Direct source debugging without source maps

**Caveats:**
- Only use during development
- Remember to remove before committing or testing production builds
- The package must be compatible with your app's build setup

### Debugging Tips

| Issue | Solution |
|-------|----------|
| Breakpoints not hitting | Ensure `sourcemap: true` in package's vite.config.ts and rebuild |
| Source shows compiled JS | Check that source maps are being generated (.map files in dist/) |
| Changes not reflecting | Rebuild package (`pnpm --filter <pkg> build`) and refresh browser |
| "Module not found" errors | Run `pnpm install` from root to re-link workspaces |
| TypeScript errors in IDE | Rebuild package to regenerate `dist/index.d.ts` |

### Console Debugging in Packages

For quick debugging, add console statements in your package source:

```typescript
// packages/msal-auth/src/hooks/useAuth.ts
export function useAuth() {
  console.log('[msal-auth] useAuth hook called');
  // ... implementation
}
```

Rebuild and these will appear in the browser console with clickable source links.

---

## VS Code Launch Configuration

Here's a complete `.vscode/launch.json` for comprehensive debugging:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug CPQ App",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3005",
      "webRoot": "${workspaceFolder}/apps/cpq-app",
      "sourceMaps": true,
      "sourceMapPathOverrides": {
        "/@fs/*": "${workspaceFolder}/*"
      }
    },
    {
      "name": "Debug Data App",
      "type": "chrome",
      "request": "launch", 
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/apps/data-app",
      "sourceMaps": true
    },
    {
      "name": "Debug Vitest Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
      "args": ["run", "--reporter=verbose"],
      "cwd": "${workspaceFolder}/apps/cpq-app",
      "console": "integratedTerminal"
    }
  ]
}
```

---

## Quick Reference

```bash
# Install all dependencies
pnpm install

# Build all packages
pnpm --filter "./packages/*" build

# Start cpq-app
pnpm --filter cpq-app dev

# Add workspace package to app
pnpm --filter cpq-app add @unifirst/msal-auth

# Add external package
pnpm --filter cpq-app add axios

# Watch mode for package development
cd packages/msal-auth && npx vite build --watch

# Run tests
pnpm --filter cpq-app test:run
```

---

*For detailed pnpm commands and troubleshooting, see the main [README.md](./README.md).*



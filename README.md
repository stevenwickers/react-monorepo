# React Monorepo (react-monorepo)

## Overview

`react-monorepo` is the primary repository we will use moving forward for our React-related front-end applications and shared UI/data-access packages.

This repository contains:
- **Apps** (Vite + React) under `/apps` (e.g., `react-app`, `data-app`)
- **Shared packages** under `/packages` (e.g., `msal-auth`, `tanstack`)

The monorepo approach allows apps to **reuse the same shared code** (authentication, API clients, hooks, UI utilities, etc.) while making it easy to **debug and update shared packages locally**—without the friction of publishing and consuming packages for every change.

---

## Why a Monorepo (vs Separate Repos + Azure Artifacts)

A monorepo works well for our use case because multiple React apps depend on the same internal libraries (for example, `msal-auth` and `tanstack` utilities).

With a monorepo:
- Apps can reference shared packages directly through the workspace.
- Developers can make a change in a shared package and immediately test it in an app.
- Versioning and dependency alignment across apps/packages is simpler.
- Build and install workflows are centralized and consistent.

Compared to publishing internal packages to **Azure Artifacts**:
- A monorepo avoids the **publish/install cycle** for every package change.
- It reduces issues that can happen when apps consume packages from a registry (for example, stale versions, mismatched peer dependencies, or lockfile differences across repos).
- It keeps shared code changes and app changes in the same PR when needed (when a feature spans both).

> Note: Azure Artifacts is still a valid approach in some scenarios (especially when teams need strict release versioning of shared libraries). For our day-to-day development and rapid iteration across multiple apps, the monorepo improves productivity and reduces friction.

---

## Quick Start

1. Install everything  
   `pnpm run install:all`

2. Build shared packages  
   `pnpm run build:packages`

3. Run an app  
   `pnpm run dev:react`  
   or  
   `pnpm run dev:data`

---

## Table of Contents

- [Overview](#overview)
- [Why a Monorepo](#why-a-monorepo-vs-separate-repos--azure-artifacts)
- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
- [Working with Packages](#working-with-packages)
- [PNPM Commands Reference](#pnpm-commands-reference)
- [Development Workflow](#development-workflow)
- [Building and Testing](#building-and-testing)
- [Creating New Packages](#creating-new-packages)
- [Troubleshooting](#troubleshooting)

---

## Detailed Overview

This monorepo uses **pnpm workspaces** to manage multiple applications and shared packages. The workspace configuration allows for:

- Shared dependencies across projects
- Local package linking without publishing
- Consistent versioning and dependency management
- Efficient disk space usage through content-addressable storage

### Current Projects

#### Applications

| Project | Type | Description |
|---------|------|-------------|
| `react-app` | Application | Main React application |
| `data-app` | Application | Data management application (Data360) |

#### Shared Packages

| Package | Description |
|---------|-------------|
| `@wickers/msal-auth` | Shared MSAL authentication library |
| `@wickers/tanstack` | TanStack Query utilities, CRUD hooks, and API client helpers |
| `@wickers/ui` | Shared UI component library (shadcn/ui based) |
| `@wickers/ui-styles` | Shared Tailwind CSS styles and theme configuration |

#### Test Applications

| Project | Description |
|---------|-------------|
| `msal-auth-test-app` | Test application for @wickers/msal-auth package |
| `styles-test-app` | Style guide and component showcase for @wickers/ui |

---

## Prerequisites

Before working with this monorepo, ensure you have the following installed:

- **Node.js** >= 18.x (recommended: latest LTS)
- **pnpm** >= 9.0.0

### Installing pnpm

```bash
# Using npm
npm install -g pnpm@9

# Using Homebrew (macOS)
brew install pnpm

# Using Corepack (Node.js 16.10+)
corepack enable
corepack prepare pnpm@9.0.0 --activate
```

Verify installation:

```bash
pnpm --version
```

---

## Repository Structure

```
react-monorepo/
├── apps/                       # Application projects
│   ├── react-app/               # Main React application
│   │   ├── src/
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── data-app/              # Data management application
│       ├── src/
│       ├── package.json
│       └── vite.config.ts
├── packages/                   # Shared packages
│   ├── msal-auth/             # @wickers/msal-auth - Authentication library
│   │   ├── src/
│   │   ├── dist/
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── tanstack/              # @wickers/tanstack - TanStack Query utilities
│   │   ├── src/
│   │   ├── dist/
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── ui/                    # @wickers/ui - UI component library
│   │   ├── src/
│   │   ├── dist/
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── ui-styles/             # @wickers/ui-styles - Shared Tailwind styles
│       ├── tailwind.css
│       └── package.json
├── test-apps/                  # Test applications for packages
│   ├── msal-auth-test-app/    # Test app for msal-auth package
│   │   ├── src/
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── styles-test-app/       # Style guide & component showcase
│       ├── src/
│       ├── package.json
│       └── vite.config.ts
├── node_modules/              # Root node_modules (hoisted dependencies)
├── package.json               # Root package.json
├── pnpm-lock.yaml             # Lock file
└── pnpm-workspace.yaml        # Workspace configuration
```

### Workspace Configuration

The `pnpm-workspace.yaml` defines which directories are part of the workspace:

```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "test-apps/*"
```

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd react-monorepo
```

### 2. Install All Dependencies

From the **root** of the monorepo, run:

```bash
pnpm install
```

This command:
- Installs dependencies for all workspaces (apps and packages)
- Links local packages automatically
- Creates a single `pnpm-lock.yaml` at the root

### 3. Build Shared Packages

Before running applications, build any shared packages they depend on:

```bash
# Build all packages at once
pnpm --filter "./packages/*" build

# Or build individual packages
pnpm --filter @wickers/msal-auth build
pnpm --filter @wickers/tanstack build
pnpm --filter @wickers/ui build
```

### 4. Start an Application

```bash
# Start react-app in development mode
pnpm --filter react-app dev

# Start data-app in development mode
pnpm --filter data-app dev

# Start test applications
pnpm --filter msal-auth-test-app dev
pnpm --filter styles-test-app dev
```

---

## Working with Packages

### Importing a Workspace Package into an App

To use a shared package (like `@wickers/msal-auth`) in an application:

#### Step 1: Add the Dependency

Navigate to your app directory or use the filter flag:

```bash
# From the root of the monorepo
pnpm --filter react-app add @wickers/msal-auth

# Or from the app directory
cd apps/react-app
pnpm add @wickers/msal-auth
```

#### Step 2: Verify package.json

The dependency should appear in your app's `package.json` with `workspace:*`:

```json
{
  "devDependencies": {
    "@wickers/msal-auth": "workspace:*"
  }
}
```

The `workspace:*` protocol tells pnpm to always use the local workspace version.

#### Step 3: Import in Your Code

```typescript
// Import from the shared package
import { 
  createMsalInstance, 
  RequireAuth, 
  useAuth,
  useInactivityLogout 
} from '@wickers/msal-auth';
```

### Updating a Workspace Package

When you make changes to a shared package:

#### Step 1: Make Your Changes

Edit the source files in the package (e.g., `packages/msal-auth/src/`).

#### Step 2: Rebuild the Package

```bash
# Rebuild the specific package
pnpm --filter @wickers/msal-auth build
```

#### Step 3: Restart Dependent Apps

Applications using the package need to be restarted to pick up changes:

```bash
# Stop the running dev server (Ctrl+C), then restart
pnpm --filter react-app dev
```

> **Tip:** During active development, you may want to run the package in watch mode (if supported) to automatically rebuild on changes.

### Adding External (npm) Dependencies

#### To a Specific App or Package

```bash
# Add to react-app
pnpm --filter react-app add axios

# Add as dev dependency
pnpm --filter react-app add -D @types/node

# Add to msal-auth package
pnpm --filter @wickers/msal-auth add react-router-dom
```

#### To the Root (shared tooling)

```bash
# Add to root workspace (for shared dev tools)
pnpm add -D -w prettier eslint
```

### Removing Dependencies

```bash
# Remove from a specific workspace
pnpm --filter react-app remove axios

# Remove from root
pnpm remove -w prettier
```

---

## PNPM Commands Reference

### Installation Commands

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all dependencies for all workspaces |
| `pnpm install --frozen-lockfile` | Install without updating lock file (CI/CD) |
| `pnpm add <pkg>` | Add package to current workspace |
| `pnpm add -D <pkg>` | Add as dev dependency |
| `pnpm add -w <pkg>` | Add to root workspace |
| `pnpm remove <pkg>` | Remove package |

### Filtering Commands

The `--filter` (or `-F`) flag targets specific workspaces:

| Command | Description |
|---------|-------------|
| `pnpm --filter <name> <cmd>` | Run command in specific package |
| `pnpm --filter "./apps/*" <cmd>` | Run in all apps |
| `pnpm --filter "./packages/*" <cmd>` | Run in all packages |
| `pnpm -r <cmd>` | Run command recursively in all workspaces |

### Common Development Commands

```bash
# Run dev server for react-app
pnpm --filter react-app dev

# Run dev server for data-app
pnpm --filter data-app dev

# Build react-app
pnpm --filter react-app build

# Build all packages
pnpm --filter "./packages/*" build

# Build everything
pnpm -r build

# Run tests in react-app
pnpm --filter react-app test

# Run tests with coverage
pnpm --filter react-app test:coverage

# Lint react-app
pnpm --filter react-app lint

# Fix lint issues
pnpm --filter react-app lint:fix

# Format code
pnpm --filter react-app format
```

### Updating Dependencies

```bash
# Check for outdated packages
pnpm outdated

# Check in a specific workspace
pnpm --filter react-app outdated

# Update all packages (respecting semver ranges)
pnpm update

# Update a specific package
pnpm --filter react-app update axios

# Update to latest versions (ignoring semver)
pnpm update --latest

# Interactive update
pnpm update -i
```

---

## Development Workflow

### Starting Fresh Development

```bash
# 1. Pull latest changes
git pull origin main

# 2. Install/update dependencies
pnpm install

# 3. Build all shared packages
pnpm --filter "./packages/*" build

# 4. Start your app
pnpm --filter react-app dev
```

### After Pulling Changes

```bash
# If dependencies changed
pnpm install

# If shared packages changed
pnpm --filter "./packages/*" build

# Restart your app
pnpm --filter react-app dev
```

### Working on a Shared Package

When developing a shared package alongside an app:

**Terminal 1 - Package Development:**
```bash
# Watch mode for the package (if available)
cd packages/msal-auth
pnpm dev
```

**Terminal 2 - App Development:**
```bash
# Run the app
pnpm --filter react-app dev
```

> **Note:** After package changes, you may need to rebuild and restart the app to see updates.

### Full Rebuild Workflow

If you encounter issues or want a clean state:

```bash
# 1. Clean all node_modules and build artifacts
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
rm -rf packages/*/dist
rm -rf test-apps/*/node_modules

# 2. Clear pnpm cache (optional, for severe issues)
pnpm store prune

# 3. Fresh install
pnpm install

# 4. Rebuild all packages
pnpm --filter "./packages/*" build

# 5. Start app
pnpm --filter react-app dev
```

---

## Building and Testing

### Building Applications

```bash
# Build react-app for production
pnpm --filter react-app build

# Build data-app for production
pnpm --filter data-app build

# Build all applications
pnpm --filter "./apps/*" build
```

Build output is typically in the `dist/` folder of each app.

### Building Packages

```bash
# Build all packages
pnpm --filter "./packages/*" build

# Build individual packages
pnpm --filter @wickers/msal-auth build
pnpm --filter @wickers/tanstack build
pnpm --filter @wickers/ui build
```

Package build output goes to each package's `dist/` folder:
- `index.js` - ES Module build
- `index.cjs` - CommonJS build
- `index.d.ts` - TypeScript declarations

### Running Tests

```bash
# Run tests once
pnpm --filter react-app test:run

# Run tests in watch mode
pnpm --filter react-app test

# Run tests with coverage
pnpm --filter react-app test:coverage

# Run tests with UI
pnpm --filter react-app test:ui

# Run all tests in monorepo
pnpm -r test:run
```

### Linting and Formatting

```bash
# Check for lint issues
pnpm --filter react-app lint

# Fix lint issues automatically
pnpm --filter react-app lint:fix

# Format code with Prettier
pnpm --filter react-app format

# Check formatting without fixing
pnpm --filter react-app format:check
```

---

## Creating New Packages

### 1. Create Package Directory

```bash
mkdir -p packages/my-new-package/src
cd packages/my-new-package
```

### 2. Initialize package.json

```bash
pnpm init
```

Edit `package.json`:

```json
{
  "name": "@wickers/my-new-package",
  "version": "1.0.0",
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
  "files": ["dist", "README.md"],
  "scripts": {
    "build": "vite build",
    "dev": "vite",
    "test": "vitest run"
  },
  "peerDependencies": {
    "react": ">=18"
  },
  "devDependencies": {
    "typescript": ">=5",
    "vite": ">=5",
    "vite-plugin-dts": ">=4"
  }
}
```

### 3. Create Source Files

Create `src/index.ts`:

```typescript
export function myUtility() {
  return 'Hello from my-new-package!';
}
```

### 4. Add Build Configuration

Create `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      entryRoot: 'src',
      insertTypesEntry: true,
      rollupTypes: true
    })
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'MyNewPackage',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs')
    },
    sourcemap: true
  }
});
```

### 5. Install Dependencies and Build

```bash
# From root
pnpm install
pnpm --filter @wickers/my-new-package build
```

### 6. Use in an App

```bash
pnpm --filter react-app add @wickers/my-new-package
```

---

## Troubleshooting

### Common Issues

#### "Package not found" after adding workspace dependency

**Solution:** Ensure the package is built:
```bash
pnpm --filter "./packages/*" build
```

#### Changes to shared package not reflected in app

**Solution:** Rebuild the package and restart the app:
```bash
pnpm --filter @wickers/ui build  # or whichever package changed
# Restart your app dev server
```

#### Lock file conflicts after merge

**Solution:** Regenerate the lock file:
```bash
pnpm install
```

#### "Cannot find module" errors

**Solution:** Clean and reinstall:
```bash
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
rm -rf test-apps/*/node_modules
pnpm install
```

#### Type errors from workspace packages

**Solution:** Ensure the package is built with type declarations:
```bash
pnpm --filter "./packages/*" build
```
Check that `dist/index.d.ts` exists in each package.

#### pnpm command not found

**Solution:** Install pnpm globally:
```bash
npm install -g pnpm@9
```

### Useful Debug Commands

```bash
# List all workspaces
pnpm ls -r --depth 0

# Check why a package is installed
pnpm why <package-name>

# Validate workspace configuration
pnpm install --dry-run

# Check pnpm store status
pnpm store status

# Prune unused packages from store
pnpm store prune
```

---

## Quick Reference Card

```bash
# Install everything
pnpm install

# Build all shared packages
pnpm --filter "./packages/*" build

# Start applications
pnpm --filter react-app dev
pnpm --filter data-app dev

# Start test applications
pnpm --filter styles-test-app dev
pnpm --filter msal-auth-test-app dev

# Add workspace package to app
pnpm --filter react-app add @wickers/msal-auth
pnpm --filter react-app add @wickers/ui
pnpm --filter react-app add @wickers/tanstack
pnpm --filter react-app add @wickers/ui-styles

# Add npm package to app
pnpm --filter react-app add <package-name>

# Build app for production
pnpm --filter react-app build

# Run tests
pnpm --filter react-app test:run

# Lint and format
pnpm --filter react-app lint:fix
pnpm --filter react-app format
```

---

## Additional Resources

- [pnpm Documentation](https://pnpm.io/)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Vite Documentation](https://vitejs.dev/)
- [Vitest Documentation](https://vitest.dev/)

---

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Ensure tests pass: `pnpm -r test:run`
4. Ensure linting passes: `pnpm -r lint`
5. Submit a pull request

---

*Last updated: January 2026*

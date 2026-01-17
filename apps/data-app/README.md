# Data360 App

A comprehensive data management application for product catalog, attributes, publishing, and customer information management.

## Overview

Data360 App is a React-based application built with Vite that provides a centralized interface for managing product data, attributes, publishing workflows, and customer information. It's part of the React monorepo and leverages shared packages for authentication, API clients, and UI components.

## Features

### Product360
- **Product Catalog**: Browse and search through product catalogs
- **Product Details**: View detailed product information
- **Filtering & Search**: Advanced filtering by attributes and search functionality
- **Pagination**: Efficient browsing with paginated product lists

### Category & Attribute Maintenance
- Manage product categories and attributes
- Define and configure product attribute definitions
- Maintain lookup tables and reference data

### Publishing Manager
- Manage product publishing workflows
- Create and compare product snapshots
- Track publishing history and status

### Customer360 (Coming Soon)
- Customer profile management
- Order history and analytics
- Account status and preferences
- Communication history

## Tech Stack

### Core Technologies
- **React** 19.1.1
- **TypeScript** 5.1.3
- **Vite** 7.3.0
- **React Router** 7.9.3

### State Management
- **Redux Toolkit** 2.9.0
- **TanStack Query** 5.90.12

### Authentication
- **MSAL (Microsoft Authentication Library)** 4.27.0
- Azure AD integration via `@wickers/msal-auth`

### UI & Styling
- **Tailwind CSS** 4.1.13
- **shadcn/ui** components via `@wickers/ui`
- **Lucide React** icons
- **Class Variance Authority** for component variants

### Shared Packages
- `@wickers/msal-auth` - Authentication utilities
- `@wickers/tanstack` - API client and CRUD hooks
- `@wickers/ui` - Shared UI component library
- `@wickers/ui-styles` - Shared Tailwind styles

### Development Tools
- **Vitest** - Testing framework
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript ESLint** - TypeScript linting

## Project Structure

```
data-app/
├── api/                          # .NET API backend
│   └── Unifirst.CPQ.Api/        # ASP.NET Core API
├── src/
│   ├── components/               # Reusable components
│   │   ├── PublishingManager.tsx
│   │   ├── SearchBar.tsx
│   │   └── SnapshotComparison.tsx
│   ├── features/                 # Feature modules
│   │   ├── Lookups/             # Lookup data management
│   │   ├── Products/            # Product management
│   │   └── user/                # User state management
│   ├── layouts/                  # Layout components
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   └── Breadcrumb.tsx
│   ├── pages/                    # Page components
│   │   ├── Product360/          # Product catalog page
│   │   ├── CategoryMaintenance.tsx
│   │   ├── Customer360.tsx
│   │   └── WelcomePage.tsx
│   ├── router/                   # Route configuration
│   ├── store/                    # Redux store
│   ├── hooks/                    # Custom React hooks
│   ├── utils/                    # Utility functions
│   └── global/                   # Global constants
├── public/                       # Static assets
├── database/                     # Database files
└── docs/                         # Documentation
```

## Getting Started

### Prerequisites

- Node.js >= 18.x
- pnpm >= 9.0.0
- Access to the monorepo workspace

### Installation

From the monorepo root:

```bash
# Install all dependencies (including workspace packages)
pnpm install

# Build shared packages
pnpm run build:packages
```

### Environment Variables

Create a `.env` file in the `data-app` directory with the following variables:

```env
VITE_APP_API_URL=your-api-url
VITE_API_SCOPE=your-api-scope
VITE_AZURE_CLIENT_ID=your-client-id
VITE_AZURE_AUTHORITY=your-authority-url
VITE_AZURE_REDIRECT_URI=your-redirect-uri
```

### Development

```bash
# From the monorepo root
pnpm --filter data360-app dev

# Or from the app directory
cd apps/data-app
pnpm dev
```

The application will start on `http://localhost:3005` and automatically open in your browser.

### Building for Production

```bash
# From the monorepo root
pnpm --filter data360-app build

# Or from the app directory
cd apps/data-app
pnpm build
```

The production build will be output to `dist/`.

### Preview Production Build

```bash
pnpm --filter data360-app preview
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start development server with linting and formatting |
| `build` | Build for production |
| `preview` | Preview production build |
| `test` | Run tests in watch mode |
| `test:run` | Run tests once |
| `test:coverage` | Run tests with coverage report |
| `test:ui` | Run tests with Vitest UI |
| `lint` | Check for linting errors |
| `lint:fix` | Fix linting errors automatically |
| `format` | Format code with Prettier |
| `format:check` | Check code formatting |
| `prod` | Build and preview production build |

## Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | WelcomePage | Welcome/login page |
| `/home` | Product360 | Product catalog (protected) |
| `/attributes` | CategoryMaintenance | Attribute management (protected) |
| `/publishing` | PublishingManager | Publishing workflows (protected) |
| `/customer360` | Customer360 | Customer management (protected, coming soon) |
| `/styling` | Styling | Style guide (protected) |

## API Integration

The app uses TanStack Query for API calls through the `@wickers/tanstack` package. API endpoints are configured in:

- `src/features/baseApi.ts` - Base API configuration
- `src/features/Lookups/` - Lookup data endpoints
- `src/features/Products/` - Product endpoints

### Backend API

The application includes a .NET backend API in the `api/` directory:

- **Framework**: ASP.NET Core
- **Location**: `api/Unifirst.CPQ.Api/`
- **Endpoints**: Products, Lookups, Billing

## Testing

```bash
# Run all tests
pnpm test:run

# Run tests in watch mode
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests with UI
pnpm test:ui
```

Tests are located in:
- `src/tests/` - Component and utility tests
- `test/` - Integration tests

## Code Quality

### Linting

```bash
# Check for linting errors
pnpm lint

# Auto-fix linting errors
pnpm lint:fix
```

### Formatting

```bash
# Format all files
pnpm format

# Check formatting
pnpm format:check
```

## Troubleshooting

### Build Errors

If you encounter build errors:

1. Ensure all workspace packages are built:
   ```bash
   pnpm run build:packages
   ```

2. Clean and reinstall dependencies:
   ```bash
   rm -rf node_modules
   pnpm install
   ```

### Authentication Issues

- Verify environment variables are set correctly
- Check Azure AD app registration configuration
- Ensure redirect URIs match in Azure AD and `.env` file

### API Connection Issues

- Verify `VITE_APP_API_URL` is correct
- Check API scope permissions
- Ensure authentication token is valid

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Ensure tests pass: `pnpm test:run`
4. Ensure linting passes: `pnpm lint`
5. Format code: `pnpm format`
6. Submit a pull request

## Related Documentation

- [Monorepo README](../../README.md) - Overall monorepo documentation
- [MSAL Auth Package](../../packages/msal-auth/README.md) - Authentication package docs
- [TanStack Package](../../packages/tanstack/README.md) - API client package docs
- [UI Package](../../packages/ui/README.md) - UI component library docs

## License

Private - Internal use only


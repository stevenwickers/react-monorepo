# @wickers/tanstack

A powerful TanStack Query utilities package that provides type-safe CRUD operations, automatic authentication handling with Azure MSAL, and pre-configured API clients for React applications.

## Features

- 🔄 **CRUD Hooks Factory** - Generate type-safe React Query hooks for any resource
- 🔐 **MSAL Integration** - Seamless Azure AD authentication with automatic token handling
- 📡 **Pre-configured API Client** - Axios instance with bearer token injection
- 🗝️ **Query Key Management** - Consistent and predictable cache invalidation
- 🧪 **In-Memory Mock Service** - Perfect for testing and prototyping

## Installation

```bash
pnpm add @wickers/tanstack
```

### Peer Dependencies

Ensure you have the following peer dependencies installed:

```bash
pnpm add @azure/msal-browser @azure/msal-react @tanstack/react-query axios react
```

## Quick Start

### 1. Configure the Provider

Wrap your application with the required providers:

```tsx
import { TanstackConfigProvider, ApiTokenProvider, queryClient } from '@wickers/tanstack'
import { QueryClientProvider } from '@tanstack/react-query'
import { MsalProvider } from '@azure/msal-react'
import { msalInstance } from './authConfig'

const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  apiScopes: [`api://${import.meta.env.VITE_API_CLIENT_ID}/API.Read`],
  msalInstance: msalInstance,
}

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <TanstackConfigProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ApiTokenProvider>
            <YourApp />
          </ApiTokenProvider>
        </QueryClientProvider>
      </TanstackConfigProvider>
    </MsalProvider>
  )
}
```

### 2. Create a Service

```tsx
import { CreateCrudService, useApiClient } from '@wickers/tanstack'

interface Product {
  id: number
  name: string
  price: number
}

// In a component or custom hook
const apiClient = useApiClient()

const productService = CreateCrudService<Product>({
  basePath: '/api/products',
  client: apiClient,
})
```

### 3. Create CRUD Hooks

```tsx
import { CreateCurdHooks } from '@wickers/tanstack'

const productHooks = CreateCurdHooks<Product>({
  resource: 'products',
  service: productService,
})

export const {
  useList: useProducts,
  useDetail: useProduct,
  useCreate: useCreateProduct,
  useUpdate: useUpdateProduct,
  useDelete: useDeleteProduct,
} = productHooks
```

### 4. Use in Components

```tsx
function ProductList() {
  const { data: products, isLoading } = useProducts()
  const createProduct = useCreateProduct()
  const deleteProduct = useDeleteProduct()

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      {products?.map((product) => (
        <div key={product.id}>
          {product.name} - ${product.price}
          <button onClick={() => deleteProduct(product.id)}>Delete</button>
        </div>
      ))}
      <button onClick={() => createProduct({ name: 'New Product', price: 99 })}>
        Add Product
      </button>
    </div>
  )
}
```

## API Reference

### Providers

#### `TanstackConfigProvider`

Provides configuration to the package. Must wrap components using package hooks.

```tsx
interface TanstackPackageConfig {
  apiBaseUrl: string              // Base URL for API requests
  apiScopes: string[]             // MSAL scopes for API authentication
  msalInstance: IPublicClientApplication  // MSAL instance
}

<TanstackConfigProvider config={config}>
  {children}
</TanstackConfigProvider>
```

#### `ApiTokenProvider`

Creates an authenticated Axios client with automatic bearer token injection. Must be used within `TanstackConfigProvider` and `MsalProvider`.

```tsx
<ApiTokenProvider>
  {children}
</ApiTokenProvider>
```

### Hooks

#### `usePackageConfig()`

Access the package configuration.

```tsx
const { apiBaseUrl, apiScopes, msalInstance } = usePackageConfig()
```

#### `useApiClient()`

Get the configured Axios instance with authentication.

```tsx
const apiClient = useApiClient()
const response = await apiClient.get('/api/data')
```

#### `useApiToken()`

Get a function to acquire access tokens and the current account.

```tsx
const { getToken, account } = useApiToken()
const token = await getToken()
```

### CRUD Utilities

#### `CreateCrudService<TEntity, TId, TCreate, TUpdate>(config)`

Creates a service object with standard CRUD operations.

```tsx
const service = CreateCrudService<Product>({
  basePath: '/api/products',  // API endpoint path
  client: axiosInstance,      // Axios instance
  idParamName: 'id',          // Optional: ID parameter name (default: 'id')
})

// Available methods:
service.list(params?)           // GET /api/products
service.getById(id)             // GET /api/products/:id
service.create(payload)         // POST /api/products
service.update(id, payload)     // PUT /api/products/:id
service.delete(id)              // DELETE /api/products/:id
```

#### `CreateCurdHooks<TEntity, TId, TCreate, TUpdate>(config)`

Generates React Query hooks for a resource.

```tsx
const hooks = CreateCurdHooks<Product>({
  resource: 'products',
  service: productService,
})

// Available hooks:
hooks.useList(filters?, options?)    // Query hook for listing
hooks.useDetail(id, options?)        // Query hook for single item
hooks.useCreate(options?)            // Mutation hook for creating
hooks.useUpdate(options?)            // Mutation hook for updating
hooks.useDelete(options?)            // Mutation hook for deleting
hooks.keys                           // Query key factory
```

#### `createCrudQueryKeys(resource)`

Creates consistent query keys for cache management.

```tsx
const keys = createCrudQueryKeys('products')

keys.all             // ['products']
keys.list(filters)   // ['products', 'list', filters]
keys.detail(id)      // ['products', 'detail', id]
```

### API Client Factory

#### `createApiClient(baseURL, accessToken)`

Creates an Axios instance with pre-configured authentication.

```tsx
const apiClient = createApiClient('https://api.example.com', accessToken)
```

### Query Client

#### `queryClient`

Pre-configured TanStack Query client with sensible defaults:

- Queries: 1 retry, 5-minute stale time, no refetch on window focus
- Mutations: 0 retries

```tsx
import { queryClient } from '@wickers/tanstack'

<QueryClientProvider client={queryClient}>
  {children}
</QueryClientProvider>
```

### Mock Utilities

#### `CreateInMemoryCredService<TEntity, TId, TCreate, TUpdate>(options)`

Creates an in-memory CRUD service for testing and prototyping.

```tsx
const mockService = CreateInMemoryCredService<Product>({
  initialData: [
    { id: 1, name: 'Product A', price: 100 },
    { id: 2, name: 'Product B', price: 200 },
  ],
  idKey: 'id',
  createId: () => Date.now(),  // Optional: custom ID generator
})

// Use with CreateCurdHooks for testing
const hooks = CreateCurdHooks({
  resource: 'products',
  service: mockService,
})
```

## TypeScript Support

All utilities are fully typed with generics:

```tsx
interface Product {
  id: number
  name: string
  price: number
}

interface CreateProductDTO {
  name: string
  price: number
}

interface UpdateProductDTO {
  name?: string
  price?: number
}

const service = CreateCrudService<Product, number, CreateProductDTO, UpdateProductDTO>({
  basePath: '/api/products',
  client: apiClient,
})

const hooks = CreateCurdHooks<Product, number, CreateProductDTO, UpdateProductDTO>({
  resource: 'products',
  service,
})
```

## Development

```bash
# Install dependencies
pnpm install

# Build the package
pnpm build

# Run type checking
pnpm typecheck

# Run linting
pnpm lint

# Fix linting issues
pnpm lint:fix

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## License

Private - Unifirst Corporation



# MSAL Auth Test App

A simple Vite React TypeScript application to test the `@wickers/msal-auth` package.

## Setup

### 1. Configure Environment Variables

Create a `.env` file in this directory with your Azure AD configuration:

```env
VITE_CLIENT_ID=your-azure-ad-client-id
VITE_AUTHORITY=https://login.microsoftonline.com/your-tenant-id
VITE_REDIRECT_URI=http://localhost:3000
VITE_POST_LOGOUT_REDIRECT_URI=http://localhost:3000
VITE_AZURE_SCOPES=openid profile email
```

### 2. Build the MSAL-AUTH Package

First, build the `msal-auth` package:

```bash
cd ../msal-auth
npm install
npm run build
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`.

## Features Tested

- ✅ **MsalAuthProvider** - Wraps the app with MSAL authentication
- ✅ **useAuthState** - Hook to get authentication status and actions
- ✅ **Login/Logout** - Azure AD redirect-based authentication
- ✅ **RequireAuth** - Protected route component
- ✅ **getAccessToken** - Retrieve access tokens for API calls
- ✅ **Callbacks** - onSignIn/onSignOut event handlers

## App Structure

```
src/
├── main.tsx          # Entry point with BrowserRouter
├── App.tsx           # MsalAuthProvider setup with config from env
├── index.css         # Modern dark theme styling
├── vite-env.d.ts     # TypeScript env variable types
└── pages/
    ├── HomePage.tsx      # Public page with login/logout
    └── ProtectedPage.tsx # Protected page requiring auth
```

## How It Works

1. **App.tsx** configures `MsalAuthProvider` with values from environment variables
2. **HomePage** shows authentication status and login/logout buttons
3. **ProtectedPage** uses `RequireAuth` to ensure only authenticated users can access
4. The `useAuthState` hook provides `isAuthenticated`, `account`, `login`, `logout`, and `getAccessToken`


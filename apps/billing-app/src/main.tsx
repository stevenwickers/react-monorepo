import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "@/store";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { MsalAuthProvider, createMsalInstance } from "@unifirst/msal-auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@unifirst/tanstack";
import { TanstackConfigProvider, ApiTokenProvider } from "@unifirst/tanstack";
import { ErrorBoundary } from "@unifirst/ui";
import { HOME_ROUTE, API_READ } from "@/global/contants.ts";
import "@unifirst/ui-styles/tailwind.css";

const msalInstance = createMsalInstance(import.meta.env);

const config = {
  apiBaseUrl: import.meta.env.VITE_APP_API_URL,
  apiScopes: [`${import.meta.env.VITE_API_SCOPE}/${API_READ}`],
  msalInstance: msalInstance,
};

const renderApp = () => {
  const accounts = msalInstance.getAllAccounts();
  if (accounts.length > 0 && !msalInstance.getActiveAccount()) {
    msalInstance.setActiveAccount(accounts[0]);
  }

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <MsalAuthProvider envSource={import.meta.env}>
          <TanstackConfigProvider config={config}>
            <ApiTokenProvider>
              <Provider store={store}>
                <ErrorBoundary
                  onNavigateHome={() => (window.location.href = HOME_ROUTE)}
                >
                  <RouterProvider router={router} />
                </ErrorBoundary>
              </Provider>
            </ApiTokenProvider>
          </TanstackConfigProvider>
        </MsalAuthProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
};

msalInstance
  .initialize()
  .then(() => msalInstance.handleRedirectPromise())
  .then((response) => {
    if (response?.account) {
      msalInstance.setActiveAccount(response.account);
      // Navigate to home after successful login
      if (window.location.pathname === "/") {
        window.location.replace(HOME_ROUTE);
      }
    }
    renderApp();
  })
  .catch((error) => {
    console.error("MSAL initialization error:", error);
    renderApp();
  });

import { createBrowserRouter } from "react-router-dom";
import { WelcomePage, ErrorPage, CPQ } from "@/pages";
import { RequireAuth } from "@unifirst/msal-auth";
import { Layout } from "@/layouts/Layout";
import { HOME_ROUTE } from "@/global/contants.ts";

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    children: [
      // Public route - welcome/login page
      {
        index: true,
        element: <WelcomePage />,
      },
      // Protected routes - require authentication
      {
        element: <RequireAuth />,
        children: [
          {
            element: <Layout />,
            children: [
              {
                path: HOME_ROUTE,
                element: <CPQ />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;

import { createBrowserRouter } from "react-router-dom";
import {
  WelcomePage,
  ErrorPage,
  Product360,
  CategoryMaintenance,
  Customer360,
  Styling,
} from "@/pages";
import { RequireAuth } from "@unifirst/msal-auth";
import PublishingManager from "@/components/PublishingManager";
import { Layout } from "@/layouts/Layout";
import {
  HOME_ROUTE,
  ATTRIBUTES_ROUTE,
  PUBLISHING_ROUTE,
  CUSTOMER360_ROUTE,
} from "@/global/contants.ts";

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
                element: <Product360 />,
              },
              {
                path: ATTRIBUTES_ROUTE,
                element: <CategoryMaintenance />,
              },
              {
                path: PUBLISHING_ROUTE,
                element: <PublishingManager />,
              },
              {
                path: CUSTOMER360_ROUTE,
                element: <Customer360 />,
              },
              {
                path: "/styling",
                element: <Styling />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;

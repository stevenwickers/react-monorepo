import React from "react";
import { useNavigate, useRouteError } from "react-router-dom";
import { Error } from "@unifirst/ui";
import { HOME_ROUTE } from "@/global/contants.ts";

const ErrorPage = () => {
  const navigate = useNavigate();
  const router_error = useRouteError();

  const handleNavHome = () => {
    navigate(HOME_ROUTE);
  };

  return (
    <Error
      error={router_error}
      isDevEnv={process.env.NODE_ENV === "development"}
      handleNavHome={handleNavHome}
    />
  );
};

export default ErrorPage;

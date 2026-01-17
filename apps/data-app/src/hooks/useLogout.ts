import { useCallback } from "react";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();

  const logout = useCallback(() => {
    const logoutRequest = {
      account: accounts[0],
      postLogoutRedirectUri: "/",
    };

    instance
      .logoutRedirect(logoutRequest)
      .then(() => navigate("/"))
      .catch((error) => {
        console.error("Logout error:", error);
      });
  }, [instance, accounts, navigate]);

  return logout;
};

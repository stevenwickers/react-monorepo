import { useAuthState } from "@unifirst/msal-auth";
import { useEffect, useState } from "react";

export const useAccessToken = () => {
  const { getAccessToken, isAuthenticated } = useAuthState();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    //-> Dev Only!!!!
    if (!import.meta.env.DEV) return;

    const logToken = async () => {
      if (isAuthenticated) {
        const token = await getAccessToken();
        setToken(token);
      }
    };
    logToken().then();
  }, [isAuthenticated, getAccessToken]);

  return token;
};

import { Welcome } from "@unifirst/ui";
import { HOME_ROUTE } from "@/global/contants.ts";
import { loginRequest } from "@unifirst/msal-auth";
import { useMsal } from "@azure/msal-react";

const WelcomePage = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    const scopes = loginRequest(import.meta.env);
    // Set the state to include the route for post-login navigation
    const loginRequestWithRedirect = {
      ...scopes,
      redirectStartPage: HOME_ROUTE,
    };
    instance.loginRedirect(loginRequestWithRedirect);
  };

  return <Welcome title={"Data 360"} handleLogin={handleLogin} />;
};

export default WelcomePage;

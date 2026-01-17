import { MenuBar } from "./MenuBar";
import { useAuth } from "@/hooks/useAuth";
import { useInactivityLogout } from "@unifirst/msal-auth";
import { useAccessToken } from "@/hooks/useAccessToken.ts";
import { Outlet } from "react-router-dom";
import { AppBootstrap } from "./AppBootstrap";

export const Layout = () => {
  useAuth();
  useInactivityLogout();

  //***** Prints Out Token - DEV ONLY *****//
  const token = useAccessToken();
  console.log(token ?? "No token");

  return (
    <AppBootstrap>
      <div className="flex h-screen w-full overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-14 sm:h-16 shrink-0 items-center gap-2 border-b px-2 sm:px-4">
            <MenuBar />
          </header>
          <main className="flex-1 overflow-hidden">{<Outlet />}</main>
        </div>
      </div>
    </AppBootstrap>
  );
};

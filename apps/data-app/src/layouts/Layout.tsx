import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useInactivityLogout } from "@unifirst/msal-auth";
import { Outlet } from "react-router-dom";
import { AppBootstrap } from "./AppBootstrap";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  Separator,
} from "@unifirst/ui";

export const Layout = () => {
  useAuth();
  useInactivityLogout();

  return (
    <AppBootstrap>
      <SidebarProvider>
        <Sidebar />
        <SidebarInset className="flex flex-col overflow-hidden">
          <header className="flex h-14 sm:h-16 shrink-0 items-center gap-2 border-b px-4 sm:px-6 bg-white">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-6 mx-2" />
            <TopBar />
          </header>
          <main className="flex-1 overflow-auto bg-gray-50">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AppBootstrap>
  );
};

import { useState } from "react";
import { LogOut, User, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Button,
} from "@unifirst/ui";
import { useAppSelector } from "@/hooks/useRedux.ts";
import { useLogout } from "@/hooks/useLogout.ts";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HOME_ROUTE,
  CUSTOMER360_ROUTE,
  ATTRIBUTES_ROUTE,
  PUBLISHING_ROUTE,
} from "@/global/contants.ts";

export type MenuItemProps = {
  id?: string;
  label: string;
  onSelect?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
};

export type MenuBarProps = {
  userMenuItems?: Array<MenuItemProps>;
};

export const MenuBar = ({ userMenuItems }: MenuBarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userAccount = useAppSelector((state) => state.user.account);
  const userName = userAccount?.name;
  const onLogout = useLogout();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigateToHome = () => {
    navigate(HOME_ROUTE);
    setMobileMenuOpen(false);
  };

  const navigationItems = [
    { label: "Product360", route: HOME_ROUTE },
    { label: "Customer360", route: CUSTOMER360_ROUTE },
  ];

  const isActiveRoute = (route: string) => {
    // Attributes and Publishing are sub-features of Product360
    if (route === HOME_ROUTE) {
      return (
        location.pathname === HOME_ROUTE ||
        location.pathname === ATTRIBUTES_ROUTE ||
        location.pathname === PUBLISHING_ROUTE
      );
    }
    return location.pathname === route;
  };

  const handleNavigation = (route: string) => {
    navigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <div className="w-full">
      <div className="flex items-center h-14 sm:h-16 px-2 sm:px-4 lg:px-6 gap-2 sm:gap-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>

        {/* Logo */}
        <div
          className="text-unifirst-teal-950 text-xl sm:text-2xl lg:text-4xl font-bold cursor-pointer hover:text-unifirst-teal-700 transition-colors duration-300 truncate"
          onClick={handleNavigateToHome}
        >
          {import.meta.env.VITE_APP_NAME}
        </div>

        {/* Desktop navigation */}
        {/*<nav className="hidden md:flex flex-1 items-center gap-1 px-2 lg:px-4">
          {navigationItems.map((item) => (
            <Button
              key={item.route}
              variant={isActiveRoute(item.route) ? 'default' : 'ghost'}
              onClick={() => handleNavigation(item.route)}
              className={
                isActiveRoute(item.route)
                  ? 'bg-unifirst-teal-700 text-white hover:bg-unifirst-teal-800'
                  : 'text-unifirst-teal-700 hover:bg-unifirst-teal-50'
              }
            >
              {item.label}
            </Button>
          ))}
        </nav>*/}

        {/* User dropdown */}
        <div className="flex items-center justify-end ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline max-w-[120px] truncate">
                  {userName}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {userMenuItems?.map((item) => (
                <DropdownMenuItem
                  key={item.id ?? item.label}
                  onClick={item.onSelect}
                  className="cursor-pointer"
                  disabled={item.disabled}
                >
                  {item.icon ? (
                    <span className="mr-2 flex h-4 w-4 items-center justify-center">
                      {item.icon}
                    </span>
                  ) : null}
                  <span>{item.label}</span>
                </DropdownMenuItem>
              ))}
              {userMenuItems?.length ? <DropdownMenuSeparator /> : null}
              <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="pt-3 text-xs" asChild>
                <span>Version: {__APP_VERSION__}</span>
              </DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile navigation menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="flex flex-col p-2 gap-1">
            {navigationItems.map((item) => (
              <Button
                key={item.route}
                variant={isActiveRoute(item.route) ? "default" : "ghost"}
                onClick={() => handleNavigation(item.route)}
                className={`w-full justify-start ${
                  isActiveRoute(item.route)
                    ? "bg-unifirst-teal-700 text-white hover:bg-unifirst-teal-800"
                    : "text-unifirst-teal-700 hover:bg-unifirst-teal-50"
                }`}
              >
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

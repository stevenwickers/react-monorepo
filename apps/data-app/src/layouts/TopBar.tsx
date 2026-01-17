import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Bell,
  ChevronDown,
  User,
  LogOut,
  Settings,
  Shield,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   TOP BAR - Header with search and user menu
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Extracts initials from a display name (up to 2 characters)
 */
const getInitials = (name: string): string => {
  if (!name?.trim()) return "U";
  return name
    .split(" ")
    .filter((part) => part.length > 0)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

interface TopBarProps {
  className?: string;
}

export function TopBar({ className }: TopBarProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Placeholder user data - replace with actual auth data
  const user = {
    displayName: "User",
    email: "",
    roles: [] as string[],
  };

  // Close menu on Escape key
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && isUserMenuOpen) {
        setIsUserMenuOpen(false);
      }
    },
    [isUserMenuOpen],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    navigate("/login");
  };

  // Get primary role for display
  const displayRole = user?.roles?.[0] || "User";

  return (
    <div className={cn("flex-1 flex items-center justify-end", className)}>
      {/* Spacer */}
      <div className="flex-1" />

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button
          aria-label="Notifications"
          className={cn(
            "relative p-2 rounded-lg",
            "text-slate-500 hover:text-slate-700 hover:bg-slate-100",
            "transition-colors duration-150",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40",
          )}
        >
          <Bell className="w-5 h-5" aria-hidden="true" />
          {/* Notification dot */}
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-500 rounded-full"
            aria-label="You have unread notifications"
          />
        </button>

        {/* User menu */}
        <div className="relative ml-2">
          <button
            id="user-menu-button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            aria-expanded={isUserMenuOpen}
            aria-haspopup="menu"
            aria-label="User menu"
            className={cn(
              "flex items-center gap-3 p-1.5 pr-3 rounded-lg",
              "hover:bg-slate-100",
              "transition-colors duration-150",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40",
            )}
          >
            {/* Avatar */}
            <div
              className={cn(
                "w-8 h-8 rounded-lg",
                "bg-gradient-to-br from-teal-400 to-teal-600",
                "flex items-center justify-center",
                "text-white text-sm font-semibold",
              )}
            >
              {user?.displayName ? getInitials(user.displayName) : "U"}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-slate-700">
                {user?.displayName || "User"}
              </p>
              <p className="text-xs text-slate-500">{displayRole}</p>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-slate-400 transition-transform duration-200",
                isUserMenuOpen && "rotate-180",
              )}
            />
          </button>

          {/* Dropdown */}
          {isUserMenuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsUserMenuOpen(false)}
              />

              {/* Menu */}
              <div
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
                className={cn(
                  "absolute right-0 mt-2 w-64 z-50",
                  "bg-white rounded-lg border border-slate-200 shadow-lg",
                  "animate-scale-in origin-top-right",
                )}
              >
                <div className="p-3 border-b border-slate-100">
                  <p className="text-sm font-medium text-slate-700">
                    {user?.displayName || "User"}
                  </p>
                  <p className="text-xs text-slate-500">{user?.email || ""}</p>
                  {/* Role badges */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {user?.roles?.map((role) => (
                      <span
                        key={role}
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                          role === "Admin"
                            ? "bg-amber-100 text-amber-700"
                            : role === "Reviewer"
                              ? "bg-purple-100 text-purple-700"
                              : role === "DataSteward"
                                ? "bg-teal-100 text-teal-700"
                                : "bg-slate-100 text-slate-600",
                        )}
                      >
                        {role === "Admin" && <Shield className="w-3 h-3" />}
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-1">
                  <button
                    role="menuitem"
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md",
                      "text-sm text-slate-600 hover:bg-slate-50",
                      "transition-colors duration-150",
                    )}
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate("/profile");
                    }}
                  >
                    <User className="w-4 h-4" aria-hidden="true" />
                    Profile
                  </button>
                  <button
                    role="menuitem"
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md",
                      "text-sm text-slate-600 hover:bg-slate-50",
                      "transition-colors duration-150",
                    )}
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate("/settings");
                    }}
                  >
                    <Settings className="w-4 h-4" aria-hidden="true" />
                    Settings
                  </button>
                </div>
                <div className="p-1 border-t border-slate-100">
                  <button
                    role="menuitem"
                    onClick={handleLogout}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-md",
                      "text-sm text-red-600 hover:bg-red-50",
                      "transition-colors duration-150",
                    )}
                  >
                    <LogOut className="w-4 h-4" aria-hidden="true" />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

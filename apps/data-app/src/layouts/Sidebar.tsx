import { useLocation, useNavigate } from "react-router-dom";
import {
  cn,
  Sidebar as ShadcnSidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@unifirst/ui";
import {
  Package,
  Users,
  DollarSign,
  Receipt,
  Settings,
  ChevronRight,
  Lock,
  LayoutGrid,
  Sliders,
  Send,
  Palette,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   SIDEBAR - Clean white navigation panel
   Light theme with teal accents
   ═══════════════════════════════════════════════════════════════════════════ */

interface NavItem {
  name: string;
  href?: string;
  icon: typeof Package;
  locked?: boolean;
  children?: {
    name: string;
    href: string;
    icon: typeof LayoutGrid;
  }[];
}

const navigation: { section: string; items: NavItem[] }[] = [
  {
    section: "DATA360",
    items: [
      {
        name: "Product",
        icon: Package,
        children: [
          {
            name: "Catalog",
            href: "/data360/product/catalog",
            icon: LayoutGrid,
          },
          {
            name: "Attributes",
            href: "/data360/product/attributes",
            icon: Sliders,
          },
          { name: "Colors", href: "/data360/product/colors", icon: Palette },
          {
            name: "Publishing",
            href: "/data360/product/publishing",
            icon: Send,
          },
        ],
      },
      { name: "Customer", icon: Users, locked: true },
      { name: "Pricing", icon: DollarSign, locked: true },
      { name: "Billing", icon: Receipt, locked: true },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const isItemActive = (item: NavItem) => {
    if (item.href) return location.pathname === item.href;
    if (item.children) {
      return item.children.some((child) => location.pathname === child.href);
    }
    return false;
  };

  const isChildActive = (href: string) => location.pathname === href;

  return (
    <ShadcnSidebar
      collapsible="icon"
      className="bg-white text-slate-600 border-r border-slate-200"
    >
      {/* Logo */}
      <SidebarHeader className="h-14 sm:h-16 px-3 border-b border-slate-200 flex items-center">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full">
          {/* Data360 Icon - Hexagonal data symbol */}
          <div className="relative w-8 h-8 flex-shrink-0 group-data-[collapsible=icon]:hidden">
            <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
              {/* Outer hexagon */}
              <path
                d="M20 2L36 11v18L20 38 4 29V11L20 2z"
                fill="url(#logoGradient)"
                stroke="rgba(13,148,136,0.3)"
                strokeWidth="0.5"
              />
              {/* Inner hexagon */}
              <path
                d="M20 8L30 14v12L20 32 10 26V14L20 8z"
                fill="rgba(255,255,255,0.3)"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="0.5"
              />
              {/* Center node */}
              <circle cx="20" cy="20" r="4" fill="white" />
              {/* Data connection lines */}
              <line
                x1="20"
                y1="16"
                x2="20"
                y2="8"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="1"
              />
              <line
                x1="20"
                y1="24"
                x2="20"
                y2="32"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="1"
              />
              <line
                x1="16.5"
                y1="18"
                x2="10"
                y2="14"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="1"
              />
              <line
                x1="23.5"
                y1="18"
                x2="30"
                y2="14"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="1"
              />
              <line
                x1="16.5"
                y1="22"
                x2="10"
                y2="26"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="1"
              />
              <line
                x1="23.5"
                y1="22"
                x2="30"
                y2="26"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="1"
              />
              {/* Small data nodes at vertices */}
              <circle cx="20" cy="8" r="1.5" fill="rgba(255,255,255,0.8)" />
              <circle cx="20" cy="32" r="1.5" fill="rgba(255,255,255,0.8)" />
              <circle cx="10" cy="14" r="1.5" fill="rgba(255,255,255,0.8)" />
              <circle cx="30" cy="14" r="1.5" fill="rgba(255,255,255,0.8)" />
              <circle cx="10" cy="26" r="1.5" fill="rgba(255,255,255,0.8)" />
              <circle cx="30" cy="26" r="1.5" fill="rgba(255,255,255,0.8)" />
              {/* Gradient definition */}
              <defs>
                <linearGradient
                  id="logoGradient"
                  x1="4"
                  y1="2"
                  x2="36"
                  y2="38"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#2dd4bf" />
                  <stop offset="1" stopColor="#0d9488" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <h1 className="font-display font-semibold text-slate-800 text-sm tracking-tight">
              Data360
            </h1>
            <p className="text-[10px] text-slate-500">Master Data Platform</p>
          </div>
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="py-4 px-2">
        {navigation.map((group) => (
          <SidebarGroup key={group.section} className="mb-6 px-0">
            {/* Section label */}
            <SidebarGroupLabel className="px-2 mb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest group-data-[collapsible=icon]:hidden">
              {group.section}
            </SidebarGroupLabel>

            {/* Items */}
            <SidebarMenu className="space-y-1">
              {group.items.map((item) => (
                <SidebarMenuItem key={item.name}>
                  {item.locked ? (
                    // Locked item
                    <SidebarMenuButton
                      disabled
                      tooltip={item.name}
                      className={cn(
                        "text-slate-400 cursor-not-allowed opacity-60",
                        "hover:bg-transparent hover:text-slate-400",
                      )}
                    >
                      <item.icon className="w-5 h-5" aria-hidden="true" />
                      <span className="flex-1 text-sm font-medium">
                        {item.name}
                      </span>
                      <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                      <span className="sr-only">(Coming soon)</span>
                    </SidebarMenuButton>
                  ) : item.children ? (
                    // Expandable item with children
                    <Collapsible
                      defaultOpen={isItemActive(item)}
                      className="group/collapsible"
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.name}
                          isActive={isItemActive(item)}
                          className={cn(
                            "text-sm font-medium transition-all duration-150",
                            isItemActive(item)
                              ? "text-teal-700 bg-teal-50 hover:bg-teal-50"
                              : "text-slate-600 hover:text-slate-800 hover:bg-slate-50",
                          )}
                        >
                          <item.icon className="w-5 h-5" aria-hidden="true" />
                          <span className="flex-1 text-left">{item.name}</span>
                          <ChevronRight
                            aria-hidden="true"
                            className={cn(
                              "w-4 h-4 transition-transform duration-200",
                              "group-data-[state=open]/collapsible:rotate-90",
                            )}
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <SidebarMenuSub className="ml-5 mt-1 border-l border-slate-200 pl-4 space-y-0.5">
                          {item.children.map((child) => (
                            <SidebarMenuSubItem key={child.href}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isChildActive(child.href)}
                                className={cn(
                                  "text-sm transition-all duration-150 relative",
                                  isChildActive(child.href)
                                    ? [
                                        "text-teal-600 font-medium bg-teal-50",
                                        "before:absolute before:-left-4 before:top-1/2 before:-translate-y-1/2",
                                        "before:w-0.5 before:h-4 before:bg-teal-500 before:rounded-full",
                                      ]
                                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50",
                                )}
                              >
                                <button onClick={() => navigate(child.href)}>
                                  <child.icon
                                    className="w-4 h-4"
                                    aria-hidden="true"
                                  />
                                  {child.name}
                                </button>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    // Simple link item
                    <SidebarMenuButton
                      tooltip={item.name}
                      isActive={isChildActive(item.href!)}
                      onClick={() => navigate(item.href!)}
                      className={cn(
                        "text-sm font-medium transition-all duration-150 relative",
                        isChildActive(item.href!)
                          ? [
                              "text-teal-700 bg-teal-50",
                              "before:absolute before:left-0 before:top-1 before:bottom-1",
                              "before:w-[3px] before:bg-teal-500 before:rounded-r",
                            ]
                          : "text-slate-600 hover:text-slate-800 hover:bg-slate-50",
                      )}
                    >
                      <item.icon className="w-5 h-5" aria-hidden="true" />
                      {item.name}
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="px-2 py-4 border-t border-slate-200">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Settings"
              onClick={() => navigate("/settings")}
              className={cn(
                "text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-50",
                "transition-colors duration-150",
              )}
            >
              <Settings className="w-5 h-5" aria-hidden="true" />
              Settings
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="mt-3 px-2 group-data-[collapsible=icon]:hidden">
          <p className="text-[10px] text-slate-400">Data360 v1.0.0</p>
        </div>
      </SidebarFooter>
    </ShadcnSidebar>
  );
}

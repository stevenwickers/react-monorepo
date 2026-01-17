import { Link } from "react-router-dom";
import { cn } from "@unifirst/ui";
import { ChevronRight, Home } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   BREADCRUMB - Navigation path indicator
   ═══════════════════════════════════════════════════════════════════════════ */

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      className={cn("flex items-center gap-1 text-sm", className)}
      aria-label="Breadcrumb"
    >
      {/* Home icon */}
      <Link
        to="/"
        className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
        aria-label="Home"
      >
        <Home className="w-4 h-4" aria-hidden="true" />
      </Link>

      {items.map((item, index) => {
        const isLastItem = index === items.length - 1;
        const key = item.href ?? `breadcrumb-${item.label}`;

        return (
          <div key={key} className="flex items-center gap-1">
            <ChevronRight
              className="w-4 h-4 text-slate-300"
              aria-hidden="true"
            />
            {item.href && !isLastItem ? (
              <Link
                to={item.href}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="text-slate-700 font-medium"
                aria-current={isLastItem ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}

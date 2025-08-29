import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="mb-4 flex items-center space-x-1 text-sm text-neutral-500">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <ChevronRight className="mx-1 h-4 w-4 text-neutral-400" />
          )}
          {item.href && !item.isActive ? (
            <Link
              to={item.href}
              className="text-blue-600 transition-colors hover:text-blue-800"
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={
                item.isActive
                  ? "font-medium text-neutral-900"
                  : "text-neutral-500"
              }
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}

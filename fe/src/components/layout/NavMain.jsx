"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavMain({ items }) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname === item.url ||
            (item.url !== "/dashboard" && pathname.startsWith(item.url));
          const Icon = item.icon;

          return (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                asChild
                disabled={item.disabled}
                tooltip={isCollapsed ? item.title : undefined}
                className={cn(
                  "relative h-10 transition-all duration-200",
                  isActive && "bg-sidebar-accent text-primary font-medium",
                  item.disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <Link
                  href={item.disabled ? "#" : item.url}
                  className={cn(
                    "flex items-center gap-3 px-3 rounded-lg",
                    item.disabled && "pointer-events-none"
                  )}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                  )}

                  <Icon className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )} />

                  <span className="flex-1 truncate">{item.title}</span>

                  {/* Badge */}
                  {item.badge && !isCollapsed && (
                    <Badge
                      variant="secondary"
                      className="h-5 text-[10px] px-1.5 bg-primary/10 text-primary border-0"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

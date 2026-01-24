"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
} from "lucide-react";
import { ProjectHeader } from "./ProjectHeader";
import { UserMenu } from "./UserMenu";
import { ProjectNavigation } from "./ProjectNavigation";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";

export function Sidebar({ ...props }) {
  const pathname = usePathname();

  return (
    <ShadcnSidebar collapsible="icon" {...props} className="border-r-0">
      <SidebarHeader>
        <ProjectHeader />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Dashboard */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard"} tooltip="Dashboard">
                  <Link href="/dashboard">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Project Navigation */}
              <ProjectNavigation />

              {/* Users */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith("/users")} tooltip="Users">
                  <Link href="/users">
                    <Users />
                    <span>Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Global Settings */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/settings"} tooltip="Global Settings">
                  <Link href="/settings">
                    <Settings />
                    <span>Global Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <UserMenu />
      </SidebarFooter>
      <SidebarRail />
    </ShadcnSidebar>
  );
}

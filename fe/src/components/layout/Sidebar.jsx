"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  Bot,
  CalendarDays,
  MessageCircleQuestion,
  Users,
  Settings,
  FolderOpen,
  ClipboardList,
  ChevronRight
} from "lucide-react";
import useProjectsStore from "@/store/projectsStore";
import { TeamSwitcher } from "./TeamSwitcher";
import { NavUser } from "./NavUser";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

// items specific to a project
const projectTools = [
  { name: "Chat", href: "/chat", icon: MessageSquare },
  { name: "SpecBot", href: "/specbot", icon: Bot },
  { name: "Requirements", href: "/requirements", icon: ClipboardList },
  { name: "Meetings", href: "/meetings", icon: CalendarDays },
  { name: "Feedback", href: "/feedback", icon: MessageCircleQuestion },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ ...props }) {
  const pathname = usePathname();
  const { selectedProject } = useProjectsStore();

  // Helper to determine if a link is active
  const isLinkActive = (href) => pathname === href || pathname.startsWith(href);

  return (
    <ShadcnSidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
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

              {/* Projects with Submenu */}
              <Collapsible defaultOpen className="group/collapsible" asChild>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Project" isActive={pathname.startsWith("/projects")}>
                      <FolderOpen />
                      <span>Project</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {/* If a project is selected, show tools */}
                      {selectedProject ? (
                        <>
                          {projectTools.map((tool) => {
                            const projectBase = `/projects/${selectedProject.slug}`;
                            const href = tool.href ? `${projectBase}${tool.href}` : projectBase;
                            const isActive = pathname === href;

                            return (
                              <SidebarMenuSubItem key={tool.name}>
                                <SidebarMenuSubButton asChild isActive={isActive}>
                                  <Link href={href}>
                                    <tool.icon className="h-4 w-4 mr-2" />
                                    <span>{tool.name}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </>
                      ) : (
                        <SidebarMenuSubItem>
                          <span className="px-2 py-1 text-xs text-muted-foreground">No project selected</span>
                        </SidebarMenuSubItem>
                      )}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

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
                <SidebarMenuButton asChild isActive={pathname === "/settings"} tooltip="Settings">
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
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </ShadcnSidebar>
  );
}

"use client";

import {
  LayoutDashboard,
  MessageSquare,
  Bot,
  Video,
  MessageCircle,
  Settings,
  Clipboard,
  ChevronRight,
} from "lucide-react";

import { NavMain } from "@/components/layout/NavMain";
import { NavUser } from "@/components/layout/NavUser";
import { TeamSwitcher } from "@/components/layout/TeamSwitcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

import useAuthStore from "@/store/authStore";
import useProjectsStore from "@/store/projectsStore";

const allSidebarItems = [
  {
    id: "dashboard",
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview & projects",
  },
  {
    id: "chat",
    title: "Team Chat",
    url: "/chat",
    icon: MessageSquare,
    description: "Collaborate with team",
  },
  {
    id: "specbot",
    title: "SpecBot",
    url: "/specbot",
    icon: Bot,
    description: "AI assistant",
    badge: "AI",
  },
  {
    id: "meetings",
    title: "Meetings",
    url: "/meetings",
    icon: Video,
    description: "Schedule & record",
  },
  {
    id: "feedback",
    title: "Feedback",
    url: "/feedback",
    icon: MessageCircle,
    description: "Collect insights",
  },
  {
    id: "requirements",
    title: "Requirements",
    url: "/requirements",
    icon: Clipboard,
    description: "Manage specs",
  },
  {
    id: "project_settings",
    title: "Settings",
    url: "/settings",
    icon: Settings,
    description: "Project settings",
  },
];

export function AppSidebar(props) {
  const { user } = useAuthStore();
  const { selectedProject } = useProjectsStore();

  // Role-based filtering
  const sidebarItems = allSidebarItems.filter((item) => {
    if (!user) return false;

    switch (user.role) {
      case "manager":
        return true; // full access
      case "requirements_engineer":
        return !["project_settings"].includes(item.id);
      case "client":
        return !["project_settings", "requirements"].includes(item.id);
      default:
        return false;
    }
  });

  // Add project slug to all except /dashboard
  const projectScopedSidebarItems = sidebarItems.map((item) => {
    if (["/dashboard"].includes(item.url)) {
      return item;
    }

    if (!selectedProject?.slug) {
      return { ...item, url: item.url, disabled: true };
    }

    return {
      ...item,
      url: `/projects/${selectedProject.slug}${item.url}`,
    };
  });

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border" {...props}>
      <SidebarHeader className="border-b border-sidebar-border">
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        {projectScopedSidebarItems.length > 0 ? (
          <NavMain items={projectScopedSidebarItems} />
        ) : (
          <div className="p-4 text-sm text-muted-foreground">
            No sidebar items available.
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

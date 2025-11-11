"use client";

import {
  LayoutDashboard,
  MessageSquare,
  Bot,
  Video,
  MessageCircle,
  UsersRound,
  Settings,
  Clipboard,
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
} from "@/components/ui/sidebar";

import useAuthStore from "@/store/authStore";
import useProjectsStore from "@/store/projectsStore";

const allSidebarItems = [
  {
    id: "dashboard",
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  { id: "chat", title: "Chat", url: "/chat", icon: MessageSquare },
  { id: "specbot", title: "SpecBot", url: "/specbot", icon: Bot },
  { id: "meetings", title: "Meetings", url: "/meetings", icon: Video },
  { id: "feedback", title: "Feedback", url: "/feedback", icon: MessageCircle },
  {
    id: "requirements",
    title: "Requirements",
    url: "/requirements",
    icon: Clipboard,
  },
  {
    id: "project_settings",
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  { id: "users", title: "Users", url: "/users", icon: UsersRound },
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
        return !["users", "project_settings"].includes(item.id);
      case "client":
        return !["users", "project_settings", "requirements"].includes(item.id);
      default:
        return false;
    }
  });

  // ✅ Add project slug to all except /dashboard & /users
  const projectScopedSidebarItems = sidebarItems.map((item) => {
    if (["/dashboard", "/users"].includes(item.url)) {
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent>
        {projectScopedSidebarItems.length > 0 ? (
          <NavMain items={projectScopedSidebarItems} />
        ) : (
          <div className="p-4 text-sm text-muted-foreground">
            No sidebar items available.
          </div>
        )}
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

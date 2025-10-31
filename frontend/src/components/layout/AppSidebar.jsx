"use client";

import { useEffect } from "react";
import {
  LayoutDashboard,
  MessageSquare,
  Bot,
  Video,
  MessageCircle,
  UsersRound,
  Settings,
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
import useUserStore from "@/store/authStore";
import useProjectsStore from "@/store/projectsStore";

const baseNav = [
  {
    id: "dashboard",
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  }, // global
  { id: "chat", title: "Chat", url: "chat", icon: MessageSquare },
  { id: "specbot", title: "SpecBot", url: "specbot", icon: Bot },
  { id: "meetings", title: "Meetings", url: "meetings", icon: Video },
  { id: "feedback", title: "Feedback", url: "feedback", icon: MessageCircle },
  {
    id: "project_settings",
    title: "Settings",
    url: "settings",
    icon: Settings,
  },
  { id: "users", title: "Users", url: "/users", icon: UsersRound }, // global
];

export function AppSidebar({ ...props }) {
  const { user } = useUserStore();
  const { token } = useAuthStore();
  const { projects = [], fetchProjects } = useProjectsStore();

  // fetch projects once token available
  useEffect(() => {
    if (token) fetchProjects(token);
  }, [token, fetchProjects]);

  // Build dynamic nav combining global + project routes
  let dynamicNav = [];

  // 1️⃣ Add global routes first
  dynamicNav.push(
    ...baseNav.filter((item) => item.id === "dashboard" || item.id === "users")
  );

  // 2️⃣ Add project-scoped routes
  if (projects?.length > 0) {
    projects.forEach((project) => {
      baseNav.forEach((navItem) => {
        const isGlobal = navItem.id === "dashboard" || navItem.id === "users";
        if (isGlobal) return;

        dynamicNav.push({
          id: `${project.slug}-${navItem.id}`,
          title: navItem.title,
          url:
            navItem.url === ""
              ? `/projects/${project.slug}`
              : `/projects/${project.slug}/${navItem.url}`,
          icon: navItem.icon,
        });
      });
    });
  }

  // Role-based filtering
  let filteredNav = [];

  if (user) {
    if (user.role === "manager") {
      filteredNav = dynamicNav;
    } else if (
      user.role === "client" ||
      user.role === "requirements_engineer"
    ) {
      filteredNav = dynamicNav.filter(
        (item) =>
          !item.id.includes("users") && !item.id.includes("project_settings")
      );
    }
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent>
        {filteredNav.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">
            No sidebar items available.
          </div>
        ) : (
          <NavMain items={filteredNav} />
        )}
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

"use client";

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
import useUserStore from "@/store/authStore";

const baseNav = [
  {
    id: "dashboard",
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "chat",
    title: "Chat",
    url: "/chat",
    icon: MessageSquare,
  },
  {
    id: "specbot",
    title: "SpecBot",
    url: "/specbot",
    icon: Bot,
  },
  {
    id: "meetings",
    title: "Meetings",
    url: "/meetings",
    icon: Video,
  },
  {
    id: "feedback",
    title: "Feedback",
    url: "/feedback",
    icon: MessageCircle,
  },
  {
    id: "users",
    title: "Users",
    url: "/users",
    icon: UsersRound,
  },
  {
    id: "project_settings",
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar({ ...props }) {
  const { user } = useUserStore();

  // Role-based filtering
  let filteredNav = [];

  if (user) {
    if (user.role === "manager") {
      filteredNav = baseNav;
    } else if (
      user.role === "client" ||
      user.role === "requirements_engineer"
    ) {
      filteredNav = baseNav.filter(
        (item) => item.id !== "users" && item.id !== "project_settings"
      );
    }
  }
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={filteredNav} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

import {
  LayoutDashboard,
  MessageSquare,
  Bot,
  Video,
  MessageCircle,
  User2Icon,
  Folder,
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

const data = {
  navMain: [
    {
      id: "dashboard",
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [],
    },
    {
      id: "chat",
      title: "Chat",
      url: "/chat",
      icon: MessageSquare,
      isActive: false,
      items: [],
    },
    {
      id: "specbot",
      title: "SpecBot",
      url: "/specbot",
      icon: Bot,
      isActive: false,
      items: [],
    },
    {
      id: "meetings",
      title: "Meetings",
      url: "/meetings",
      icon: Video,
      isActive: false,
      items: [],
    },
    {
      id: "feedback",
      title: "Feedback",
      url: "/feedback",
      icon: MessageCircle,
      isActive: false,
      items: [],
    },
    {
      id: "users",
      title: "Users",
      url: "/users",
      icon: User2Icon,
      isActive: false,
      items: [],
    },
    {
      id: "projects",
      title: "Projects",
      url: "/projects",
      icon: Folder,
      isActive: false,
      items: [],
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

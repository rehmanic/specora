import {
  LayoutDashboard, // ✅ Dashboard
  MessageSquare, // ✅ Chat
  Bot, // ✅ SpecBot
  Video, // ✅ Meetings
  MessageCircle, // ✅ Feedback
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
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [],
    },
    {
      title: "Chat",
      url: "/chat",
      icon: MessageSquare,
      isActive: false,
      items: [],
    },
    {
      title: "SpecBot",
      url: "/specbot",
      icon: Bot,
      isActive: false,
      items: [],
    },
    {
      title: "Meetings",
      url: "/meetings",
      icon: Video,
      isActive: false,
      items: [],
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: MessageCircle,
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

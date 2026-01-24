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
  Scale,
  Gavel,
  DollarSign,
  Cpu,
  PenTool,
  ShieldCheck,
  FileText,
  Workflow,
  File,
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

export function Sidebar({ ...props }) {
  const pathname = usePathname();
  const { selectedProject } = useProjectsStore();

  const slug = selectedProject?.slug;

  const projectNav = [
    {
      title: "Elicitation",
      icon: MessageSquare,
      items: [
        { title: "Chat", url: `/projects/${slug}/chat`, icon: MessageSquare },
        { title: "SpecBot", url: `/projects/${slug}/specbot`, icon: Bot },
        { title: "Meeting", url: `/projects/${slug}/meetings`, icon: CalendarDays },
        { title: "Feedbacks", url: `/projects/${slug}/feedback`, icon: MessageCircleQuestion },
      ]
    },
    {
      title: "Feasibility",
      icon: Scale,
      items: [
        { title: "Legal", url: `/projects/${slug}/feasibility/legal`, icon: Gavel },
        { title: "Economic", url: `/projects/${slug}/feasibility/economic`, icon: DollarSign },
        { title: "Tech", url: `/projects/${slug}/feasibility/tech`, icon: Cpu },
      ]
    },
    {
      title: "Prototyping",
      icon: PenTool,
      url: `/projects/${slug}/prototyping`,
    },
    {
      title: "Verification",
      icon: ShieldCheck,
      url: `/projects/${slug}/verification`,
    },
    {
      title: "Specification",
      icon: FileText,
      items: [
        { title: "Diagrams", url: `/projects/${slug}/specification/diagrams`, icon: Workflow },
        { title: "Docs", url: `/projects/${slug}/specification/docs`, icon: File },
      ]
    },
    {
      title: "Requirements",
      icon: ClipboardList,
      url: `/projects/${slug}/requirements`,
    },
  ];

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

              {/* Project Tools */}
              {selectedProject && projectNav.map((item) => {
                const isCollapsible = !!item.items;
                // Check if current path matches item url or any sub-item url
                const isActive = isCollapsible
                  ? item.items.some(sub => pathname.startsWith(sub.url))
                  : pathname.startsWith(item.url);

                if (isCollapsible) {
                  return (
                    <Collapsible key={item.title} defaultOpen={isActive} className="group/collapsible" asChild>
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={item.title} isActive={isActive}>
                            <item.icon />
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                                  <Link href={subItem.url}>
                                    {subItem.icon && <subItem.icon className="mr-2 h-4 w-4" />}
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                } else {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={pathname.startsWith(item.url)} tooltip={item.title}>
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }
              })}

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
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </ShadcnSidebar>
  );
}

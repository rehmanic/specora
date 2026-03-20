"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  Bot,
  CalendarDays,
  MessageCircleQuestion,
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
  Settings,
  ChevronRight,
} from "lucide-react";
import useProjectsStore from "@/store/projectsStore";
import useAuthStore from "@/store/authStore";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

export function ProjectNavigation() {
  const pathname = usePathname();
  const { selectedProject } = useProjectsStore();
  const { user } = useAuthStore();
  const hasPermission = (perm) => user?.permissions?.includes(perm);

  if (!selectedProject) return null;

  const slug = selectedProject.slug;

  const projectNav = [
    {
      title: "Elicitation",
      icon: MessageSquare,
      items: [
        { title: "Chat", url: `/projects/${slug}/chat`, icon: MessageSquare, requiredPermission: "view_chat" },
        { title: "SpecBot", url: `/projects/${slug}/specbot`, icon: Bot, requiredPermission: "view_specbot_chat" },
        { title: "Meeting", url: `/projects/${slug}/meetings`, icon: CalendarDays, requiredPermission: "view_meetings" },
        { title: "Feedbacks", url: `/projects/${slug}/feedback`, icon: MessageCircleQuestion, requiredPermission: "view_feedbacks" },
      ],
    },
    {
      title: "Feasibility",
      icon: Scale,
      items: [
        { title: "Legal", url: `/projects/${slug}/feasibility/legal`, icon: Gavel, requiredPermission: "view_feasibility_studies" },
        { title: "Economic", url: `/projects/${slug}/feasibility/economic`, icon: DollarSign, requiredPermission: "view_feasibility_studies" },
        { title: "Tech", url: `/projects/${slug}/feasibility/tech`, icon: Cpu, requiredPermission: "view_technical_feasibility" },
      ],
    },
    {
      title: "Prototyping",
      icon: PenTool,
      url: `/projects/${slug}/prototyping`,
      requiredPermission: "view_prototypes",
    },
    {
      title: "Verification",
      icon: ShieldCheck,
      url: `/projects/${slug}/verification`,
      requiredPermission: "view_verification_results",
    },
    {
      title: "Specification",
      icon: FileText,
      items: [
        { title: "Diagrams", url: `/projects/${slug}/specification/diagrams`, icon: Workflow, requiredPermission: "view_diagrams" },
        { title: "Docs", url: `/projects/${slug}/specification/docs`, icon: File, requiredPermission: "view_docs" },
      ],
    },
    {
      title: "Requirements",
      icon: ClipboardList,
      url: `/projects/${slug}/requirements`,
      requiredPermission: "view_requirements",
    },
    {
      title: "Settings",
      icon: Settings,
      url: `/projects/${slug}/settings`,
      requiredPermission: "update_project",
    },
  ];

  return (
    <>
      {projectNav.map((item) => {
        const isCollapsible = !!item.items;

        // For non-collapsible items, check permission directly
        if (!isCollapsible) {
          if (item.requiredPermission && !hasPermission(item.requiredPermission)) return null;

          const isActive = pathname.startsWith(item.url);
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        }

        // For collapsible items, filter sub-items by permission
        const visibleItems = item.items.filter(
          (sub) => !sub.requiredPermission || hasPermission(sub.requiredPermission)
        );

        // Hide the entire group if no sub-items are visible
        if (visibleItems.length === 0) return null;

        const isActive = visibleItems.some((sub) => pathname.startsWith(sub.url));

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
                  {visibleItems.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                        <Link href={subItem.url}>
                          {subItem.icon && <subItem.icon />}
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
      })}
    </>
  );
}

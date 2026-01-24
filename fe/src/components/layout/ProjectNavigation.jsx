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
    ChevronRight
} from "lucide-react";
import useProjectsStore from "@/store/projectsStore";
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

    if (!selectedProject) return null;

    const slug = selectedProject.slug;

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
        <>
            {projectNav.map((item) => {
                const isCollapsible = !!item.items;
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
        </>
    );
}

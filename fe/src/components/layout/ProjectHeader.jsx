"use client";

import useProjectsStore from "@/store/projectsStore";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Folder } from "lucide-react";
import { useEffect, useState } from "react";

export function ProjectHeader() {
  const { selectedProject } = useProjectsStore();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const activeProject = selectedProject;

  const ProjectLogo = ({ project, className }) => {
    if (!project) {
      return (
        <div className={`bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center rounded-lg ${className}`}>
          <Folder className="h-4 w-4" />
        </div>
      );
    }

    // Use project icon if available (or default from DB)
    if (project?.icon_url) {
      return (
        <div className={`flex items-center justify-center shrink-0 overflow-hidden rounded-lg bg-primary/10 p-1 ${className}`}>
          <img
            src={project.icon_url}
            alt={project.name}
            className="w-full h-full object-contain rounded-sm"
          />
        </div>
      );
    }

    const initials = project.name
      ? project.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
      : "P";

    return (
      <div className={`bg-primary/20 text-primary flex items-center justify-center rounded-lg font-semibold text-xs ${className}`}>
        {initials}
      </div>
    );
  };

  if (!mounted) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="h-14" />
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="h-14 hover:bg-transparent cursor-default group"
        >
          <ProjectLogo project={activeProject} className="h-8 w-8" />

          {!isCollapsed && (
            <div className="flex items-center gap-2 w-full overflow-hidden">
              <span className="text-sm font-semibold truncate font-display">
                {activeProject?.name || "Select Project"}
              </span>
            </div>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

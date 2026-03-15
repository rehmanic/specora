"use client";

import useProjectsStore from "@/store/projectsStore";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Folder, ChevronsUpDown, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function ProjectHeader() {
  const { selectedProject, projects, fetchProjects, setSelectedProject } = useProjectsStore();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    if (projects.length === 0) {
      fetchProjects();
    }
  }, [projects.length, fetchProjects]);

  const activeProject = selectedProject;

  const handleProjectSwitch = (project) => {
    setSelectedProject(project);
    // When switching projects, it's best to redirect to the dashboard 
    // to ensure all project-specific states are reloaded correctly
    router.push("/dashboard");
  };

  const ProjectLogo = ({ project, className }) => {
    if (!project) {
      return (
        <div className={`bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center rounded-lg ${className}`}>
          <Folder className="h-4 w-4" />
        </div>
      );
    }

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="h-14 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group"
            >
              <ProjectLogo project={activeProject} className="h-8 w-8" />
              {!isCollapsed && (
                <div className="flex flex-1 items-center justify-between gap-2 overflow-hidden">
                  <div className="flex flex-col items-start gap-0.5 overflow-hidden">
                    <span className="text-sm font-semibold truncate font-display leading-tight">
                      {activeProject?.name || "Select Project"}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate leading-tight capitalize">
                      {activeProject?.status || "No active project"}
                    </span>
                  </div>
                  <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                </div>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl p-2 shadow-xl"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 px-2 py-1.5">
              Available Projects
            </DropdownMenuLabel>
            <div className="space-y-1 max-h-[300px] overflow-y-auto custom-scrollbar">
              {projects.map((project) => (
                <DropdownMenuItem
                  key={project.id}
                  onClick={() => handleProjectSwitch(project)}
                  className={`gap-3 p-2 rounded-lg cursor-pointer transition-all ${activeProject?.id === project.id ? "bg-primary/10 text-primary font-medium" : ""
                    }`}
                >
                  <ProjectLogo project={project} className="h-6 w-6" />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm truncate">{project.name}</span>
                    <span className="text-[10px] opacity-60 truncate capitalize">{project.status}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>

            <DropdownMenuSeparator className="my-2" />

            <DropdownMenuItem
              onClick={() => router.push("/projects/create")}
              className="gap-3 p-2 rounded-lg cursor-pointer text-primary hover:bg-primary/10 transition-colors"
            >
              <div className="size-6 rounded-lg bg-primary/10 flex items-center justify-center">
                <Plus className="size-4" />
              </div>
              <span className="text-sm font-bold">New Project</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

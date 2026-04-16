"use client";

import useProjectsStore from "@/store/projectsStore";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
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
import { usePathname, useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

export function ProjectHeader() {
  const { selectedProject, projects, fetchProjects, setSelectedProject } = useProjectsStore();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();
  const canCreateProject = user?.permissions?.includes("create_project") ?? false;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    if (projects.length === 0) {
      fetchProjects();
    }
  }, [projects.length, fetchProjects]);

  const activeProject = selectedProject;

  const handleProjectSwitch = (project) => {
    const oldSlug = selectedProject?.slug;
    setSelectedProject(project);

    // If we are in a project-specific route (/projects/[slug]/...)
    if (oldSlug && pathname.includes(`/projects/${oldSlug}`)) {
      const segments = pathname.split("/");
      if (segments[1] === "projects" && segments[2] === oldSlug) {
        segments[2] = project.slug;

        // Safety: If deeply nested (e.g. at a specific document or diagram),
        // fall back to the section list page instead of trying to load p1's id in p2
        if (segments.length > 5) {
          segments.splice(5);
        }

        const nextPath = segments.join("/");
        router.push(nextPath);
      }
    } else {
      // If we're on a generic page like /dashboard or /users, just refresh the data
      router.refresh();
    }
  };

  const ProjectLogo = ({ project, className }) => {
    if (!project) {
      return (
        <div
          className={`bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center rounded-lg ${className}`}
        >
          <Folder className="h-4 w-4" />
        </div>
      );
    }

    if (project?.icon_url) {
      return (
        <div
          className={`bg-primary/10 flex shrink-0 items-center justify-center overflow-hidden rounded-lg p-1 ${className}`}
        >
          <img src={project.icon_url} alt={project.name} className="h-full w-full rounded-sm object-contain" />
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
      <div
        className={`bg-primary/20 text-primary flex items-center justify-center rounded-lg text-xs font-semibold ${className}`}
      >
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
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group h-14"
            >
              <ProjectLogo project={activeProject} className="h-8 w-8" />
              {!isCollapsed && (
                <div className="flex flex-1 items-center justify-between gap-2 overflow-hidden">
                  <div className="flex flex-col items-start gap-0.5 overflow-hidden">
                    <span className="font-display truncate text-sm leading-tight font-semibold">
                      {activeProject?.name || "Select Project"}
                    </span>
                    <span className="text-muted-foreground truncate text-[10px] leading-tight capitalize">
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
            <DropdownMenuLabel className="text-muted-foreground/70 px-2 py-1.5 text-xs font-bold tracking-wider uppercase">
              Available Projects
            </DropdownMenuLabel>
            <div className="custom-scrollbar max-h-[300px] space-y-1 overflow-y-auto">
              {projects.map((project) => (
                <DropdownMenuItem
                  key={project.id}
                  onClick={() => handleProjectSwitch(project)}
                  className={`cursor-pointer gap-3 rounded-lg p-2 transition-all ${
                    activeProject?.id === project.id ? "bg-primary/10 text-primary font-medium" : ""
                  }`}
                >
                  <ProjectLogo project={project} className="h-6 w-6" />
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-sm">{project.name}</span>
                    <span className="truncate text-[10px] capitalize opacity-60">{project.status}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>

            {canCreateProject && (
              <>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem
                  onClick={() => router.push("/projects/create")}
                  className="text-primary hover:bg-primary/10 cursor-pointer gap-3 rounded-lg p-2 transition-colors"
                >
                  <div className="bg-primary/10 flex size-6 items-center justify-center rounded-lg">
                    <Plus className="size-4" />
                  </div>
                  <span className="text-sm font-bold">New Project</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

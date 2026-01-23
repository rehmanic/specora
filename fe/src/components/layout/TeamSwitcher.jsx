"use client";

import Logo from "@/components/common/Logo";
import useProjectsStore from "@/store/projectsStore";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChevronDown, FolderOpen } from "lucide-react";

export function TeamSwitcher() {
  const { selectedProject } = useProjectsStore();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="h-14 hover:bg-sidebar-accent transition-colors"
        >
          {isCollapsed ? (
            <Logo showText={false} size="sm" />
          ) : (
            <div className="flex items-center gap-3 w-full">
              <Logo showText={false} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate font-display">
                  {selectedProject?.name || "Specora"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {selectedProject ? "Current Project" : "Select a project"}
                </p>
              </div>
              {selectedProject && (
                <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
            </div>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

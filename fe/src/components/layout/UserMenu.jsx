"use client";

import { LogOut, User, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import useAuthStore from "@/store/authStore";
import useProjectsStore from "@/store/projectsStore";

export function UserMenu() {
  const { user, logout } = useAuthStore();
  const { clearSelectedProject } = useProjectsStore();
  const router = useRouter();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const handleLogout = async () => {
    try {
      clearSelectedProject();
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const roleColors = {
    manager: "bg-primary/15 text-primary",
    requirements_engineer: "bg-accent/15 text-accent",
    client: "bg-success/15 text-success",
  };

  const getRoleLabel = (role) => {
    const labels = {
      manager: "Manager",
      requirements_engineer: "Engineer",
      client: "Client",
    };
    return labels[role] || role;
  };

  if (!user) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="hover:bg-sidebar-accent flex h-14 items-center justify-evenly">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={user.profile_pic_url} alt={user.display_name || user.username} />
              </Avatar>

              {!isCollapsed && (
                <>
                  <p className="mt-1 truncate text-sm font-medium">{user.display_name || user.username}</p>
                  <ChevronUp className="text-muted-foreground h-4 w-4 shrink-0" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent side="top" align="center" className="w-56" sideOffset={8}>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{user.username}</p>
                  <Badge variant="secondary" className={`h-5 px-1.5 text-[10px] ${roleColors[user.role] || ""}`}>
                    {getRoleLabel(user.role)}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs">{user.email}</p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <Link href="/profile">
              <DropdownMenuItem className="focus:text-ring focus:bg-sidebar-accent cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
            </Link>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

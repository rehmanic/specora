"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import useAuthStore from "@/store/authStore";
import { Badge } from "@/components/ui/badge";

export function NavUser() {
  const { user } = useAuthStore();

  // Get user display info with fallbacks
  const displayName = user?.display_name || user?.username || "User";
  const email = user?.email || "";
  const profilePicUrl = user?.profile_pic_url;
  const role = user?.role || "";

  // Get initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  if (!user) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="cursor-pointer h-auto py-3 px-3"
        >
          <Avatar className="h-10 w-10 rounded-lg flex-shrink-0">
            <AvatarImage src={profilePicUrl} alt={displayName} />
            <AvatarFallback className="rounded-lg">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 text-left min-w-0 gap-1">
            <span className="truncate font-semibold text-sm">
              {displayName}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {email || user.username}
            </span>
            
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

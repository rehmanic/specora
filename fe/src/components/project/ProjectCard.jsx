"use client";

import { MoreVertical, Users, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ProjectCard({ project, onClick }) {
  if (!project) return null;

  const {
    name,
    description,
    cover_image_url,
    icon_url,
    status,
    members,
    created_at,
  } = project;

  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Status badge variants
  const statusConfig = {
    active: { label: "Active", className: "bg-success/15 text-success border-success/30" },
    draft: { label: "Draft", className: "bg-muted text-muted-foreground border-border" },
    completed: { label: "Completed", className: "bg-primary/15 text-primary border-primary/30" },
    archived: { label: "Archived", className: "bg-muted text-muted-foreground border-border" },
  };

  const currentStatus = statusConfig[status?.toLowerCase()] || statusConfig.active;

  // Generate a consistent color based on project name
  const getProjectColor = (name) => {
    const colors = [
      "from-violet-500 to-purple-600",
      "from-cyan-500 to-blue-600",
      "from-emerald-500 to-teal-600",
      "from-amber-500 to-orange-600",
      "from-pink-500 to-rose-600",
      "from-indigo-500 to-violet-600",
    ];
    const index = name?.charCodeAt(0) % colors.length || 0;
    return colors[index];
  };

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/10 dark:border-white/5 bg-card/40 backdrop-blur-xl transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 cursor-pointer ring-1 ring-inset ring-white/5 active:scale-[0.98]"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {cover_image_url ? (
          <img
            src={cover_image_url}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className={`h-full w-full bg-gradient-to-br ${getProjectColor(name)} flex items-center justify-center relative overflow-hidden`}>
            {/* Decorative background shape */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] scale-150"></div>
            <span className="text-5xl font-bold text-white/95 relative z-10 drop-shadow-2xl italic tracking-tighter">
              {name?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-20">
          <Badge variant="outline" className={`${currentStatus.className} backdrop-blur-xl border-white/20 shadow-lg px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider`}>
            {currentStatus.label}
          </Badge>
        </div>

        {/* Glossy Overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-4 relative">
        {/* Floating Icon/Initial */}
        <div className="absolute -top-10 left-6 z-10">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${getProjectColor(name)} shadow-xl ring-4 ring-card transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110`}>
            {icon_url ? (
              <img
                src={icon_url}
                alt={`${name} icon`}
                className="h-8 w-8 object-contain"
              />
            ) : (
              <span className="text-white text-xl font-bold">
                {name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="pt-6 space-y-1">
          <h3 className="text-xl font-bold text-card-foreground truncate group-hover:text-primary transition-colors tracking-tight">
            {name}
          </h3>
          {description && (
            <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-4 pt-4 border-t border-white/5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          <div className="flex items-center gap-1.5 group/meta">
            <Calendar className="h-3 w-3 transition-colors group-hover/meta:text-primary" />
            <span>{formatDate(created_at)}</span>
          </div>

          {members?.length > 0 && (
            <div className="flex items-center gap-1.5 group/meta">
              <Users className="h-3 w-3 transition-colors group-hover/meta:text-primary" />
              <span>{members.length} {members.length !== 1 ? 'Collaborators' : 'Collaborator'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Decorative hover sparkle */}
      <div className="absolute bottom-0 right-0 h-24 w-24 bg-primary/10 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    </div>
  );
}

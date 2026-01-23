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
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card card-interactive cursor-pointer"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {cover_image_url ? (
          <img
            src={cover_image_url}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className={`h-full w-full bg-gradient-to-br ${getProjectColor(name)} flex items-center justify-center`}>
            <span className="text-4xl font-bold text-white/90">
              {name?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className={`${currentStatus.className} backdrop-blur-sm`}>
            {currentStatus.label}
          </Badge>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${getProjectColor(name)} shadow-sm`}>
            {icon_url ? (
              <img
                src={icon_url}
                alt={`${name} icon`}
                className="h-6 w-6 object-contain"
              />
            ) : (
              <span className="text-white font-semibold">
                {name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-card-foreground truncate group-hover:text-primary transition-colors">
              {name}
            </h3>
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-4 pt-2 border-t border-border text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(created_at)}</span>
          </div>

          {members?.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span>{members.length} member{members.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
    updated_at,
    start_date,
    end_date,
    tags,
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
    active: { label: "Active", className: "bg-emerald-500 text-white border-emerald-400 shadow-md" },
    draft: { label: "Draft", className: "bg-slate-500 text-white border-slate-400 shadow-sm" },
    completed: { label: "Completed", className: "bg-blue-600 text-white border-blue-500 shadow-sm" },
    archived: { label: "Archived", className: "bg-zinc-600 text-white border-zinc-500 shadow-sm" },
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

  // Tag color generator
  const getTagStyle = (tag) => {
    const styles = [
      "bg-primary/20 text-primary border-primary/30",
      "bg-violet-500/20 text-violet-400 border-violet-500/30",
      "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      "bg-amber-500/20 text-amber-400 border-amber-500/30",
      "bg-rose-500/20 text-rose-400 border-rose-500/30",
      "bg-sky-500/20 text-sky-400 border-sky-500/30",
    ];
    const index = tag?.charCodeAt(0) % styles.length || 0;
    return styles[index];
  };

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 dark:border-white/5 bg-card/60 backdrop-blur-xl transition-all duration-500 hover:shadow-md cursor-pointer active:scale-[0.98] shadow-sm"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {cover_image_url ? (
          <img
            src={cover_image_url}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
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
      <div className="flex-1 p-4 flex flex-col justify-between relative bg-gradient-to-b from-transparent to-card/50">
        <div className="space-y-4">
          {/* Floating Icon/Initial */}
          <div className="absolute -top-8 left-4 z-10">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${getProjectColor(name)} shadow-xl ring-4 ring-card transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105`}>
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
          <div className="pt-4 space-y-1">
            <h3 className="text-lg font-bold text-card-foreground line-clamp-1 group-hover:text-primary transition-colors tracking-tight">
              {name}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed h-8">
              {description || "No description provided."}
            </p>
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.slice(0, 5).map((tag, i) => (
                <span
                  key={i}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md transition-all duration-300 group-hover:scale-110 ${getTagStyle(tag)}`}
                >
                  {tag}
                </span>
              ))}
              {tags.length > 5 && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-muted/50 text-muted-foreground border border-border/50">
                  +{tags.length - 5}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer Meta info */}
        <div className="flex flex-col gap-3 pt-3 mt-3 border-t border-white/10 dark:border-white/5">
          {/* Duration Section */}
          <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3 text-primary/70" />
              <span>{formatDate(start_date)} — {formatDate(end_date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 text-primary/70" />
              <span>{members?.length || 0}</span>
            </div>
          </div>

          {/* timestamps */}
          <div className="flex flex-col gap-0.5 text-[9px] font-medium text-muted-foreground/50 uppercase tracking-tight">
            <div className="flex items-center gap-1">
              <span>Created: {formatDate(created_at)}</span>
            </div>
            {updated_at && (
              <div className="flex items-center gap-1">
                <span>Updated: {formatDate(updated_at)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative hover sparkle */}
      <div className="absolute bottom-0 right-0 h-24 w-24 bg-primary/10 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    </div>
  );
}

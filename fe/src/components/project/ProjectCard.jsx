"use client";

import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ProjectCard({ project, onClick, onDelete }) {
  if (!project) return null;

  const {
    id,
    name,
    slug,
    description,
    cover_image_url,
    icon_url,
    status,
    start_date,
    end_date,
    tags,
    members,
    created_at,
    updated_at,
    created_by,
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

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg cursor-pointer max-w-sm w-full"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <img
          src={
            cover_image_url || `https://picsum.photos/800/600?random=${name}`
          }
          alt={name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex items-center gap-3 p-4">
        {/* Icon */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 overflow-hidden">
          {icon_url ? (
            <img
              src={icon_url}
              alt={`${name} icon`}
              className="h-6 w-6 object-contain"
            />
          ) : (
            "📁"
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-card-foreground text-sm truncate">
            {name}
          </h3>
          {description && (
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {description}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-0.5">
            Created on {formatDate(created_at)}
          </p>
          {status && (
            <p className="text-xs text-muted-foreground capitalize mt-0.5">
              Status: {status}
            </p>
          )}
        </div>

        {/* Options Dropdown */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 cursor-pointer"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(id);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </div>

      {/* Optional footer for tags or members */}
      {(tags?.length > 0 || members?.length > 0) && (
        <div className="px-4 pb-3">
          {tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

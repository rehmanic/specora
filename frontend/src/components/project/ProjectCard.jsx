"use client";

import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ProjectCard({
  icon,
  name,
  createdAt,
  thumbnail,
  onDelete,
  onClick,
}) {
  const formatTimestamp = (date) => {
    const created = new Date(date);
    const options = { year: "numeric", month: "short", day: "numeric" };
    return `Created on ${created.toLocaleDateString("en-US", options)}`;
  };

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg cursor-pointer max-w-sm w-full"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <img
          src={thumbnail || `https://picsum.photos/800/600?random=${name}`}
          alt={name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex items-center gap-3 p-4">
        {/* Icon */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xl">
          {icon || "📁"}
        </div>

        {/* Name + Timestamp */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-card-foreground text-sm truncate">
            {name}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatTimestamp(createdAt)}
          </p>
        </div>

        {/* Options Button */}
        <DropdownMenu>
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
                onDelete?.();
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

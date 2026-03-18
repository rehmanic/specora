"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, GitBranch, Plus, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function RequirementItem({ req, onEdit, onDelete, onAddChild, level = 0, defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "mid":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "low":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "pending":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "draft":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const hasChildren = req.children && req.children.length > 0;

  return (
    <div className="w-full">
      <div
        className={`hover:bg-muted/30 border-border/50 flex flex-col justify-between gap-4 border-b p-4 transition-colors sm:flex-row sm:items-start ${level > 0 ? "border-border/50 ml-6 border-l" : ""}`}
      >
        <div className="flex-1 space-y-2">
          <div className="flex items-start gap-2">
            {hasChildren && (
              <button onClick={() => setExpanded(!expanded)} className="hover:bg-muted mt-1 rounded p-0.5">
                {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            )}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-muted-foreground bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
                  {req.readable_id}
                </span>
                <h3 className="text-base font-semibold">{req.title}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`${getStatusColor(req.status)} px-1.5 py-0 text-[10px]`}>
                    {req.status}
                  </Badge>
                  <Badge variant="outline" className={`${getPriorityColor(req.priority)} px-1.5 py-0 text-[10px]`}>
                    {req.priority}
                  </Badge>
                  {hasChildren && (
                    <Badge variant="secondary" className="bg-muted/50 gap-1 border-0 px-1.5 py-0 text-[10px]">
                      <GitBranch className="h-2.5 w-2.5" /> Sub-reqs
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-muted-foreground mt-1 line-clamp-1 text-sm">{req.description}</p>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary h-8 w-8"
            onClick={() => onAddChild(req)}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(req)} className="gap-2">
                <Edit2 className="h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(req.id)}
                className="text-destructive focus:text-destructive gap-2"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {expanded && hasChildren && (
        <div className="animate-in fade-in slide-in-from-top-1 duration-200">
          {req.children.map((child) => (
            <RequirementItem
              key={child.id}
              req={child}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
              level={level + 1}
              defaultExpanded={defaultExpanded}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default RequirementItem;

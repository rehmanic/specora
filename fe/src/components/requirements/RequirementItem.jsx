"use client";

import React, { useState } from "react";
import { 
  ChevronDown, 
  ChevronRight, 
  GitBranch, 
  Plus, 
  MoreVertical, 
  Edit2, 
  Trash2 
} from "lucide-react";
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
      case "high": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "mid": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "low": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "pending": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "rejected": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "draft": return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const hasChildren = req.children && req.children.length > 0;

  return (
    <div className="w-full">
      <div
        className={`p-4 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row gap-4 sm:items-start justify-between border-b border-border/50 ${level > 0 ? 'ml-6 border-l border-border/50' : ''}`}
      >
        <div className="flex-1 space-y-2">
          <div className="flex items-start gap-2">
            {hasChildren && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-1 hover:bg-muted rounded p-0.5"
              >
                {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  {req.readable_id}
                </span>
                <h3 className="font-semibold text-base">{req.title}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`${getStatusColor(req.status)} text-[10px] px-1.5 py-0`}>
                    {req.status}
                  </Badge>
                  <Badge variant="outline" className={`${getPriorityColor(req.priority)} text-[10px] px-1.5 py-0`}>
                    {req.priority}
                  </Badge>
                  {hasChildren && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-1 bg-muted/50 border-0">
                      <GitBranch className="h-2.5 w-2.5" /> Sub-reqs
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-muted-foreground text-sm mt-1 line-clamp-1">
                {req.description}
              </p>
            </div>
          </div>
        </div>

        <div className="shrink-0 flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => onAddChild(req)}>
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
              <DropdownMenuItem onClick={() => onDelete(req.id)} className="gap-2 text-destructive focus:text-destructive">
                <Trash2 className="h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {expanded && hasChildren && (
        <div className="animate-in fade-in slide-in-from-top-1 duration-200">
          {req.children.map(child => (
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

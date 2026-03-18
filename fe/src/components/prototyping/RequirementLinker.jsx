"use client";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { LinkIcon } from "lucide-react";

export default function RequirementLinker({ requirements, linkedIds, onToggle }) {
  if (!requirements || requirements.length === 0) return null;

  const linkedCount = linkedIds.length;

  return (
    <div>
      <div className="border-border flex items-center justify-between border-b p-3">
        <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Requirements</span>
        <Badge variant="outline" className="h-5 text-[10px]">
          {linkedCount}/{requirements.length}
        </Badge>
      </div>
      <div className="max-h-60 space-y-0.5 overflow-y-auto p-2">
        {requirements.map((req) => {
          const isLinked = linkedIds.includes(req.id);
          return (
            <button
              key={req.id}
              onClick={() => onToggle(req.id)}
              className={`flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors ${
                isLinked ? "bg-primary/10 text-primary" : "hover:bg-muted/50 text-muted-foreground"
              }`}
            >
              <LinkIcon
                className={`mt-0.5 h-3 w-3 shrink-0 ${isLinked ? "text-primary" : "text-muted-foreground/40"}`}
              />
              <span className="line-clamp-2">{req.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

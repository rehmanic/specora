"use client";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { LinkIcon } from "lucide-react";

export default function RequirementLinker({ requirements, linkedIds, onToggle }) {
    if (!requirements || requirements.length === 0) return null;

    const linkedCount = linkedIds.length;

    return (
        <div>
            <div className="p-3 border-b border-border flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                    Requirements
                </span>
                <Badge variant="outline" className="text-[10px] h-5">
                    {linkedCount}/{requirements.length}
                </Badge>
            </div>
            <div className="p-2 space-y-0.5 max-h-60 overflow-y-auto">
                {requirements.map((req) => {
                    const isLinked = linkedIds.includes(req.id);
                    return (
                        <button
                            key={req.id}
                            onClick={() => onToggle(req.id)}
                            className={`w-full flex items-start gap-2 px-2 py-1.5 rounded-md text-left text-xs transition-colors ${isLinked
                                    ? "bg-primary/10 text-primary"
                                    : "hover:bg-muted/50 text-muted-foreground"
                                }`}
                        >
                            <LinkIcon
                                className={`h-3 w-3 mt-0.5 shrink-0 ${isLinked ? "text-primary" : "text-muted-foreground/40"
                                    }`}
                            />
                            <span className="line-clamp-2">{req.title}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

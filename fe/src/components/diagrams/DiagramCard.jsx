"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Workflow, MoreVertical, Trash2 } from "lucide-react";

export default function DiagramCard({ diagram, onOpen, onDelete }) {
    const updatedAt = diagram.updated_at
        ? new Date(diagram.updated_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
        : "—";
    const hasContent = !!diagram.mermaid_code?.trim();

    return (
        <Card
            className="group border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-pointer"
            onClick={() => onOpen(diagram)}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-semibold truncate">
                            {diagram.title || "Untitled diagram"}
                        </CardTitle>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => onDelete(diagram.id)}
                            >
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Workflow className="h-3.5 w-3.5" />
                        <span>{hasContent ? "Has diagram" : "Empty"}</span>
                    </div>
                    <span className="text-xs">Updated {updatedAt}</span>
                </div>
            </CardContent>
        </Card>
    );
}

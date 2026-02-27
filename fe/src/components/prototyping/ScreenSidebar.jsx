"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Monitor, MoreVertical, Trash2, Pencil } from "lucide-react";

export default function ScreenSidebar({
    screens,
    selectedScreenId,
    onSelect,
    onCreate,
    onDelete,
    onRename,
}) {
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");

    const startRename = (screen) => {
        setEditingId(screen.id);
        setEditName(screen.name);
    };

    const commitRename = (screenId) => {
        if (editName.trim()) {
            onRename(screenId, editName.trim());
        }
        setEditingId(null);
    };

    return (
        <div className="w-52 border-r border-border bg-card flex flex-col shrink-0">
            {/* Header */}
            <div className="p-3 border-b border-border flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                    Screens
                </span>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={onCreate}
                    title="Add screen"
                >
                    <Plus className="h-3.5 w-3.5" />
                </Button>
            </div>

            {/* Screen list */}
            <ScrollArea className="flex-1">
                <div className="p-2 space-y-0.5">
                    {screens.length === 0 && (
                        <p className="text-xs text-muted-foreground text-center py-6 px-2">
                            No screens yet. Click + to add one.
                        </p>
                    )}
                    {screens.map((screen, idx) => (
                        <div
                            key={screen.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => onSelect(screen.id)}
                            className={`group flex items-center gap-2 px-2 py-2 rounded-lg text-sm cursor-pointer transition-colors ${selectedScreenId === screen.id
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "hover:bg-muted/50 text-foreground"
                                }`}
                        >
                            <Monitor className="h-3.5 w-3.5 shrink-0 opacity-60" />

                            {editingId === screen.id ? (
                                <Input
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    onBlur={() => commitRename(screen.id)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") commitRename(screen.id);
                                        if (e.key === "Escape") setEditingId(null);
                                    }}
                                    className="h-6 text-xs px-1 py-0"
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()}
                                />
                            ) : (
                                <span className="truncate flex-1 text-xs">{screen.name}</span>
                            )}

                            <DropdownMenu>
                                <DropdownMenuTrigger
                                    asChild
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                    >
                                        <MoreVertical className="h-3 w-3" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <DropdownMenuItem onClick={() => startRename(screen)}>
                                        <Pencil className="h-3.5 w-3.5 mr-2" /> Rename
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="text-destructive focus:text-destructive"
                                        onClick={() => onDelete(screen.id)}
                                    >
                                        <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}

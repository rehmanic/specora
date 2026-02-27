"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2, Copy } from "lucide-react";

export default function ElementProperties({ element, onUpdate, onDelete, onDuplicate }) {
    if (!element) return null;

    return (
        <div className="border-b border-border">
            <div className="p-3 border-b border-border">
                <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                    Properties
                </span>
            </div>
            <div className="p-3 space-y-3">
                {/* Type badge */}
                <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground capitalize">{element.type}</span>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={onDuplicate}
                            title="Duplicate"
                        >
                            <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={onDelete}
                            title="Delete"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>

                <Separator />

                {/* Text */}
                {element.type !== "divider" && element.type !== "toggle" && (
                    <div className="space-y-1">
                        <Label className="text-xs">Text</Label>
                        <Input
                            value={element.text || ""}
                            onChange={(e) => onUpdate({ text: e.target.value })}
                            className="h-7 text-xs"
                        />
                    </div>
                )}

                {/* Position */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <Label className="text-xs">X</Label>
                        <Input
                            type="number"
                            value={Math.round(element.x)}
                            onChange={(e) => onUpdate({ x: Number(e.target.value) })}
                            className="h-7 text-xs"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Y</Label>
                        <Input
                            type="number"
                            value={Math.round(element.y)}
                            onChange={(e) => onUpdate({ y: Number(e.target.value) })}
                            className="h-7 text-xs"
                        />
                    </div>
                </div>

                {/* Size */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <Label className="text-xs">W</Label>
                        <Input
                            type="number"
                            value={Math.round(element.w)}
                            onChange={(e) => onUpdate({ w: Number(e.target.value) })}
                            className="h-7 text-xs"
                            min={10}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">H</Label>
                        <Input
                            type="number"
                            value={Math.round(element.h)}
                            onChange={(e) => onUpdate({ h: Number(e.target.value) })}
                            className="h-7 text-xs"
                            min={2}
                        />
                    </div>
                </div>

                <Separator />

                {/* Font Size */}
                <div className="space-y-1">
                    <Label className="text-xs">Font Size</Label>
                    <Input
                        type="number"
                        value={element.fontSize || 14}
                        onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
                        className="h-7 text-xs"
                        min={8}
                        max={72}
                    />
                </div>

                {/* Colors */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <Label className="text-xs">Background</Label>
                        <div className="flex items-center gap-1.5">
                            <input
                                type="color"
                                value={element.bgColor === "transparent" ? "#ffffff" : element.bgColor || "#ffffff"}
                                onChange={(e) => onUpdate({ bgColor: e.target.value })}
                                className="h-7 w-7 rounded border border-border cursor-pointer p-0.5"
                            />
                            <Input
                                value={element.bgColor || ""}
                                onChange={(e) => onUpdate({ bgColor: e.target.value })}
                                className="h-7 text-xs flex-1"
                                placeholder="#hex"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs">Text Color</Label>
                        <div className="flex items-center gap-1.5">
                            <input
                                type="color"
                                value={element.textColor || "#111827"}
                                onChange={(e) => onUpdate({ textColor: e.target.value })}
                                className="h-7 w-7 rounded border border-border cursor-pointer p-0.5"
                            />
                            <Input
                                value={element.textColor || ""}
                                onChange={(e) => onUpdate({ textColor: e.target.value })}
                                className="h-7 text-xs flex-1"
                                placeholder="#hex"
                            />
                        </div>
                    </div>
                </div>

                {/* Border Radius */}
                <div className="space-y-1">
                    <Label className="text-xs">Border Radius</Label>
                    <Input
                        type="number"
                        value={element.borderRadius ?? 0}
                        onChange={(e) => onUpdate({ borderRadius: Number(e.target.value) })}
                        className="h-7 text-xs"
                        min={0}
                    />
                </div>
            </div>
        </div>
    );
}

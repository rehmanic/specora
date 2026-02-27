"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    RectangleHorizontal,
    Type,
    Heading,
    AlignLeft,
    Image,
    Square,
    PanelTop,
    CreditCard,
    Minus,
    Star,
    CircleUser,
    Tag,
    ToggleRight,
    CheckSquare,
    Circle,
    TextCursor,
    ChevronDown,
    MousePointerClick,
} from "lucide-react";

const ELEMENT_TYPES = [
    { type: "button", label: "Button", icon: MousePointerClick },
    { type: "input", label: "Input", icon: RectangleHorizontal },
    { type: "label", label: "Label", icon: Type },
    { type: "heading", label: "Heading", icon: Heading },
    { type: "paragraph", label: "Paragraph", icon: AlignLeft },
    { type: "image", label: "Image", icon: Image },
    { type: "container", label: "Container", icon: Square },
    { type: "card", label: "Card", icon: CreditCard },
    { type: "navbar", label: "Nav Bar", icon: PanelTop },
    { type: "divider", label: "Divider", icon: Minus },
    { type: "icon", label: "Icon", icon: Star },
    { type: "avatar", label: "Avatar", icon: CircleUser },
    { type: "badge", label: "Badge", icon: Tag },
    { type: "toggle", label: "Toggle", icon: ToggleRight },
    { type: "checkbox", label: "Checkbox", icon: CheckSquare },
    { type: "radio", label: "Radio", icon: Circle },
    { type: "textarea", label: "Textarea", icon: TextCursor },
    { type: "dropdown", label: "Dropdown", icon: ChevronDown },
];

export default function ElementPalette({ onAddElement }) {
    return (
        <div className="border-b border-border bg-card px-3 py-2 flex items-center gap-1 overflow-x-auto shrink-0">
            <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mr-2 shrink-0">
                Elements
            </span>
            <TooltipProvider delayDuration={200}>
                {ELEMENT_TYPES.map(({ type, label, icon: Icon }) => (
                    <Tooltip key={type}>
                        <TooltipTrigger asChild>
                            <button
                                onClick={() => onAddElement(type)}
                                className="flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted/60 active:bg-muted transition-colors shrink-0"
                            >
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="text-xs">
                            {label}
                        </TooltipContent>
                    </Tooltip>
                ))}
            </TooltipProvider>
        </div>
    );
}

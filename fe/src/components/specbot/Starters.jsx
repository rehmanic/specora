"use client";

import { Lightbulb, FileText, Search, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const starters = [
  {
    icon: FileText,
    title: "Draft Requirements",
    description: "Help me create a requirements document",
    prompt: "Help me draft a requirements document for my project",
  },
  {
    icon: Search,
    title: "Analyze Requirements",
    description: "Review and improve existing specs",
    prompt: "Can you analyze these requirements and suggest improvements?",
  },
  {
    icon: Lightbulb,
    title: "Brainstorm Features",
    description: "Generate feature ideas",
    prompt: "Help me brainstorm features for my application",
  },
  {
    icon: Zap,
    title: "Quick Question",
    description: "Ask anything about RE",
    prompt: "I have a question about requirements engineering",
  },
];

export default function Starter({ onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {starters.map((starter, index) => {
        const Icon = starter.icon;
        return (
          <button
            key={index}
            onClick={() => onSelect(starter.prompt)}
            className={cn(
              "flex flex-col items-start gap-2 rounded-xl p-4",
              "bg-card border-border hover:border-primary/50 border",
              "hover-lift text-left transition-all duration-200",
              "group cursor-pointer"
            )}
          >
            <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground rounded-lg p-2 transition-colors">
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-medium">{starter.title}</h4>
              <p className="text-muted-foreground mt-0.5 text-xs">{starter.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

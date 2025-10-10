"use client";
import { ProjectCard } from "@/components/project/ProjectCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  // Dummy data
  const projects = [
    {
      id: 1,
      name: "Project Alpha",
      createdAt: "2025-01-10",
      icon: "🚀",
    },
    {
      id: 2,
      name: "UI Redesign",
      createdAt: "2025-02-14",
      icon: "🎨",
    },
    {
      id: 3,
      name: "Backend Service",
      createdAt: "2025-03-01",
      icon: "⚙️",
    },
    {
      id: 4,
      name: "Mobile App",
      createdAt: "2025-03-20",
      icon: "📱",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-end">
        <Button className="w-[10%] justify-start gap-2 cursor-pointer" size="lg">
          <Plus className="h-5 w-5" />
          <span className="font-medium">New Project</span>
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            name={project.name}
            createdAt={project.createdAt}
            icon={project.icon}
            onClick={() => console.log("Clicked", project.name)}
          />
        ))}
      </div>
    </div>
  );
}

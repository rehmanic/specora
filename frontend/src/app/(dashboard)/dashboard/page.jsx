"use client";
import { ProjectCard } from "@/components/project/ProjectCard";

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

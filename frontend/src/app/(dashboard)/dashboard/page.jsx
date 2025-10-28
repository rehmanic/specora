"use client";
import { useEffect } from "react";
import useProjectsStore from "@/store/projectsStore";
import useAuthStore from "@/store/authStore";
import { ProjectCard } from "@/components/project/ProjectCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { projects, loading, fetchProjects } = useProjectsStore();
  const { token } = useAuthStore();

  useEffect(() => {
    if (token) fetchProjects(token);
  }, [token, fetchProjects]);

  if (loading) return <p className="p-6">Loading projects...</p>;

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-end">
        <Link href="/chat">
          <Button className="w-[150px] h-[40px] flex items-center justify-center cursor-pointer">
            <Plus className="h-5 w-5" />
            <span className="font-medium">New Project</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((project) => (
          <Link href="/specbot" key={project.id}>
            <ProjectCard
              key={project.id}
              name={project.name}
              createdAt={project.created_at}
              icon={project.icon}
              onClick={() => console.log("Clicked", project.name)}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

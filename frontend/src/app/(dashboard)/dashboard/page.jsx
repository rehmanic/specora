"use client";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";
import useProjectsStore from "@/store/projectsStore";
import { ProjectCard } from "@/components/project/ProjectCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getUserProjects } from "@/api/projects";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { setSelectedProject } = useProjectsStore();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      try {
        const data = await getUserProjects(user.userId);
        setProjects(data.projects || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  if (loading)
    return (
      <div className="flex justify-center items-center w-full h-[80vh]">
        <p className="p-6">Loading projects...</p>
      </div>
    );

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-end">
        <Link href="/create">
          <Button className="w-[150px] h-[40px] flex items-center justify-center cursor-pointer">
            <Plus className="h-5 w-5" />
            <span className="font-medium">New Project</span>
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="flex justify-center items-center w-full h-[80vh]">
          <p>No projects found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project) => (
            <Link
              href={`/projects/${project.slug}/chat`}
              key={project.id}
              onClick={() => setSelectedProject(project)}
            >
              <ProjectCard
                project={project}
                onClick={() => setSelectedProject(project)}
                onDelete={() => console.log("Deleted", project.id)}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

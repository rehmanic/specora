"use client";
import { use, useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";
import useProjectsStore from "@/store/projectsStore";
import { ProjectCard } from "@/components/project/ProjectCard";
import { Button } from "@/components/ui/button";
import { Plus, UsersRound, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUserProjects, getAllProjects } from "@/api/projects";

export default function DashboardPage() {
  const { user, token, logout } = useAuthStore();
  const { setSelectedProject, clearSelectedProject } = useProjectsStore();
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    try {
      // Clear projects store state
      clearSelectedProject();
      // Logout and clear auth store + localStorage
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      try {
        let data;

        if (user.role === "manager") {
          // Managers see all projects
          data = await getAllProjects(token);
          setProjects(data?.projects || []);
        } else {
          // Other roles see only their own projects
          data = await getUserProjects(user.id);
          setProjects(data?.projects || []);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]); // Ensure projects is always an array
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user, token]);

  if (loading)
    return (
      <div className="flex justify-center items-center w-full h-[80vh]">
        <p className="p-6">Loading projects...</p>
      </div>
    );

  return (
    <div className="flex flex-col h-full">
      {/* Horizontal Navbar */}
      <nav className="w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="flex items-center justify-end px-6 h-14">
          <div className="flex items-center gap-3">
            {user.role === "manager" && (
              <>
                <Link href="/users">
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 h-9 px-4 hover:bg-gray-100"
                  >
                    <UsersRound className="h-4 w-4" />
                    <span className="font-medium">Users</span>
                  </Button>
                </Link>
                <div className="h-6 w-px bg-border" />
              </>
            )}
            <Button
              variant="ghost"
              className="flex items-center gap-2 h-9 px-4 hover:bg-gray-100 text-destructive hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="font-medium">Logout</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {user.role === "manager" && (
          <div className="mb-6 flex items-center justify-end">
            <Link href="/create">
              <Button className="flex items-center gap-2 h-9 px-4">
                <Plus className="h-4 w-4" />
                <span className="font-medium">New Project</span>
              </Button>
            </Link>
          </div>
        )}

        {projects.length === 0 ? (
          <div className="flex justify-center items-center w-full h-full min-h-[60vh]">
            <p>No projects found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}/chat`}
                onClick={() => setSelectedProject(project)}
              >
                <ProjectCard
                  project={project}
                  onDelete={() => console.log("Deleted", project.id)}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

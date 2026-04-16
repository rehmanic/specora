"use client";
import { useEffect, useState, useMemo } from "react";
import useAuthStore from "@/store/authStore";
import { usePermission } from "@/hooks/usePermission";
import { getUserProjects } from "@/api/projects";
import GreetingHeader from "@/components/dashboard/GreetingHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import SearchCreateHeader from "@/components/common/SearchCreateHeader";
import ProjectList from "@/components/dashboard/ProjectList";

export default function DashboardPage() {
  const { user, token } = useAuthStore();
  const canCreateProject = usePermission("create_project");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;
    
    const fetchProjects = async () => {
      if (!user || !token) return;
      
      try {
        setLoading(true);
        const data = await getUserProjects(user.id);
        
        if (isMounted) {
          setProjects(data?.projects || []);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        if (isMounted) {
          setProjects([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProjects();
    
    return () => {
      isMounted = false;
    };
  }, [user, token]);

  // Filter projects based on search
  const filteredProjects = useMemo(() => {
    return projects.filter(
      (project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);

  return (
    <div className="relative -m-6 min-h-[calc(100vh-4rem)] overflow-hidden p-6">
      {/* Dynamic Background Pattern - Optimized */}
      <div className="bg-primary/5 hero-grid pointer-events-none absolute inset-0 -z-10 opacity-30"></div>
      
      {/* Soft background glow - Lighter than before */}
      <div className="bg-primary/5 absolute -top-24 right-0 -z-10 h-96 w-96 rounded-full blur-[120px]"></div>
      <div className="bg-accent/5 absolute bottom-0 left-0 -z-10 h-96 w-96 rounded-full blur-[120px]"></div>

      <div className="relative z-10 mx-auto w-full max-w-7xl space-y-6">
        {/* 1. Greeting Component */}
        <GreetingHeader user={user} />

        {/* 2. Stats Component - Always rendered to prevent shift */}
        <DashboardStats projects={projects} loading={loading} user={user} />

        <SearchCreateHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchPlaceholder="Search projects by name or description..."
          buttonText="New Project"
          linkTo="/projects/create"
          showButton={canCreateProject}
        />

        {/* 4. Project List Component */}
        <ProjectList projects={filteredProjects} loading={loading} isSearching={searchQuery.length > 0} />
      </div>
    </div>
  );
}


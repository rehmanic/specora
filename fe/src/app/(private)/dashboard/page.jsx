"use client";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";
import { getUserProjects, getAllProjects } from "@/api/projects";
import GreetingHeader from "@/components/dashboard/GreetingHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import SearchCreateHeader from "@/components/common/SearchCreateHeader";
import ProjectList from "@/components/dashboard/ProjectList";

export default function DashboardPage() {
  const { user, token } = useAuthStore();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      try {
        let data;

        if (user.role === "manager") {
          data = await getAllProjects(token);
          setProjects(data?.projects || []);
        } else {
          data = await getUserProjects(user.id);
          setProjects(data?.projects || []);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user, token]);

  // Filter projects based on search
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative -m-6 p-6 min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 bg-primary/5 dark:bg-primary/5 hero-grid opacity-30 pointer-events-none -z-10 transition-opacity"></div>
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-accent opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-10 relative z-10 w-full">
        {/* 1. Greeting Component */}
        <GreetingHeader user={user} />

        {/* 2. Stats Component */}
        {!loading && projects.length > 0 && <DashboardStats projects={projects} />}

        <SearchCreateHeader 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          searchPlaceholder="Search projects by name or description..."
          buttonText="New Project"
          linkTo="/projects/create"
          showButton={user?.role === "manager"}
        />

        {/* 4. Project List Component */}
        <ProjectList 
          projects={filteredProjects} 
          loading={loading} 
          isSearching={searchQuery.length > 0} 
        />
      </div>
    </div>
  );
}

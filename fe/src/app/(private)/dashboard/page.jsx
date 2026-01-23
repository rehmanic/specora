"use client";
import { useEffect, useState } from "react";
import useAuthStore from "@/store/authStore";
import useProjectsStore from "@/store/projectsStore";
import { ProjectCard } from "@/components/project/ProjectCard";
import { Button } from "@/components/ui/button";
import { Plus, FolderOpen, MessageSquare, Video, MessageCircle, Activity } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUserProjects, getAllProjects } from "@/api/projects";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Stats Card Component
function StatsCard({ icon: Icon, label, value, color = "primary" }) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
  };

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover-lift cursor-default card-interactive">
      <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold font-display">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in border border-dashed rounded-xl bg-muted/30">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <FolderOpen className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold font-display mb-1">No projects yet</h3>
      <p className="text-muted-foreground text-center max-w-sm mb-6 text-sm">
        Create your first project to start collaborating with your team and gathering requirements.
      </p>
      <Link href="/create">
        <Button className="gap-2 gradient-primary border-0">
          <Plus className="h-4 w-4" />
          Create Project
        </Button>
      </Link>
    </div>
  );
}

// Loading Skeleton
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-xl border border-border overflow-hidden">
          <div className="aspect-[4/3] skeleton-shimmer" />
          <div className="p-4 space-y-3">
            <div className="h-4 w-3/4 rounded skeleton-shimmer" />
            <div className="h-3 w-1/2 rounded skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { user, token } = useAuthStore();
  const { setSelectedProject } = useProjectsStore();
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

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-2 animate-fade-in">
        <h1 className="text-3xl font-display font-bold">
          {getGreeting()}, {user?.username}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s your project overview and recent activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <StatsCard
          icon={FolderOpen}
          label="Total Projects"
          value={projects.length}
          color="primary"
        />
        <StatsCard
          icon={MessageSquare}
          label="Active Chats"
          value={projects.length > 0 ? Math.floor(projects.length * 2.5) : 0}
          color="accent"
        />
        <StatsCard
          icon={Activity}
          label="Pending Tasks"
          value="12"
          color="warning"
        />
        <StatsCard
          icon={Video}
          label="Upcoming Meetings"
          value={projects.length > 0 ? Math.floor(projects.length * 0.5) : 0}
          color="success"
        />
      </div>

      {/* Projects Section */}
      <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold font-display">Recent Projects</h2>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-[200px] sm:w-[250px] h-9 bg-background/50"
              />
            </div>

            {user?.role === "manager" && (
              <Link href="/create">
                <Button className="gap-2 h-9 gradient-primary border-0 shadow-lg shadow-primary/20">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">New Project</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : filteredProjects.length === 0 && searchQuery ? (
          <div className="py-12 text-center border rounded-xl border-dashed">
            <p className="text-muted-foreground">
              No projects found matching &quot;{searchQuery}&quot;
            </p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project, index) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}/chat`}
                onClick={() => setSelectedProject(project)}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ProjectCard project={project} />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Activity Feed Placeholder - Bottom Section according to requirements */}
      <div className="space-y-4 pt-4 border-t border-border/50">
        <h2 className="text-xl font-semibold font-display">Recent Activity</h2>
        <div className="bg-card border border-border rounded-xl p-6 text-center text-muted-foreground">
          Activity feed coming soon...
        </div>
      </div>
    </div>
  );
}

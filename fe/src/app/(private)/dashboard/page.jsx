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
    primary: "bg-primary/10 text-primary border-primary/20 shadow-primary/5",
    accent: "bg-accent/10 text-accent border-accent/20 shadow-accent/5",
    success: "bg-success/10 text-success border-success/20 shadow-success/5",
    warning: "bg-warning/10 text-warning border-warning/20 shadow-warning/5",
  };

  return (
    <div className="flex items-center gap-4 p-5 rounded-2xl bg-card/60 backdrop-blur-xl border border-white/10 dark:border-white/5 hover-lift cursor-default card-interactive shadow-lg transition-all group">
      <div className={`p-3 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${colorClasses[color]} border shadow-inner`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-3xl font-bold font-display tracking-tight">{value}</p>
        <p className="text-xs font-medium text-muted-foreground/80 uppercase tracking-wider">{label}</p>
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
    <div className="relative -m-6 p-6 min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 hero-grid opacity-40 pointer-events-none -z-10 dark:opacity-20 transition-opacity"></div>
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-accent opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-in">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-primary/20 text-primary border border-primary/20">Dashboard</span>
              <div className="h-1 w-1 rounded-full bg-muted-foreground/30"></div>
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
              {getGreeting()}, <span className="text-primary">{user?.username}</span>! 👋
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-[200px] sm:w-[250px] h-10 bg-card/50 backdrop-blur-md border-white/10 dark:border-white/5 focus:ring-primary/20 transition-all rounded-xl"
              />
            </div>

            {user?.role === "manager" && (
              <Link href="/create">
                <Button className="gap-2 h-10 px-5 gradient-primary border-0 shadow-lg shadow-primary/20 rounded-xl hover:scale-105 transition-transform active:scale-95">
                  <Plus className="h-4 w-4" />
                  <span>New Project</span>
                </Button>
              </Link>
            )}
          </div>
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
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold font-display flex items-center gap-3">
              Recent Projects
            </h2>
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

      </div>
    </div>
  );
}

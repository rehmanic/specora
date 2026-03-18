import { ProjectCard } from "@/components/project/ProjectCard";
import { FolderOpen, Users, Tags, Activity } from "lucide-react";

// Stats Card Component
function StatCard({ icon: Icon, label, value, color = "primary" }) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary border-primary/20 shadow-primary/5",
    accent: "bg-violet-500/10 text-violet-500 border-violet-500/20 shadow-violet-500/5",
    success: "bg-success/10 text-success border-success/20 shadow-success/5",
    warning: "bg-warning/10 text-warning border-warning/20 shadow-warning/5",
  };

  return (
    <div className="bg-card/60 border-border/50 hover-lift card-interactive group flex cursor-default items-center gap-3 rounded-2xl border p-3 shadow-sm backdrop-blur-xl transition-all hover:shadow-md">
      <div
        className={`rounded-xl p-2 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${colorClasses[color]} border shadow-inner`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-display text-2xl font-bold tracking-tight">{value}</p>
        <p className="text-muted-foreground/80 text-[10px] font-medium tracking-wider uppercase">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardStats({ projects }) {
  // Aggregate stats from projects array
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === "active" || !p.status).length;

  // Calculate total unique members across all projects
  const uniqueMembers = new Set();
  projects.forEach((p) => {
    p.members?.forEach((m) => uniqueMembers.add(m.user_id || m.id));
  });
  const totalCollaborators = uniqueMembers.size;

  // Calculate projects started this month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const newProjectsThisMonth = projects.filter((p) => {
    if (!p.created_at) return false;
    const date = new Date(p.created_at);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;

  return (
    <div className="animate-fade-in grid grid-cols-2 gap-6 lg:grid-cols-4" style={{ animationDelay: "0.1s" }}>
      <StatCard icon={FolderOpen} label="Total Projects" value={totalProjects} color="primary" />
      <StatCard icon={Activity} label="Active Projects" value={activeProjects} color="success" />
      <StatCard icon={Users} label="Total Collaborators" value={totalCollaborators} color="accent" />
      <StatCard icon={Tags} label="New This Month" value={newProjectsThisMonth} color="warning" />
    </div>
  );
}

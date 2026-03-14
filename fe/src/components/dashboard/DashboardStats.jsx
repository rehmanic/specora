import { ProjectCard } from "@/components/project/ProjectCard";
import { FolderOpen, Users, Tags, Activity } from "lucide-react";

// Stats Card Component
function StatCard({ icon: Icon, label, value, color = "primary" }) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary border-primary/20 shadow-primary/5",
    accent: "bg-accent/10 text-accent border-accent/20 shadow-accent/5",
    success: "bg-success/10 text-success border-success/20 shadow-success/5",
    warning: "bg-warning/10 text-warning border-warning/20 shadow-warning/5",
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-card/60 backdrop-blur-xl border border-white/10 dark:border-white/5 hover-lift cursor-default card-interactive transition-all group shadow-sm hover:shadow-md">
      <div className={`p-2 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${colorClasses[color]} border shadow-inner`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold font-display tracking-tight">{value}</p>
        <p className="text-[10px] font-medium text-muted-foreground/80 uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardStats({ projects }) {
  // Aggregate stats from projects array
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active' || !p.status).length;

  // Calculate total unique members across all projects
  const uniqueMembers = new Set();
  projects.forEach(p => {
    p.members?.forEach(m => uniqueMembers.add(m.user_id || m.id));
  });
  const totalCollaborators = uniqueMembers.size;

  // Calculate projects started this month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const newProjectsThisMonth = projects.filter(p => {
    if (!p.created_at) return false;
    const date = new Date(p.created_at);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
      <StatCard
        icon={FolderOpen}
        label="Total Projects"
        value={totalProjects}
        color="primary"
      />
      <StatCard
        icon={Activity}
        label="Active Projects"
        value={activeProjects}
        color="success"
      />
      <StatCard
        icon={Users}
        label="Total Collaborators"
        value={totalCollaborators}
        color="accent"
      />
      <StatCard
        icon={Tags}
        label="New This Month"
        value={newProjectsThisMonth}
        color="warning"
      />
    </div>
  );
}

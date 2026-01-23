"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FeedbackTable } from "@/components/feedback/FeedbackTable";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import useUserStore from "@/store/authStore";
import useProjectsStore from "@/store/projectsStore";
import { Plus, MessageCircle, CheckCircle, Clock, AlertCircle } from "lucide-react";

// Stats Card Component
function StatsCard({ icon: Icon, label, value, color = "primary" }) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
  };

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover-lift cursor-default">
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

export default function Page() {
  const { user } = useUserStore();
  const { selectedProject } = useProjectsStore();

  const isClient = user?.role === "client";

  return (
    <ProtectedRoute
      allowedRoles={["manager", "client", "requirements_engineer"]}
    >
      <main className="w-full p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold font-display">Feedback</h1>
              <p className="text-muted-foreground mt-1">
                View and manage feedback items. Create, edit, or delete entries.
              </p>
            </div>

            {/* Show "Create Feedback" button only if NOT client */}
            {!isClient && (
              <Button asChild className="gap-2 gradient-primary border-0">
                <Link
                  href={`/projects/${selectedProject?.slug}/feedback/create`}
                >
                  <Plus className="w-4 h-4" />
                  Create Feedback
                </Link>
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <StatsCard
              icon={MessageCircle}
              label="Total Items"
              value={12}
              color="primary"
            />
            <StatsCard
              icon={CheckCircle}
              label="Resolved"
              value={8}
              color="success"
            />
            <StatsCard
              icon={Clock}
              label="Pending"
              value={3}
              color="warning"
            />
            <StatsCard
              icon={AlertCircle}
              label="Critical"
              value={1}
              color="accent"
            />
          </div>

          {/* Feedback Table */}
          <div className="rounded-xl border border-border bg-card overflow-hidden animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <FeedbackTable isClient={isClient} />
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}

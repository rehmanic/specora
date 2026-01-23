"use client";

import { Clipboard, FileText, CheckCircle, AlertTriangle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

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

// Empty State Component
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <Clipboard className="h-12 w-12 text-primary" />
      </div>
      <h3 className="text-xl font-semibold font-display mb-2">No requirements yet</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Start documenting your project requirements. Use SpecBot to help you draft and analyze requirements.
      </p>
      <Button className="gap-2 gradient-primary border-0">
        <Plus className="h-4 w-4" />
        Add Requirement
      </Button>
    </div>
  );
}

export default function Page() {
  return (
    <ProtectedRoute allowedRoles={["manager", "requirements_engineer"]}>
      <main className="w-full p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold font-display">Requirements</h1>
              <p className="text-muted-foreground mt-1">
                Manage and track project requirements and specifications
              </p>
            </div>
            <Button className="gap-2 gradient-primary border-0">
              <Plus className="h-4 w-4" />
              Add Requirement
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <StatsCard
              icon={FileText}
              label="Total"
              value={0}
              color="primary"
            />
            <StatsCard
              icon={CheckCircle}
              label="Approved"
              value={0}
              color="success"
            />
            <StatsCard
              icon={AlertTriangle}
              label="Pending Review"
              value={0}
              color="warning"
            />
            <StatsCard
              icon={Clipboard}
              label="Drafts"
              value={0}
              color="accent"
            />
          </div>

          {/* Empty State or Requirements List */}
          <div className="rounded-xl border border-border bg-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <EmptyState />
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}

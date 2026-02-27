"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Clipboard, FileText, CheckCircle, AlertTriangle, Plus, Loader2, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

import { getRequirements, createRequirement, updateRequirement, deleteRequirement } from "@/api/requirements";
import RequirementDialog from "./components/RequirementDialog";

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
function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        <Clipboard className="h-12 w-12 text-primary" />
      </div>
      <h3 className="text-xl font-semibold font-display mb-2">No requirements yet</h3>
      <p className="text-muted-foreground text-center max-w-md mb-6">
        Start documenting your project requirements. Use SpecBot to help you draft and analyze requirements.
      </p>
      <Button onClick={onAdd} className="gap-2 gradient-primary border-0">
        <Plus className="h-4 w-4" />
        Add Requirement
      </Button>
    </div>
  );
}

export default function Page() {
  const { projectId } = useParams();
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!projectId) return;

    async function loadRequirements() {
      try {
        const res = await getRequirements(projectId);
        setRequirements(res.requirements || []);
      } catch (error) {
        toast.error("Failed to load requirements");
      } finally {
        setLoading(false);
      }
    }
    loadRequirements();
  }, [projectId]);

  const stats = {
    total: requirements.length,
    approved: requirements.filter(r => r.status === "approved").length,
    pending: requirements.filter(r => r.status === "pending").length,
    drafts: requirements.filter(r => r.status === "draft").length,
  };

  const handleAddClick = () => {
    setSelectedRequirement(null);
    setDialogOpen(true);
  };

  const handleEditClick = (req) => {
    setSelectedRequirement(req);
    setDialogOpen(true);
  };

  const handleDeleteClick = async (reqId) => {
    if (!confirm("Are you sure you want to delete this requirement?")) return;

    setActionLoading(true);
    try {
      await deleteRequirement(projectId, reqId);
      setRequirements(prev => prev.filter(r => r.id !== reqId));
      toast.success("Requirement deleted");
    } catch (error) {
      toast.error(error.message || "Failed to delete requirement");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDialogSubmit = async (data) => {
    setActionLoading(true);
    try {
      if (selectedRequirement) {
        const res = await updateRequirement(projectId, selectedRequirement.id, data);
        setRequirements(prev => prev.map(r => r.id === selectedRequirement.id ? res.requirement : r));
        toast.success("Requirement updated");
      } else {
        const res = await createRequirement(projectId, data);
        setRequirements(prev => [res.requirement, ...prev]);
        toast.success("Requirement created");
      }
      setDialogOpen(false);
    } catch (error) {
      toast.error(error.message || "Operation failed");
    } finally {
      setActionLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "mid": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "low": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "pending": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "rejected": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "draft": return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

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
            <Button onClick={handleAddClick} className="gap-2 gradient-primary border-0">
              <Plus className="h-4 w-4" />
              Add Requirement
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <StatsCard icon={FileText} label="Total" value={stats.total} color="primary" />
            <StatsCard icon={CheckCircle} label="Approved" value={stats.approved} color="success" />
            <StatsCard icon={AlertTriangle} label="Pending Review" value={stats.pending} color="warning" />
            <StatsCard icon={Clipboard} label="Drafts" value={stats.drafts} color="accent" />
          </div>

          {/* List Area */}
          <div className="rounded-xl border border-border bg-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : requirements.length === 0 ? (
              <EmptyState onAdd={handleAddClick} />
            ) : (
              <div className="divide-y divide-border">
                {requirements.map((req) => (
                  <div key={req.id} className="p-4 sm:p-6 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row gap-4 sm:items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between sm:justify-start gap-4">
                        <h3 className="font-semibold text-lg">{req.title}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getStatusColor(req.status)}>
                            {req.status}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(req.priority)}>
                            {req.priority}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {req.description}
                      </p>
                      {req.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {req.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs font-normal">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditClick(req)} className="gap-2">
                            <Edit2 className="h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteClick(req.id)} className="gap-2 text-destructive focus:text-destructive">
                            <Trash2 className="h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dialog */}
        <RequirementDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleDialogSubmit}
          initialData={selectedRequirement}
          loading={actionLoading}
        />
      </main>
    </ProtectedRoute>
  );
}

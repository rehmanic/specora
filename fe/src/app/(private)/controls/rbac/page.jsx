"use client";

import { useState } from "react";
import Link from "next/link";
import { RoleList } from "@/components/rbac/RoleList";
import { RoleDialog } from "@/components/rbac/RoleDialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowLeft, Plus } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function RbacPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const handleCreate = () => {
    setSelectedRole(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (role) => {
    setSelectedRole(role);
    setIsDialogOpen(true);
  };

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <div className="h-full bg-background overflow-auto p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-8 transition-all duration-500 animate-in fade-in">
          {/* Back button */}
          <Link href="/dashboard">
            <Button variant="ghost" className="gap-2 -ml-2 hover:bg-primary/5 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary shadow-sm">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold font-display tracking-tight">RBAC Management</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleCreate}
                className="gap-2 gradient-primary border-0 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                <Plus className="h-4 w-4" />
                Add Role
              </Button>
            </div>
          </div>

          {/* Table Container */}
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            <RoleList onEdit={handleEdit} />
          </div>
        </div>
      </div>

      <RoleDialog
        role={selectedRole}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </ProtectedRoute>
  );
}

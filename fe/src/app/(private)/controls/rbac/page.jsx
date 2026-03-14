"use client";

import { useState } from "react";
import Link from "next/link";
import { RoleList } from "@/components/rbac/RoleList";
import { RoleDialog } from "@/components/rbac/RoleDialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SearchCreateHeader from "@/components/common/SearchCreateHeader";

export default function RbacPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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
          </div>

          <SearchCreateHeader 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchPlaceholder="Search roles..."
            buttonText="Add Role"
            onAction={handleCreate}
          />

          {/* Table Container */}
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            <RoleList onEdit={handleEdit} searchQuery={searchQuery} />
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

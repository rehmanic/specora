"use client";

import { useState } from "react";
import Link from "next/link";
import { RoleList } from "@/components/rbac/RoleList";
import { RoleDialog } from "@/components/rbac/RoleDialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SearchCreateHeader from "@/components/common/SearchCreateHeader";
import PageBanner from "@/components/layout/PageBanner";
import useRbacStore from "@/store/rbacStore";
import StatsCard from "@/components/requirements/StatsCard";
import { useEffect } from "react";
import { Shield, Key } from "lucide-react";

export default function RbacPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { roles, permissions, fetchRoles, fetchPermissions } = useRbacStore();
  const [selectedRole, setSelectedRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, [fetchRoles, fetchPermissions]);

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

          <PageBanner
            title="RBAC Management"
            description="Manage system roles, permissions, and access control policies."
            icon={ShieldCheck}
          />

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <StatsCard
              icon={Shield}
              label="Total Roles"
              value={roles.length}
              color="primary"
            />
            <StatsCard
              icon={Key}
              label="Total Permissions"
              value={permissions.length}
              color="accent"
            />
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

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UsersTable } from "@/components/users/UsersTable";
import { Button } from "@/components/ui/button";
import { UserPlus, ArrowLeft, Users, UserCheck, UserX, Shield } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getAllUsersRequest } from "@/api/users";
import ErrorBox from "@/components/common/ErrorBox";
import Logo from "@/components/common/Logo";

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

// Loading Skeleton
function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-lg border">
          <div className="h-10 w-10 rounded-full skeleton-shimmer" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/4 rounded skeleton-shimmer" />
            <div className="h-3 w-1/3 rounded skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsersRequest();

        const userData = Array.isArray(response)
          ? response
          : response.users || response.data || [];

        const validUsers = userData.filter(
          (user) =>
            user &&
            typeof user === "object" &&
            user.id &&
            user.username &&
            user.email
        );

        setUsers(validUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Calculate role counts
  const roleCounts = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <div className="min-h-screen bg-background">
        {/* Top Navbar */}
        <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
          <div className="flex items-center justify-between px-6 h-16">
            <Logo size="default" />
          </div>
        </nav>

        {/* Main Content */}
        <main className="p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Back button */}
            <Link href="/dashboard">
              <Button variant="ghost" className="gap-2 -ml-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 animate-fade-in">
              <div>
                <h1 className="text-3xl font-bold font-display">User Management</h1>
                <p className="text-muted-foreground mt-1">
                  Manage system users, permissions, and access controls
                </p>
              </div>
              <Link href="/users/create">
                <Button className="gap-2 gradient-primary border-0">
                  <UserPlus className="h-4 w-4" />
                  Create User
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <StatsCard
                icon={Users}
                label="Total Users"
                value={users.length}
                color="primary"
              />
              <StatsCard
                icon={Shield}
                label="Managers"
                value={roleCounts.manager || 0}
                color="accent"
              />
              <StatsCard
                icon={UserCheck}
                label="Engineers"
                value={roleCounts.requirements_engineer || 0}
                color="success"
              />
              <StatsCard
                icon={UserX}
                label="Clients"
                value={roleCounts.client || 0}
                color="warning"
              />
            </div>

            {/* Error Message */}
            {error && <ErrorBox message={`Error loading users: ${error}`} dismissible />}

            {/* Users Table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {loading ? (
                <div className="p-6">
                  <LoadingSkeleton />
                </div>
              ) : (
                <UsersTable users={users} />
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

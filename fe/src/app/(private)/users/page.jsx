"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UsersTable } from "@/components/users/UsersTable";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, Code, Briefcase, Shield } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getAllUsersRequest } from "@/api/users";
import ErrorBox from "@/components/common/ErrorBox";
import Logo from "@/components/common/Logo";
import SearchCreateHeader from "@/components/common/SearchCreateHeader";
import PageBanner from "@/components/layout/PageBanner";
import { StatsCard } from "@/components/requirements/StatsCard";

// Loading Skeleton
function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 rounded-lg border p-4">
          <div className="skeleton-shimmer h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="skeleton-shimmer h-4 w-1/4 rounded" />
            <div className="skeleton-shimmer h-3 w-1/3 rounded" />
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
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsersRequest();

        const userData = Array.isArray(response) ? response : response.users || response.data || [];

        const validUsers = userData.filter(
          (user) => user && typeof user === "object" && user.id && user.username && user.email
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

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute requiredPermissions={["view_users"]}>
      <div className="bg-background min-h-screen">
        {/* Main Content */}
        <main className="p-6 lg:p-8">
          <div className="mx-auto max-w-6xl space-y-8">
            {/* Header */}
            <PageBanner
              title="User Management"
              description="Manage system users, permissions, and access controls"
              icon={Users}
            />

            {/* Stats */}
            <div className="animate-fade-in grid grid-cols-2 gap-4 lg:grid-cols-4" style={{ animationDelay: "0.1s" }}>
              <StatsCard icon={Users} label="Total Users" value={users.length} color="primary" />
              <StatsCard icon={Shield} label="Managers" value={roleCounts.manager || 0} color="accent" />
              <StatsCard icon={Code} label="Engineers" value={roleCounts.requirements_engineer || 0} color="success" />
              <StatsCard icon={Briefcase} label="Clients" value={roleCounts.client || 0} color="warning" />
            </div>

            <SearchCreateHeader
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchPlaceholder="Search users by name or email..."
              buttonText="Create User"
              linkTo="/users/create"
            />

            {/* Error Message */}
            {error && <ErrorBox message={`Error loading users: ${error}`} dismissible />}

            {/* Users Table */}
            <div
              className="border-border bg-card animate-fade-in overflow-hidden rounded-xl border"
              style={{ animationDelay: "0.2s" }}
            >
              {loading ? (
                <div className="p-6">
                  <LoadingSkeleton />
                </div>
              ) : (
                <UsersTable users={filteredUsers} />
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

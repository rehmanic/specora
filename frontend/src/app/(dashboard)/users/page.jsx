"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UsersTable } from "@/components/users/UsersTable";
import { Button } from "@/components/ui/button";
import { UserPlus, ArrowLeft } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getAllUsersRequest } from "@/api/users";
import ErrorBox from "@/components/common/ErrorBox";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsersRequest();
        console.log("Fetched users response:", response);

        // ✅ Fix: backend returns { message, count, users: [...] }
        const userData = Array.isArray(response)
          ? response
          : response.users || response.data || [];

        // Optional: filter out malformed entries
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

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <section className="w-full flex justify-center py-10">
        <div className="w-[85%] max-w-8xl px-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>

          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">User Management</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage system users, permissions, and access controls.
              </p>
            </div>
            <Link href="/users/create">
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Create User
              </Button>
            </Link>
          </div>

          {/* Error Message */}
          {error && <ErrorBox message={`Error loading users: ${error}`} />}

          {/* Loading / Table */}
          {loading ? (
            <div className="text-center py-4">Loading users...</div>
          ) : (
            <UsersTable users={users} />
          )}
        </div>
      </section>
    </ProtectedRoute>
  );
}

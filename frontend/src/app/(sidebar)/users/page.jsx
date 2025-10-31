import Link from "next/link";
import { UsersTable } from "@/components/users/UsersTable";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import ProtectedRoute  from "@/components/auth/ProtectedRoute";

export default function UsersPage() {
  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <section className="w-full flex justify-center py-10">
        <div className="w-full max-w-8xl px-6">
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

          <UsersTable />
        </div>
      </section>
    </ProtectedRoute>
  );
}

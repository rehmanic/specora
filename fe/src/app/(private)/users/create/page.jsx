import Link from "next/link";
import { CreateUserForm } from "@/components/users/CreateUserForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Logo from "@/components/common/Logo";

export default function CreateUserPage() {
  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <div className="min-h-screen bg-background">


        {/* Main Content */}
        <main className="p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Back button */}
            <Link href="/users">
              <Button variant="ghost" className="gap-2 -ml-2 mb-6">
                <ArrowLeft className="h-4 w-4" />
                Back to Users
              </Button>
            </Link>

            {/* Header */}
            <div className="mb-8 animate-fade-in">
              <h1 className="text-3xl font-bold font-display">Create New User</h1>
              <p className="text-muted-foreground mt-1">
                Add a new user to the system and configure their permissions
              </p>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CreateUserForm variant="create-user" />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

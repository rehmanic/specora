import ProjectInfo from "@/components/project/ProjectInfo";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Logo from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateProjectPage() {
  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <div className="min-h-screen bg-background">
        {/* Main Content */}
        <main className="p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Back button */}
            <Link href="/dashboard">
              <Button variant="ghost" className="gap-2 -ml-2 mb-6">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>

            <ProjectInfo variant="create-project" />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

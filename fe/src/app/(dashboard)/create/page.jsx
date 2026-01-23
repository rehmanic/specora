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
        {/* Top Navbar */}
        <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
          <div className="flex items-center justify-between px-6 h-16">
            <Logo size="default" />
          </div>
        </nav>

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

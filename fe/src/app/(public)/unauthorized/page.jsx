import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldX, ArrowLeft, Home } from "lucide-react";
import Logo from "@/components/common/Logo";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      {/* Logo */}
      <div className="mb-8">
        <Logo size="lg" />
      </div>

      {/* Content */}
      <div className="text-center space-y-6 max-w-md animate-fade-in">
        {/* Icon */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-destructive/10 flex items-center justify-center">
          <ShieldX className="h-10 w-10 text-destructive" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-display">Access Denied</h1>
          <p className="text-muted-foreground">
            You don&apos;t have permission to access this page. Please contact your
            administrator if you believe this is an error.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">

          <Button asChild className="gap-2 gradient-primary border-0">
            <Link href="/dashboard">
              <Home className="h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-12 text-sm text-muted-foreground">
        Error Code: 403 - Forbidden
      </p>
    </div>
  );
}

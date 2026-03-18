import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldX, ArrowLeft, Home } from "lucide-react";
import Logo from "@/components/common/Logo";

export default function UnauthorizedPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="mb-8">
        <Logo size="lg" />
      </div>

      {/* Content */}
      <div className="animate-fade-in max-w-md space-y-6 text-center">
        {/* Icon */}
        <div className="bg-destructive/10 mx-auto flex h-20 w-20 items-center justify-center rounded-2xl">
          <ShieldX className="text-destructive h-10 w-10" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">
            You don&apos;t have permission to access this page. Please contact your administrator if you believe this is
            an error.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
          <Button asChild className="gradient-primary gap-2 border-0">
            <Link href="/dashboard">
              <Home className="h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <p className="text-muted-foreground mt-12 text-sm">Error Code: 403 - Forbidden</p>
    </div>
  );
}

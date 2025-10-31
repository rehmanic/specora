"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FeedbackTable } from "@/components/feedback/FeedbackTable";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import useUserStore from "@/store/authStore";

export default function Page() {
  const { user } = useUserStore();

  const isClient = user?.role === "client";
  const isManager = user?.role === "manager";
  const isRequirementsEngineer = user?.role === "requirements_engineer";

  return (
    <ProtectedRoute
      allowedRoles={["manager", "client", "requirements_engineer"]}
    >
      <main className="w-full">
        <section className="container mx-auto px-4 py-8">
          <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-pretty">Feedback</h1>
              <p className="text-muted-foreground mt-1">
                View and manage feedback items. Create, edit, open, or delete
                entries.
              </p>
            </div>

            {/* Show "Create Feedback" button only if NOT client */}
            {!isClient && (
              <Button asChild aria-label="Create new feedback">
                <Link href="/feedback/create" className="flex items-center">
                  <span aria-hidden="true" className="mr-2 font-medium">
                    +
                  </span>
                  Create Feedback
                </Link>
              </Button>
            )}
          </header>

          <div className="rounded-lg border border-border bg-card">
            <FeedbackTable isClient={isClient} />
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}

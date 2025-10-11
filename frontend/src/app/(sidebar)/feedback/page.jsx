"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FeedbackTable } from "@/components/feedback/FeedbackTable";
import Link from "next/link";

export default function Page() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(false), []);

  return (
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

          {/* Create button visible only when isClient === false */}
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
  );
}

import AppShell from "@/components/layout/AppShell.jsx"
import FeedbackTable from "@/components/feedback/FeedbackTable.jsx"
import Link from "next/link"

export default function FeedbackPage() {
  return (
    <AppShell active="Feedback">
      <main className="flex flex-col gap-6 p-6 md:p-8">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-semibold text-balance">Feedback</h1>
        </header>

        {/* Summary only; removed Provide Feedback card */}
        <section className="rounded-lg border border-border bg-card p-4 md:p-6">
          <h2 className="text-lg font-medium mb-2">Feedback Summary</h2>
          <FeedbackTable />
        </section>

        <footer className="pt-2">
          <p className="text-center font-medium">
            Share your feedback with us{" "}
            <Link
              href="/feedback/new"
              className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-ring rounded-sm"
              aria-label="Go to feedback form page"
            >
              @feedback
            </Link>
          </p>
        </footer>
      </main>
    </AppShell>
  )
}

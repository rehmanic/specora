import AppShell from "../../../components/layout/AppShell.jsx"
import FeedbackForm from "../../components/feedback/FeedbackForm.jsx"
import Link from "next/link"

export default function NewFeedbackPage() {
  return (
    <AppShell active="Feedback">
      <main className="flex flex-col gap-6 p-6 md:p-8">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-semibold text-balance">
            Write Feedback
          </h1>
          <Link href="/feedback" className="underline text-sm">
            Back to Summary
          </Link>
        </header>

        <section className="rounded-lg border border-border bg-card p-4 md:p-6">
          <h2 className="text-lg font-medium mb-4">Write Feedback</h2>
          <FeedbackForm redirectTo="/feedback" />
        </section>
      </main>
    </AppShell>
  )
}

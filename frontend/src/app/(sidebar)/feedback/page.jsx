import FeedbackTable from "@/components/feedback/FeedbackTable.jsx";
import Link from "next/link";

export default function FeedbackPage() {
  return (
    <section className="rounded-lg border border-border bg-card p-4 md:p-6">
      <h2 className="text-lg font-medium mb-2">Feedback Summary</h2>
      <FeedbackTable />
    </section>
  );
}

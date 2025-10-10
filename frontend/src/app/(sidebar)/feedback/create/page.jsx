import FeedbackForm from "@/components/feedback/FeedbackForm";

export default function CreateFeedbackPage() {
  return (
    <section className="rounded-lg border border-border bg-card p-4 md:p-6">
      <h2 className="text-lg font-medium mb-4">Write Feedback</h2>
      <FeedbackForm redirectTo="/feedback" />
    </section>
  );
}

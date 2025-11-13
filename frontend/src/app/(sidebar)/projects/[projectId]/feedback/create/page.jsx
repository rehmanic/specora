"use client";

import FormBuilder from "@/components/feedback/FormBuilder";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function CreateFeedbackPage() {
  return (
    <ProtectedRoute
      allowedRoles={["manager", "requirements_engineer"]}
    >
      <section className="border w-full flex justify-center items-center">
        <FormBuilder />
      </section>
    </ProtectedRoute>
  );
}

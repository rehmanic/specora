import ProjectSettings from "@/components/project/ProjectsSettings";
import ProtectedRoute  from "@/components/auth/ProtectedRoute";

export default function ProjectSettingsPage() {
  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <section className="border w-full">
        <ProjectSettings />
      </section>
    </ProtectedRoute>
  );
}

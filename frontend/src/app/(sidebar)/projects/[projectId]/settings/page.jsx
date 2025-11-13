import ProjectInfo from "@/components/project/ProjectInfo";
import ProtectedRoute  from "@/components/auth/ProtectedRoute";

export default function ProjectSettingsPage() {
  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <section className="border w-full">
        <ProjectInfo variant="project-settings" />
      </section>
    </ProtectedRoute>
  );
}

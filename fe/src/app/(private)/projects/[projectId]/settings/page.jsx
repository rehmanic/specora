import ProjectInfo from "@/components/project/ProjectInfo";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function ProjectSettingsPage() {
  return (
    <ProtectedRoute requiredPermissions={["project_settings"]}>
      <ProjectInfo variant="project-settings" />
    </ProtectedRoute>
  );
}

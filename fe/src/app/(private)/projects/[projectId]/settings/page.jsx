import ProjectInfo from "@/components/project/ProjectInfo";
import ProtectedRoute  from "@/components/auth/ProtectedRoute";

export default function ProjectSettingsPage() {
  return (
    <ProtectedRoute>
        <ProjectInfo variant="project-settings" />
    </ProtectedRoute>
  );
}

import ProjectInfo from "@/components/project/ProjectInfo";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function CreateProjectPage() {
  return (
    <ProtectedRoute>
          <ProjectInfo variant="create-project" />
    </ProtectedRoute>
  );
}

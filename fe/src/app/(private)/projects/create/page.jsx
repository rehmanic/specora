import ProjectInfo from "@/components/project/ProjectInfo";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { DefaultPageLayout } from "@/components/layout/DefaultPageLayout";

export default function CreateProjectPage() {
  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <DefaultPageLayout>
        <ProjectInfo variant="create-project" />
      </DefaultPageLayout>
    </ProtectedRoute>
  );
}

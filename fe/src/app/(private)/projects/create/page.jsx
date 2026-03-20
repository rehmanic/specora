import ProjectInfo from "@/components/project/ProjectInfo";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { DefaultPageLayout } from "@/components/layout/DefaultPageLayout";

export default function CreateProjectPage() {
  return (
    <ProtectedRoute requiredPermissions={["create_project"]}>
      <DefaultPageLayout>
        <ProjectInfo variant="create-project" />
      </DefaultPageLayout>
    </ProtectedRoute>
  );
}

import ProjectInfo from "@/components/project/ProjectInfo";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function CreateProjectPage() {
  return (
    <ProtectedRoute allowedRoles={["manager", "client"]}>
      <section className="border w-full">
        <ProjectInfo variant="create-project" />
      </section>
    </ProtectedRoute>
  );
}

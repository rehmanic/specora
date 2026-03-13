import UserInfo from "@/components/users/UserInfo";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function CreateUserPage() {
  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <UserInfo variant="create-user" />
    </ProtectedRoute>
  );
}

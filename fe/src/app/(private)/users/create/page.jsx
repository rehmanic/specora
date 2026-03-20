import UserInfo from "@/components/users/UserInfo";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function CreateUserPage() {
  return (
    <ProtectedRoute requiredPermissions={["add_user"]}>
      <UserInfo variant="create-user" />
    </ProtectedRoute>
  );
}

import UserInfo from "@/components/users/UserInfo";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function CreateUserPage() {
  return (
    <ProtectedRoute>
          <UserInfo variant="create-user" />
    </ProtectedRoute>
  );
}

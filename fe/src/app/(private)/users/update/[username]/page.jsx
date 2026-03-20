import UserInfo from "@/components/users/UserInfo";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default async function UpdateUserPage({ params }) {
  const { username } = await params;

  return (
    <ProtectedRoute requiredPermissions={["update_user"]}>
      <UserInfo variant="update-user" username={username} />
    </ProtectedRoute>
  );
}

import UserInfo from "@/components/users/UserInfo";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default async function UpdateUserPage({ params }) {
  const { username } = await params;

  return (
    <ProtectedRoute allowedRoles={["manager"]}>
      <UserInfo variant="update-user" username={username} />
    </ProtectedRoute>
  );
}

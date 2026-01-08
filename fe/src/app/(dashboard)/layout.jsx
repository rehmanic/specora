import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function DashboardLayout({ children }) {
  return (
    <>
      <ProtectedRoute
        allowedRoles={["manager", "client", "requirements_engineer", "tester"]}
      >
        {children}
      </ProtectedRoute>
    </>
  );
}

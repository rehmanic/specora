export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center p-6">
      <h1 className="text-3xl font-bold text-red-600 mb-2">Access Denied</h1>
      <p className="text-gray-600">
        You do not have permission to view this page.
      </p>
      <a
        href="/login"
        className="mt-4 text-blue-500 underline hover:text-blue-700"
      >
        Go to Login
      </a>
    </div>
  );
}

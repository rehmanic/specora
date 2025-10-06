import  AuthForm  from "@/components/auth/AuthForm";

export default function Login() {
  return (
    <div className="bg-gray-100 flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AuthForm variant="login" />
      </div>
    </div>
  );
}

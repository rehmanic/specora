import Logo from "@/components/common/Logo";
import AuthForm from "@/components/auth/AuthForm";
import Link from "next/link";
import Image from "next/image";

export default function Login() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Panel - Dark with Grid Pattern */}
      <div className="hero-grid relative hidden overflow-hidden bg-[oklch(0.15_0.02_285)] lg:flex lg:w-1/2">
        {/* Floating shapes for depth */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 h-64 w-64 animate-pulse rounded-full bg-[oklch(0.85_0.20_130)]/5 blur-3xl" />
          <div
            className="absolute right-1/4 bottom-1/3 h-96 w-96 animate-pulse rounded-full bg-[oklch(0.85_0.20_130)]/5 blur-3xl"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 right-1/3 h-48 w-48 animate-pulse rounded-full bg-white/5 blur-2xl"
            style={{ animationDelay: "2s" }}
          />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 flex w-full flex-col justify-between p-12 text-white">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center">
              <Link href="/">
                <Image src="/specora-logo.svg" alt="Specora Logo" width={32} height={32} />
              </Link>
            </div>
            <span className="text-lg font-bold tracking-tight">Specora</span>
          </div>

          {/* Tagline */}
          <div className="max-w-md">
            <h1 className="mb-6 text-4xl leading-tight font-bold tracking-tight">
              Collaborate.
              <br />
              Communicate.
              <br />
              <span className="text-[oklch(0.85_0.20_130)]">Create.</span>
            </h1>
            <p className="text-lg leading-relaxed font-light text-slate-300/80">
              Streamline your requirements engineering process with AI-powered features. Connect
              with stakeholders, gather insights, and build better software together.
            </p>
          </div>

          {/* Footer */}
          <div className="text-sm text-slate-500">
            <p>© {new Date().getFullYear()} Specora. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full items-center justify-center bg-white p-6 md:p-10 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex justify-center lg:hidden">
            <Logo size="lg" />
          </div>

          <AuthForm />
        </div>
      </div>
    </div>
  );
}

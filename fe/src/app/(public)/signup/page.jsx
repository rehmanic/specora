import Link from "next/link";
import Logo from "@/components/common/Logo";
import { Layers } from "lucide-react";

export default function Signup() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Panel - Dark with Grid Pattern */}
      <div className="hero-grid relative hidden overflow-hidden bg-[oklch(0.15_0.02_285)] lg:flex lg:w-1/2">
        {/* Floating shapes for depth */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 h-64 w-64 animate-pulse rounded-full bg-[oklch(0.85_0.20_130)]/5 blur-3xl" />
          <div
            className="absolute bottom-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-[oklch(0.85_0.20_130)]/5 blur-3xl"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 left-1/3 h-48 w-48 animate-pulse rounded-full bg-white/5 blur-2xl"
            style={{ animationDelay: "2s" }}
          />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 flex w-full flex-col justify-between p-12 text-white">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[oklch(0.85_0.20_130)] text-[oklch(0.15_0.02_285)]">
              <Layers className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">Specora</span>
          </div>

          {/* Tagline */}
          <div className="max-w-md">
            <h1 className="mb-6 text-4xl leading-tight font-bold tracking-tight">
              Join the future of
              <br />
              <span className="text-[oklch(0.85_0.20_130)]">Requirements Engineering</span>
            </h1>
            <p className="text-lg leading-relaxed font-light text-slate-300/80">
              Create your account and start collaborating with your team. Experience AI-powered tools that make
              gathering and managing requirements easier than ever.
            </p>

            {/* Feature highlights */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[oklch(0.85_0.20_130)]" />
                <span className="text-sm text-slate-300/90">Real-time team collaboration</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[oklch(0.85_0.20_130)]" />
                <span className="text-sm text-slate-300/90">AI-powered requirements analysis</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[oklch(0.85_0.20_130)]" />
                <span className="text-sm text-slate-300/90">Integrated video meetings</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-slate-500">
            <p>© {new Date().getFullYear()} Specora. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="flex w-full items-center justify-center bg-white p-6 md:p-10 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex justify-center lg:hidden">
            <Logo size="lg" />
          </div>

          <div className="animate-fade-in space-y-6 rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
              <Layers className="h-8 w-8 text-amber-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Registration Frozen</h2>
              <p className="mx-auto max-w-[280px] text-sm text-slate-500">
                We&apos;re currently not accepting new sign-ups. Please contact an administrator if you require access.
              </p>
            </div>
            <Link
              href="/login"
              className="bg-primary text-primary-foreground inline-flex h-11 w-full items-center justify-center rounded-full text-sm font-bold transition-all hover:brightness-110"
            >
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

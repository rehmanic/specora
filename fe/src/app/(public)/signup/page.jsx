import Logo from "@/components/common/Logo";
import AuthForm from "@/components/auth/AuthForm";
import { Layers } from "lucide-react";

export default function Signup() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Panel - Dark with Grid Pattern */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[oklch(0.15_0.02_285)] hero-grid">
        {/* Floating shapes for depth */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-[oklch(0.85_0.20_130)]/5 blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-[oklch(0.85_0.20_130)]/5 blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-white/5 blur-2xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[oklch(0.85_0.20_130)] text-[oklch(0.15_0.02_285)] rounded-lg flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">Specora</span>
          </div>

          {/* Tagline */}
          <div className="max-w-md">
            <h1 className="text-4xl font-bold leading-tight mb-6 tracking-tight">
              Join the future of
              <br />
              <span className="text-[oklch(0.85_0.20_130)]">
                Requirements Engineering
              </span>
            </h1>
            <p className="text-lg text-slate-300/80 leading-relaxed font-light">
              Create your account and start collaborating with your team.
              Experience AI-powered tools that make gathering and managing
              requirements easier than ever.
            </p>

            {/* Feature highlights */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[oklch(0.85_0.20_130)]" />
                <span className="text-slate-300/90 text-sm">
                  Real-time team collaboration
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[oklch(0.85_0.20_130)]" />
                <span className="text-slate-300/90 text-sm">
                  AI-powered requirements analysis
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[oklch(0.85_0.20_130)]" />
                <span className="text-slate-300/90 text-sm">
                  Integrated video meetings
                </span>
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
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 md:p-10 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo size="lg" />
          </div>

          <AuthForm variant="signup" />

          {/* Additional info */}
          <p className="mt-8 text-center text-xs text-slate-400">
            By signing up, you agree to our{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-slate-900 transition-colors"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-slate-900 transition-colors"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

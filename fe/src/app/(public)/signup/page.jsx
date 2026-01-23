import Logo from "@/components/common/Logo";
import AuthForm from "@/components/auth/AuthForm";

export default function Signup() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Panel - Gradient Mesh with Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Animated mesh gradient background */}
        <div className="absolute inset-0 mesh-gradient" />

        {/* Floating shapes for depth */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-white/5 blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-white/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-white/5 blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <div>
            <Logo size="lg" className="text-white [&_span]:text-white" />
          </div>

          {/* Tagline */}
          <div className="max-w-md">
            <h1 className="text-4xl font-display font-bold leading-tight mb-6">
              Join the future of
              <br />
              <span className="text-cyan-300">Requirements Engineering</span>
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Create your account and start collaborating with your team.
              Experience AI-powered tools that make gathering and managing
              requirements easier than ever.
            </p>

            {/* Feature highlights */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-white/90">Real-time team collaboration</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-white/90">AI-powered requirements analysis</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-white/90">Integrated video meetings</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-white/60">
            <p>© 2025 Specora. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 md:p-10 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo size="lg" />
          </div>

          <AuthForm variant="signup" />

          {/* Additional info */}
          <p className="mt-8 text-center text-xs text-muted-foreground">
            By signing up, you agree to our{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline underline-offset-4 hover:text-primary transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

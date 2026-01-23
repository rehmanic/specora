import Logo from "@/components/common/Logo";
import AuthForm from "@/components/auth/AuthForm";

export default function Login() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Panel - Gradient Mesh with Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Animated mesh gradient background */}
        <div className="absolute inset-0 mesh-gradient" />

        {/* Floating shapes for depth */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-white/5 blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-white/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 right-1/3 w-48 h-48 rounded-full bg-white/5 blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
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
              Collaborate.
              <br />
              Communicate.
              <br />
              <span className="text-cyan-300">Create.</span>
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Streamline your requirements engineering process with AI-powered
              collaboration tools. Connect stakeholders, gather insights, and
              build better software together.
            </p>
          </div>

          {/* Footer */}
          <div className="text-sm text-white/60">
            <p>© 2025 Specora. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 md:p-10 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo size="lg" />
          </div>

          <AuthForm variant="login" />

          {/* Additional info */}
          <p className="mt-8 text-center text-xs text-muted-foreground">
            By logging in, you agree to our{" "}
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

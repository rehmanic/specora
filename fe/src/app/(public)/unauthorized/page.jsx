"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Home, Lock } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="hero-grid relative flex min-h-screen w-full flex-col overflow-hidden bg-[oklch(0.15_0.02_285)]">
      {/* Floating shapes for depth */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 animate-pulse rounded-full bg-[oklch(0.6_0.24_25)]/8 blur-3xl" />
        <div
          className="absolute right-1/4 bottom-1/3 h-96 w-96 animate-pulse rounded-full bg-[oklch(0.6_0.24_25)]/6 blur-3xl"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 right-1/3 h-48 w-48 animate-pulse rounded-full bg-white/5 blur-2xl"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex flex-1 flex-col justify-between p-8 text-white sm:p-12">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center">
            <Link href="/">
              <Image src="/specora-logo.svg" alt="Specora Logo" width={32} height={32} />
            </Link>
          </div>
          <span className="text-lg font-bold tracking-tight">Specora</span>
        </div>

        {/* Illustration area */}
        <div className="flex flex-col items-center gap-8">
          {/* Animated lock icon */}
          <div className="relative">
            <div className="absolute -inset-8 animate-pulse rounded-full bg-[oklch(0.6_0.24_25)]/10 blur-2xl" />
            <div className="relative flex h-32 w-32 items-center justify-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <Lock className="h-16 w-16 text-[oklch(0.6_0.24_25)]/60" strokeWidth={1.5} />
            </div>
          </div>

          {/* Message */}
          <div className="max-w-sm text-center">
            <h2 className="mb-3 text-3xl leading-tight font-bold tracking-tight">
              Restricted
              <br />
              <span className="text-[oklch(0.6_0.24_25)]">Area</span>
            </h2>
            <p className="text-sm leading-relaxed font-light text-slate-400">
              This section requires special permissions. If you need access, reach out to your project administrator.
            </p>
          </div>

          {/* Action */}
          <Button asChild className="gradient-primary gap-2 border-0 px-6 shadow-sm">
            <Link href="/dashboard">
              <Home className="h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
        </div>

        {/* Footer */}
        <div className="text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Specora. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

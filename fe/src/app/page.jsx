"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Code2,
  Layout,
  MessageSquare,
  Sparkles,
  Zap,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="font-display text-lg font-bold">S</span>
            </div>
            <span className="font-display text-xl font-bold tracking-tight">
              Specora
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="hover:text-primary transition-colors">
              How it works
            </Link>
            <Link href="#pricing" className="hover:text-primary transition-colors">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                Log in
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="shadow-lg shadow-primary/20">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
          {/* Mesh Gradient Background */}
          <div className="absolute inset-0 -z-10 mesh-gradient opacity-30" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <div className="animate-fade-in">
                <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
                  <Sparkles className="mr-2 h-3.5 w-3.5" />
                  AI-Powered Requirements Engineering
                </span>
                <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-accent">
                  Transform Ideas into <br className="hidden sm:block" />
                  Clear Specifications
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-10 leading-relaxed">
                  Specora streamlines your requirements gathering process with AI.
                  Collaborate with stakeholders, generate precise specs, and bridge
                  the gap between vision and development.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/login">
                    <Button size="lg" className="h-12 px-8 text-base shadow-xl shadow-primary/20 hover-lift">
                      Start for Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#demo">
                    <Button variant="outline" size="lg" className="h-12 px-8 text-base hover-lift backdrop-blur-sm bg-background/50">
                      View Demo
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Everything you need to manage requirements
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Powerful tools to help you capture, analyze, and track requirements effortlessly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Bot className="h-8 w-8 text-primary" />}
                title="AI SpecBot"
                description="Your intelligent assistant for refining requirements. Get instant suggestions, clarifications, and completeness checks."
              />
              <FeatureCard
                icon={<MessageSquare className="h-8 w-8 text-accent" />}
                title="Team Chat & Collaboration"
                description="Discuss requirements in real-time. Keep stakeholders aligned with dedicated channels for every project."
              />
              <FeatureCard
                icon={<Layout className="h-8 w-8 text-purple-500" />}
                title="Intuitive Dashboard"
                description="Get a bird's-eye view of all your projects. Track progress, recent activities, and pending approvals at a glance."
              />
              <FeatureCard
                icon={<Code2 className="h-8 w-8 text-green-500" />}
                title="Seamless Export"
                description="Generate developer-ready specifications. Export to industry-standard formats or sync directly with your issue tracker."
              />
              <FeatureCard
                icon={<CheckCircle2 className="h-8 w-8 text-orange-500" />}
                title="Validation & Approval"
                description="Streamline the sign-off process. Ensure every requirement is vetted and approved before development starts."
              />
              <FeatureCard
                icon={<Zap className="h-8 w-8 text-yellow-500" />}
                title="Rapid Iterations"
                description="Adapt to changes quickly. Specora's flexible structure keeps your documentation up-to-date with evolving needs."
              />
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -z-10" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl mb-6">
              Ready to streamline your workflow?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-10 text-lg">
              Join thousands of teams who trust Specora to build better software, faster.
            </p>
            <Link href="/login">
              <Button size="lg" className="h-12 px-8 text-base shadow-xl shadow-primary/25 hover-lift">
                Get Started Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <span className="font-display font-bold">S</span>
                </div>
                <span className="font-display text-lg font-bold">Specora</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Building the future of requirements engineering with AI-driven collaboration.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">Features</Link></li>
                <li><Link href="#" className="hover:text-primary">Integrations</Link></li>
                <li><Link href="#" className="hover:text-primary">Pricing</Link></li>
                <li><Link href="#" className="hover:text-primary">Changelog</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">About</Link></li>
                <li><Link href="#" className="hover:text-primary">Blog</Link></li>
                <li><Link href="#" className="hover:text-primary">Careers</Link></li>
                <li><Link href="#" className="hover:text-primary">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-primary">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-primary">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Specora. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="card-interactive border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-background shadow-sm border border-border">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

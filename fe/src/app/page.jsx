"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code2,
  Layout,
  Layers,
  List,
  MessageSquare,
  MoreHorizontal,
  Quote,
  Settings2,
  Sliders,
  Sparkles,
  User,
  Zap,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-sans bg-white text-slate-600">
      {/* ===== HEADER ===== */}
      <header className="bg-white w-full sticky top-0 z-50 border-b border-slate-100/50 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[oklch(0.15_0.02_285)] text-white rounded-lg flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Specora
            </span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <a
              href="#features"
              className="hover:text-slate-900 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-slate-900 transition-colors"
            >
              How it works
            </a>
            <a
              href="#pricing"
              className="hover:text-slate-900 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="hover:text-slate-900 transition-colors"
            >
              Testimonials
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium hover:text-slate-900 text-slate-500 hidden sm:block"
            >
              Login
            </Link>
            <Link
              href="/login"
              className="bg-[oklch(0.85_0.20_130)] text-[oklch(0.15_0.02_285)] text-xs font-bold px-5 py-3 rounded-full hover:brightness-95 transition-all shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ===== HERO SECTION ===== */}
        <section className="pt-6 pb-20 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            {/* Dark Container with Grid */}
            <div className="bg-[oklch(0.15_0.02_285)] rounded-[2.5rem] pt-20 pb-48 md:pb-72 px-6 text-center relative overflow-hidden hero-grid">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[11px] font-medium text-slate-300 mb-10 backdrop-blur-sm shadow-sm hover:bg-white/10 transition-colors cursor-pointer group">
                <Sparkles className="w-3 h-3 text-[oklch(0.85_0.20_130)]" />
                <span className="opacity-80">AI-Powered Platform</span>
                <span className="text-white flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Learn more{" "}
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-medium text-white tracking-tight leading-[1.1] mb-6 max-w-5xl mx-auto relative z-10">
                Transform Ideas into{" "}
                <br className="hidden md:block" />
                <span className="relative inline-block">
                  Clear Specifications
                  {/* Scribble Underline */}
                  <svg
                    className="absolute w-[110%] -bottom-4 -left-2 text-[oklch(0.85_0.20_130)] opacity-80"
                    viewBox="0 0 200 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 12C30 8 70 5 100 8C130 11 160 15 198 10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              {/* Subtext */}
              <p className="text-lg text-slate-300/80 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
                Specora streamlines your requirements gathering with AI.
                Collaborate with stakeholders, generate precise specs, and
                bridge the gap between vision and development.
              </p>

              {/* Email Input */}
              <div className="max-w-md mx-auto mb-20 relative z-20">
                <div className="bg-white/5 border border-white/10 rounded-full p-1.5 flex items-center backdrop-blur-md shadow-lg group focus-within:ring-2 focus-within:ring-[oklch(0.85_0.20_130)]/20 focus-within:border-[oklch(0.85_0.20_130)]/30 transition-all">
                  <input
                    type="email"
                    placeholder="What's your work email?"
                    className="bg-transparent border-none text-white placeholder-slate-400/70 text-sm w-full pl-5 pr-4 focus:outline-none focus:ring-0 h-10"
                  />
                  <Link
                    href="/login"
                    className="bg-[oklch(0.85_0.20_130)] text-[oklch(0.15_0.02_285)] px-6 py-2.5 rounded-full text-sm font-bold hover:brightness-110 transition-all shadow-glow whitespace-nowrap"
                  >
                    Get started
                  </Link>
                </div>
              </div>

              {/* Dashboard Mockup (Overlapping) */}
              <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-20 md:-bottom-40 w-full max-w-[70rem] px-4 z-10">
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/60 overflow-hidden">
                  <DashboardMockup />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== STATS SECTION ===== */}
        <section className="mt-28 md:mt-48 pb-20 px-6">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-8 md:gap-4 text-center">
            <StatItem value="10K+" label="Specs Generated" />
            <StatItem value="97%" label="AI Accuracy" />
            <StatItem value="500+" label="Active Teams" />
            <StatItem value="1M+" label="Requirements Processed" />
          </div>
        </section>

        {/* ===== FEATURES BENTO GRID ===== */}
        <section id="features" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight mb-4">
                Powerful Features for Better Requirements
              </h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                From AI analysis to team collaboration, streamline every step of
                your requirements engineering process.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              {/* Top Row (3 items) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: SpecBot */}
                <div className="bg-[oklch(0.97_0.01_85)] border border-slate-100 rounded-2xl p-8 hover:shadow-soft transition-shadow">
                  <div className="text-sm font-semibold text-slate-900 mb-2">
                    AI SpecBot
                  </div>
                  <p className="text-xs text-slate-500 mb-8 leading-relaxed">
                    Your intelligent assistant for refining requirements. Get
                    instant suggestions, clarifications, and completeness
                    checks.
                  </p>
                  <div className="flex justify-center">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 w-full max-w-[200px]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="h-2 w-8 bg-slate-200 rounded" />
                        <div className="w-8 h-4 bg-[oklch(0.85_0.20_130)] rounded-full relative">
                          <div className="w-3 h-3 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                          <Zap className="w-3 h-3 text-[oklch(0.15_0.02_285)]" />
                        </div>
                        <div className="h-1.5 w-16 bg-slate-100 rounded" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Collaboration */}
                <div className="bg-[oklch(0.97_0.01_85)] border border-slate-100 rounded-2xl p-8 hover:shadow-soft transition-shadow">
                  <div className="text-sm font-semibold text-slate-900 mb-2">
                    Real-Time Collaboration
                  </div>
                  <p className="text-xs text-slate-500 mb-8 leading-relaxed">
                    Discuss requirements in real-time. Keep stakeholders aligned
                    with dedicated channels for every project.
                  </p>
                  <div className="flex justify-center items-center gap-2">
                    <div className="w-10 h-8 bg-white border border-slate-200 rounded flex items-center justify-center shadow-sm">
                      <User className="w-3 h-3 text-slate-400" />
                    </div>
                    <div className="h-px w-6 bg-slate-300" />
                    <div className="w-10 h-8 bg-[oklch(0.85_0.20_130)] border border-[oklch(0.80_0.18_130)] rounded flex items-center justify-center shadow-sm">
                      <Check className="w-3 h-3 text-[oklch(0.15_0.02_285)]" />
                    </div>
                    <div className="h-px w-6 bg-slate-300" />
                    <div className="w-10 h-8 bg-white border border-slate-200 rounded flex items-center justify-center shadow-sm">
                      <MessageSquare className="w-3 h-3 text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* Card 3: Dashboard */}
                <div className="bg-[oklch(0.97_0.01_85)] border border-slate-100 rounded-2xl p-8 hover:shadow-soft transition-shadow">
                  <div className="text-sm font-semibold text-slate-900 mb-2">
                    Intuitive Dashboard
                  </div>
                  <p className="text-xs text-slate-500 mb-8 leading-relaxed">
                    Get a bird&apos;s-eye view of all your projects. Track
                    progress, activities, and pending approvals at a glance.
                  </p>
                  <div className="flex justify-center gap-3">
                    <div className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center">
                      <Settings2 className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center">
                      <Layout className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-[oklch(0.15_0.02_285)] flex items-center justify-center text-white shadow-lg transform -translate-y-2">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center">
                      <List className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row (2 items) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card 4: Analytics */}
                <div className="bg-[oklch(0.97_0.01_85)] border border-slate-100 rounded-2xl p-8 hover:shadow-soft transition-shadow relative overflow-hidden group">
                  <div className="relative z-10">
                    <div className="text-sm font-semibold text-slate-900 mb-2">
                      Comprehensive Analytics
                    </div>
                    <p className="text-xs text-slate-500 mb-8 max-w-xs leading-relaxed">
                      Track requirement quality metrics and make data-driven
                      decisions with ease.
                    </p>
                  </div>
                  <div className="absolute bottom-0 right-0 w-2/3 h-32 md:h-40 bg-white rounded-tl-2xl border-t border-l border-slate-100 shadow-sm p-4">
                    <div className="flex items-end gap-1 h-full w-full">
                      <div className="bg-emerald-50 w-full h-[30%] rounded-t-sm" />
                      <div className="bg-emerald-100 w-full h-[50%] rounded-t-sm" />
                      <div className="bg-emerald-200 w-full h-[40%] rounded-t-sm" />
                      <div className="bg-emerald-300 w-full h-[70%] rounded-t-sm" />
                      <div className="bg-emerald-400 w-full h-[55%] rounded-t-sm" />
                      <div className="bg-emerald-500 w-full h-[85%] rounded-t-sm" />
                      <div className="bg-[oklch(0.85_0.20_130)] w-full h-[60%] rounded-t-sm" />
                    </div>
                  </div>
                </div>

                {/* Card 5: Integrations */}
                <div className="bg-[oklch(0.97_0.01_85)] border border-slate-100 rounded-2xl p-8 hover:shadow-soft transition-shadow relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="text-sm font-semibold text-slate-900 mb-2">
                      Seamless Export & Integration
                    </div>
                    <p className="text-xs text-slate-500 mb-8 max-w-xs leading-relaxed">
                      Generate developer-ready specs. Export to standard formats
                      or sync with your issue tracker.
                    </p>
                  </div>
                  <div className="absolute bottom-6 right-6 md:right-12">
                    <div className="flex items-center gap-4">
                      <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-md text-[10px] font-medium text-slate-500 shadow-sm">
                        Jira
                      </div>
                      <div className="w-16 h-px bg-slate-300 relative">
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-slate-400 rounded-full" />
                      </div>
                      <div className="bg-[oklch(0.15_0.02_285)] px-3 py-1.5 rounded-md text-[10px] font-medium text-white shadow-md">
                        Specora
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3 ml-8">
                      <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-md text-[10px] font-medium text-slate-500 shadow-sm">
                        GitHub
                      </div>
                      <div className="w-8 h-px bg-slate-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== DARK METRICS STRIP ===== */}
        <section className="bg-[oklch(0.15_0.02_285)] py-12 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
            <div className="border-b md:border-b-0 md:border-r border-white/10 pb-8 md:pb-0 md:pr-8">
              <div className="text-3xl font-semibold tracking-tight mb-2 text-emerald-300">
                95%
              </div>
              <div className="text-sm font-medium mb-3">
                Requirement Accuracy
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                AI-powered analysis catches ambiguities and gaps before they
                become costly errors downstream.
              </p>
              <a
                href="#features"
                className="text-xs text-emerald-300 hover:text-white flex items-center gap-1 transition-colors"
              >
                See how it works{" "}
                <ChevronRight className="w-3 h-3" />
              </a>
            </div>
            <div className="border-b md:border-b-0 md:border-r border-white/10 pb-8 md:pb-0 md:pr-8 md:pl-8">
              <div className="text-3xl font-semibold tracking-tight mb-2 text-emerald-300">
                3x
              </div>
              <div className="text-sm font-medium mb-3">Faster Delivery</div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Teams using Specora deliver specs three times faster than
                traditional manual approaches.
              </p>
              <a
                href="#features"
                className="text-xs text-emerald-300 hover:text-white flex items-center gap-1 transition-colors"
              >
                Learn about speed gains{" "}
                <ChevronRight className="w-3 h-3" />
              </a>
            </div>
            <div className="md:pl-8">
              <div className="text-3xl font-semibold tracking-tight mb-2 text-emerald-300">
                40%
              </div>
              <div className="text-sm font-medium mb-3">Less Rework</div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Clear specifications from the start reduce back-and-forth between
                teams and stakeholders.
              </p>
              <a
                href="#features"
                className="text-xs text-emerald-300 hover:text-white flex items-center gap-1 transition-colors"
              >
                Learn how we reduce rework{" "}
                <ChevronRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </section>

        {/* ===== HOW IT WORKS / PROCESS SECTION ===== */}
        <section id="how-it-works" className="bg-[oklch(0.97_0.01_85)] py-24">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-16 items-center">
            {/* Left Side */}
            <div className="w-full md:w-1/3">
              <h2 className="text-3xl font-semibold text-slate-900 tracking-tight leading-tight mb-6">
                Ready to elevate your requirements process?{" "}
                <br />
                Specora has you covered.
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-8">
                Our AI-powered platform is designed to enhance clarity, improve
                collaboration, and keep your specs on track from concept to
                code.
              </p>

              <div className="w-16 h-16 rounded-full border border-slate-300 flex items-center justify-center relative group cursor-pointer hover:border-slate-900 transition-colors">
                <ArrowUpRight className="w-6 h-6 text-slate-900 group-hover:scale-110 transition-transform" />
                <div
                  className="absolute inset-0 rounded-full border-t-2 border-slate-900 animate-spin opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{ animationDuration: "3s" }}
                />
              </div>
            </div>

            {/* Right Grid */}
            <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ProcessCard
                num="01"
                title="Define Requirements"
                desc="Capture and structure your project needs with AI-guided templates and smart suggestions."
              />
              <ProcessCard
                num="02"
                title="Collaborate in Real-Time"
                desc="Discuss and refine specs with your team using built-in chat and live document editing."
              />
              <ProcessCard
                num="03"
                title="AI Analysis"
                desc="Let SpecBot analyze your requirements for completeness, consistency, and clarity."
              />
              <ProcessCard
                num="04"
                title="Export & Deliver"
                desc="Generate polished SRS documents and export to your favourite developer tools instantly."
              />
            </div>
          </div>
        </section>

        {/* ===== TESTIMONIALS ===== */}
        <section id="testimonials" className="bg-white py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-[oklch(0.15_0.02_285)] rounded-3xl p-12 md:p-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Quote className="w-32 h-32 text-white" />
              </div>

              <div className="relative z-10 max-w-2xl">
                <h4 className="text-emerald-400 font-bold text-sm tracking-widest uppercase mb-8">
                  Testimonials
                </h4>
                <h3 className="text-2xl md:text-3xl font-medium text-white leading-relaxed mb-8">
                  &ldquo;Specora transformed our requirements process. The AI
                  analysis catches issues we used to miss — it&apos;s a
                  game-changer for our team.&rdquo;
                </h3>
                <div>
                  <div className="text-white font-semibold text-sm">
                    SARAH CHEN
                  </div>
                  <div className="text-slate-400 text-xs mt-1">
                    Lead Product Manager, TechCorp
                  </div>
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="absolute bottom-12 right-12 flex gap-4">
                <button className="w-10 h-10 rounded-full border border-slate-600 flex items-center justify-center text-slate-400 hover:text-white hover:border-white transition-all">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full border border-slate-600 flex items-center justify-center text-slate-400 hover:text-white hover:border-white transition-all">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ===== PRICING SECTION ===== */}
        <section id="pricing" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-slate-900 tracking-tight mb-4">
                Choose your plan
              </h2>
              <p className="text-slate-500 mb-8 text-sm">
                14 days unlimited free trial. No contract or credit card
                required.
              </p>

              <div className="inline-flex items-center p-1 bg-slate-100 rounded-full">
                <button className="px-6 py-2 bg-white rounded-full shadow-sm text-sm font-semibold text-slate-900">
                  Monthly
                </button>
                <button className="px-6 py-2 rounded-full text-sm font-medium text-slate-500 hover:text-slate-900">
                  Yearly
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-end">
              {/* Free */}
              <div className="bg-[oklch(0.97_0.01_85)] rounded-2xl p-8 border border-slate-100">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Forever Free
                </div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-semibold text-slate-900 tracking-tight">
                    $0
                  </span>
                </div>
                <Link
                  href="/login"
                  className="block w-full text-center py-2.5 rounded-lg bg-slate-900 text-white font-semibold mb-8 hover:bg-slate-800 text-xs"
                >
                  Create a free account
                </Link>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-emerald-600" /> 1 User
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-emerald-600" /> 3 Projects
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-emerald-600" /> Community
                    Support
                  </li>
                </ul>
              </div>

              {/* Enterprise (Featured) */}
              <div className="bg-[oklch(0.15_0.02_285)] rounded-2xl p-8 shadow-xl text-white transform scale-105 relative z-10">
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                  Enterprise
                </div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-semibold tracking-tight">
                    $29
                  </span>
                  <span className="text-slate-400 text-xs">/mo</span>
                </div>
                <Link
                  href="/login"
                  className="block w-full text-center py-2.5 rounded-lg bg-white text-[oklch(0.15_0.02_285)] font-semibold mb-8 hover:bg-slate-100 transition-colors text-xs"
                >
                  Get started
                </Link>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-emerald-400" /> Unlimited
                    Users
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-emerald-400" /> Unlimited
                    Projects
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-emerald-400" /> Advanced AI
                    Analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-emerald-400" /> Priority
                    Support
                  </li>
                </ul>
              </div>

              {/* Business */}
              <div className="bg-[oklch(0.97_0.01_85)] rounded-2xl p-8 border border-slate-100">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Business Pack
                </div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-semibold text-slate-900 tracking-tight">
                    $12
                  </span>
                  <span className="text-slate-500 text-sm">/mo</span>
                </div>
                <Link
                  href="/login"
                  className="block w-full text-center py-2.5 rounded-lg bg-slate-900 text-white font-semibold mb-8 hover:bg-slate-800 text-xs"
                >
                  Create a free account
                </Link>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-emerald-600" /> 10 Users
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-emerald-600" /> 50 Projects
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-emerald-600" /> Email Support
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ===== FOOTER AREA ===== */}
      <div className="bg-[oklch(0.15_0.02_285)] px-4 pb-4 pt-12 md:mx-4 rounded-t-3xl md:rounded-3xl mt-12 mb-4">
        {/* CTA */}
        <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 mb-16 pb-12 border-b border-white/10">
          <h2 className="text-2xl md:text-3xl font-medium text-white">
            Ready to Transform Your <br /> Requirements Process?
          </h2>
          <div className="flex gap-4 mt-6 md:mt-0">
            <Link
              href="/login"
              className="bg-[oklch(0.85_0.20_130)] text-[oklch(0.15_0.02_285)] px-6 py-2.5 rounded-full text-sm font-semibold hover:brightness-95 transition-all"
            >
              Start your free trial
            </Link>
            <Link
              href="/login"
              className="border border-white/20 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-white/10 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Links */}
        <footer className="text-slate-400 text-sm">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4 text-white">
                <Layers className="w-5 h-5" />
                <span className="text-lg font-semibold tracking-tight">
                  Specora
                </span>
              </div>
              <p className="text-xs leading-relaxed max-w-xs mb-4">
                AI-powered requirements engineering platform. Collaborate,
                communicate, and create better software specifications.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">
                Product
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">
                Company
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">
                Legal
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-[10px] text-slate-500 pb-4">
            <p>
              &copy; {new Date().getFullYear()} Specora. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white">
                Terms
              </a>
              <a href="#" className="hover:text-white">
                Privacy
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* ===== SUB-COMPONENTS ===== */

function StatItem({ value, label }) {
  return (
    <div className="w-full sm:w-auto">
      <div className="text-3xl font-semibold text-slate-900 tracking-tight">
        {value}
      </div>
      <div className="text-sm text-slate-500 font-medium mt-1">{label}</div>
    </div>
  );
}

function ProcessCard({ num, title, desc }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm relative">
      <span className="absolute top-6 right-6 text-xs font-bold text-slate-200">
        {num}
      </span>
      <h3 className="text-sm font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-[11px] text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function DashboardMockup() {
  return (
    <div className="flex h-[450px] md:h-[600px] bg-white">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-56 border-r border-slate-100 p-6 bg-slate-50/50">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">
          Main Menu
        </div>
        <div className="space-y-1 mb-8">
          <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 bg-white shadow-sm border border-slate-100 rounded-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.85_0.20_130)]" />
            Dashboard
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
            Requirements
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
            Specifications
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
            AI Analysis
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
            Team Chat
          </div>
        </div>

        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">
          Tools
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-800">
            <span>SpecBot</span>
          </div>
          <div className="flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-800">
            <span>Doc Export</span>
          </div>
          <div className="flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-800">
            <span>Templates</span>
            <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">
              NEW
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8 bg-slate-50/30 overflow-hidden flex flex-col gap-6">
        {/* Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-1/2">
          {/* Metric 1 */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-5 relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Requirement Quality
              </div>
              <div className="text-3xl font-semibold text-slate-800 tracking-tight">
                92%
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-24">
              <svg
                viewBox="0 0 100 40"
                preserveAspectRatio="none"
                className="w-full h-full text-[oklch(0.85_0.20_130)]/10 fill-current"
              >
                <path d="M0 40 L0 25 Q 20 10 40 28 T 80 20 T 100 30 L 100 40 Z" />
              </svg>
              <svg
                viewBox="0 0 100 40"
                preserveAspectRatio="none"
                className="w-full h-full absolute top-0 left-0 text-[oklch(0.85_0.20_130)]/40 fill-none stroke-current stroke-2"
              >
                <path d="M0 25 Q 20 10 40 28 T 80 20 T 100 30" />
              </svg>
            </div>
          </div>

          {/* Metric 2: Donut */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-5 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Active Projects
                </div>
                <div className="text-3xl font-semibold text-slate-800 tracking-tight">
                  24
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-slate-300" />
            </div>
            <div className="flex-1 flex items-center justify-center gap-6">
              <div
                className="relative w-28 h-28 rounded-full border-[12px] border-slate-100"
                style={{
                  background:
                    "conic-gradient(#3B82F6 0% 30%, #F59E0B 30% 55%, #EF4444 55% 75%, #10B981 75% 100%)",
                  mask: "radial-gradient(transparent 55%, black 56%)",
                  WebkitMask:
                    "radial-gradient(transparent 55%, black 56%)",
                }}
              />
              <div className="space-y-2 text-[10px] font-medium text-slate-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500" /> In
                  Progress
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-500" /> Review
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500" /> Blocked
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />{" "}
                  Complete
                </div>
              </div>
            </div>
          </div>

          {/* Metric 3: Stats */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-4">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Spec Statistics
            </div>
            <div className="flex-1 flex flex-col justify-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-emerald-400 border-t-slate-100 flex items-center justify-center text-xs font-bold text-emerald-600">
                  85%
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">
                    Approved specs
                  </div>
                  <div className="text-sm font-semibold">1,247</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-red-400 border-r-slate-100 flex items-center justify-center text-xs font-bold text-red-600">
                  8%
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">
                    Pending review
                  </div>
                  <div className="text-sm font-semibold">103</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 h-1/2">
          {/* Bottom Chart */}
          <div className="md:col-span-2 bg-white rounded-xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-5 flex flex-col justify-between">
            <div className="flex justify-between">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                AI Analysis
              </div>
              <MoreHorizontal className="w-4 h-4 text-slate-300" />
            </div>
            <div className="text-center my-4">
              <div className="text-xs text-slate-400 mb-1">
                Total Analyzed
              </div>
              <div className="text-3xl font-semibold text-emerald-500 tracking-tight">
                3,847
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-32 h-16 border-[12px] border-t-emerald-400 border-r-emerald-200 border-l-emerald-200 border-b-0 rounded-t-full relative">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-8 bg-slate-300 origin-bottom transform -rotate-45" />
              </div>
            </div>
          </div>

          {/* Bottom List */}
          <div className="md:col-span-3 bg-white rounded-xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-5">
            <div className="flex justify-between mb-4">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Recent Projects
              </div>
              <MoreHorizontal className="w-4 h-4 text-slate-300" />
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-3 bg-violet-500 rounded-sm" /> E-Commerce
                </div>
                <div className="text-right">142 reqs</div>
                <div className="text-right">SRS</div>
                <div className="flex justify-end">
                  <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-blue-500" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-3 bg-emerald-500 rounded-sm" />{" "}
                  Healthcare
                </div>
                <div className="text-right">89 reqs</div>
                <div className="text-right">TUC</div>
                <div className="flex justify-end">
                  <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-blue-500" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-3 bg-amber-500 rounded-sm" /> FinTech
                </div>
                <div className="text-right">216 reqs</div>
                <div className="text-right">SRS</div>
                <div className="flex justify-end">
                  <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-2/3 h-full bg-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

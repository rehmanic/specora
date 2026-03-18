"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Mic,
  Video,
  ClipboardCheck,
  Zap,
  ShieldCheck,
  FileJson,
  GitGraph,
  Sparkles,
  ArrowRight,
  Terminal,
  Search,
  Layout,
  MessageCircle,
  FileText,
  ShieldAlert,
  Coins,
  Scale,
  Network,
  BadgeCheck,
  ScrollText,
  Workflow,
  Wand2,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Specora Feature Theater
 * Strictly constrained to 100vh (100svh) with animated module transitions.
 */
export default function Features() {
  const [activeModule, setActiveModule] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [pillStyle, setPillStyle] = useState({ top: 0, height: 0 });
  const sectionRef = useRef(null);
  const tabRefs = useRef([]);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const modules = useMemo(
    () => [
      {
        id: "elicitation",
        label: "Elicitation",
        eyebrow: "Capture intent",
        tagline: "Chat-to-requirement pipeline with AI",
        accent: "from-amber-400/25 via-emerald-400/15 to-cyan-400/15",
        dot: "bg-amber-400",
        glyph: <MessageCircle className="w-5 h-5" />,
        description:
          "Perfect for Clients and Requirements Engineers to collaborate. Use guided chats and meeting transcripts to extract structured requirements automatically.",
        bullets: [
          { icon: <MessageCircle className="w-4 h-4" />, title: "AI-Guided Elicitation", desc: "Clients can walk through structured chats to define their vision without technical jargon." },
          { icon: <Mic className="w-4 h-4" />, title: "Transcript Extraction", desc: "Engineers can convert stakeholder meeting recordings into actionable requirement drafts." },
          { icon: <Wand2 className="w-4 h-4" />, title: "AI Feature Extraction", desc: "Identify core functionalities from raw text with smart context-aware suggestions." },
        ],
        tiles: [
          { icon: <Layout className="w-4 h-4" />, k: "Stakeholder", v: "Client • Engineer" },
          { icon: <Sparkles className="w-4 h-4" />, k: "Tool", v: "Specbot • Meetings" },
          { icon: <MessageCircle className="w-4 h-4" />, k: "Output", v: "Draft Requirements" },
        ],
      },
      {
        id: "feasibility",
        label: "Feasibility",
        eyebrow: "De-risk early",
        tagline: "Technical, economic, and legal validation",
        accent: "from-emerald-400/25 via-teal-400/15 to-cyan-400/15",
        dot: "bg-emerald-400",
        glyph: <ShieldCheck className="w-5 h-5" />,
        description:
          "Enables Managers and Engineers to assess project viability through simulations, automated legal checks, and technical research.",
        bullets: [
          { icon: <Coins className="w-4 h-4" />, title: "Economic Simulation", desc: "Run Monte Carlo simulations to predict cost and schedule risks before code is written." },
          { icon: <Search className="w-4 h-4" />, title: "Technical Validation", desc: "Deep-dive into tech stacks with AI research agents to find constraints early." },
          { icon: <Scale className="w-4 h-4" />, title: "Norma Legal Engine", desc: "Batch check requirements against legal frameworks for instant compliance feedback." },
        ],
        tiles: [
          { icon: <ShieldCheck className="w-4 h-4" />, k: "Stakeholder", v: "Manager • Engineer" },
          { icon: <Coins className="w-4 h-4" />, k: "Risk", v: "Monte Carlo" },
          { icon: <Scale className="w-4 h-4" />, k: "Compliance", v: "Automated Legal" },
        ],
      },
      {
        id: "prototyping",
        label: "Prototyping",
        eyebrow: "Visualize success",
        tagline: "Link UI screens directly to requirements",
        accent: "from-violet-400/25 via-fuchsia-400/15 to-rose-400/15",
        dot: "bg-violet-400",
        glyph: <Layout className="w-5 h-5" />,
        description:
          "Bridge the gap between Clients and Engineers. Build visual flows that map to specific requirements for crystal clear alignment.",
        bullets: [
          { icon: <Layout className="w-4 h-4" />, title: "Interactive Boards", desc: "Design screen layouts and user flows within the project workspace." },
          { icon: <Network className="w-4 h-4" />, title: "Requirement Mapping", desc: "Tag UI components to specific requirements to ensure 100% implementation coverage." },
          { icon: <Video className="w-4 h-4" />, title: "Stakeholder Demos", desc: "Present interactive flows to Clients for immediate validation and feedback loops." },
        ],
        tiles: [
          { icon: <Layout className="w-4 h-4" />, k: "Stakeholder", v: "Client • Engineer" },
          { icon: <Network className="w-4 h-4" />, k: "Traceability", v: "Component Links" },
          { icon: <Video className="w-4 h-4" />, k: "Validation", v: "Interactive" },
        ],
      },
      {
        id: "verification",
        label: "Verification",
        eyebrow: "Quality gates",
        tagline: "IEEE analysis and ambiguity detection",
        accent: "from-sky-400/20 via-indigo-500/15 to-emerald-400/10",
        dot: "bg-sky-500",
        glyph: <ClipboardCheck className="w-5 h-5" />,
        description:
          "Help Engineers and Managers maintain high standards. Use AI to score requirements against global IEEE benchmarks and ARM metrics.",
        bullets: [
          { icon: <BadgeCheck className="w-4 h-4" />, title: "IEEE AI Analysis", desc: "Check for clarity, completeness, and consistency using fine-tuned models." },
          { icon: <Sparkles className="w-4 h-4" />, title: "Ambiguity Scoring", desc: "Identify weak language and hidden complexity with Specora's ARM engine." },
          { icon: <CheckCircle2 className="w-4 h-4" />, title: "Project Oversight", desc: "Managers can track overall requirement quality through health dashboards." },
        ],
        tiles: [
          { icon: <ClipboardCheck className="w-4 h-4" />, k: "Stakeholder", v: "Engineer • Manager" },
          { icon: <BadgeCheck className="w-4 h-4" />, k: "Benchmark", v: "IEEE 830/29148" },
          { icon: <Zap className="w-4 h-4" />, k: "Engine", v: "ARM Metrics" },
        ],
      },
      {
        id: "specification",
        label: "Specification",
        eyebrow: "The source of truth",
        tagline: "SRS documents, Mermaid diagrams, and Traceability",
        accent: "from-slate-400/15 via-emerald-400/10 to-indigo-500/10",
        dot: "bg-slate-700",
        glyph: <ScrollText className="w-5 h-5" />,
        description:
          "The ultimate workspace for Managers to oversee and export the final project scope. Maintain logic, diagrams, and hierarchy in one place.",
        bullets: [
          { icon: <ScrollText className="w-4 h-4" />, title: "SRS Generation", desc: "Automatically compile requirements into professional, industry-standard documents." },
          { icon: <GitGraph className="w-4 h-4" />, title: "Mermaid Integration", desc: "Generate and edit system diagrams with AI to visualize complex logic." },
          { icon: <Layers className="w-4 h-4" />, title: "Traceability Matrix", desc: "Full parent-child hierarchy and relationship graph for total scope control." },
        ],
        tiles: [
          { icon: <ScrollText className="w-4 h-4" />, k: "Stakeholder", v: "Manager • Engineer" },
          { icon: <GitGraph className="w-4 h-4" />, k: "Diagrams", v: "AI Mermaid" },
          { icon: <Layers className="w-4 h-4" />, k: "Trace", v: "Full Matrix" },
        ],
      },
    ],
    []
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Dynamic Pill Positioning
  React.useLayoutEffect(() => {
    const updatePill = () => {
      const activeTab = tabRefs.current[activeModule];
      if (activeTab) {
        setPillStyle({
          top: activeTab.offsetTop,
          height: activeTab.offsetHeight,
        });
      }
    };

    updatePill();

    // Re-measure on window resize
    window.addEventListener("resize", updatePill);

    // Also watch for internal layout changes if possible
    const observer = new ResizeObserver(updatePill);
    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      window.removeEventListener("resize", updatePill);
      observer.disconnect();
    };
  }, [activeModule, modules.length]);

  useEffect(() => {
    if (prefersReducedMotion || isPaused) return;
    const delayMs = 1700;
    const t = window.setInterval(() => {
      setActiveModule((v) => (v + 1) % modules.length);
    }, delayMs);
    return () => window.clearInterval(t);
  }, [isPaused, modules.length, prefersReducedMotion]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      setActiveModule((v) => (v + 1) % modules.length);
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      setActiveModule((v) => (v - 1 + modules.length) % modules.length);
    }
  };

  return (
    <section
      id="features"
      ref={sectionRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      className={cn(
        "bg-white relative overflow-hidden",
        "py-24",
        "outline-none"
      )}
      aria-label="Specora platform features"
    >
      {/* Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none hero-grid" />
      <div className="absolute -top-24 -left-24 w-[520px] h-[520px] bg-gradient-to-br from-[oklch(0.85_0.20_130)]/25 via-sky-400/10 to-transparent blur-[90px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-28 -right-24 w-[620px] h-[620px] bg-gradient-to-tr from-violet-400/15 via-emerald-400/10 to-transparent blur-[110px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative z-10">
        <div className="flex flex-col gap-12 pt-24 pb-10">
          {/* Heading */}
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[oklch(0.85_0.20_130)]/10 text-[oklch(0.55_0.15_130)] text-[10px] font-bold uppercase tracking-widest">
                <Sparkles className="w-3 h-3" />
                Feature Theater
              </div>
              <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-semibold text-slate-900 tracking-tight leading-[1.05]">
                One platform.
                <span className="text-[oklch(0.55_0.15_130)]"> Five modules.</span>
              </h2>
              <p className="mt-3 text-sm md:text-base text-slate-500 max-w-2xl font-light leading-relaxed">
                Experience the complete requirements lifecycle with purpose-built modules for every stakeholder.
              </p>
            </div>

            <div className="hidden lg:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-400/70" />
              Live transitions
            </div>
          </div>

          {/* Theater */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 min-h-0">
            {/* Rail */}
            <div className="relative bg-slate-50/60 rounded-[2.5rem] border border-slate-200/60 p-4 sm:p-5 min-h-0 overflow-hidden">
              <div className="absolute inset-0 pointer-events-none opacity-[0.7]">
                <div className="absolute -top-20 -right-24 w-72 h-72 bg-gradient-to-br from-[oklch(0.85_0.20_130)]/25 to-transparent blur-[70px] rounded-full" />
              </div>

              <div className="relative flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                  Modules
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {String(activeModule + 1).padStart(2, "0")}/{String(modules.length).padStart(2, "0")}
                </span>
              </div>

              <div className="relative space-y-2 pr-1">
                {/* Sliding Highlight */}
                <div
                  className={cn(
                    "absolute left-0 right-1 bg-slate-900 rounded-[1.8rem] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-[0_24px_60px_-24px_rgba(15,23,42,0.45)] pointer-events-none",
                    pillStyle.height === 0 ? "opacity-0" : "opacity-100"
                  )}
                  style={{
                    height: `${pillStyle.height}px`,
                    top: `${pillStyle.top}px`,
                  }}
                />

                {modules.map((mod, idx) => {
                  const isActive = activeModule === idx;
                  return (
                    <button
                      key={mod.id}
                      ref={(el) => (tabRefs.current[idx] = el)}
                      onClick={() => setActiveModule(idx)}
                      className={cn(
                        "w-full text-left rounded-[1.8rem] px-4 py-4 transition-colors duration-500 border group",
                        "flex items-center gap-4 relative z-10",
                        isActive
                          ? "border-transparent text-white"
                          : "bg-white/40 border-slate-200/70 text-slate-600 hover:bg-white hover:border-slate-200"
                      )}
                      aria-pressed={isActive}
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-2xl border flex items-center justify-center transition-all duration-500",
                          isActive ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200/70"
                        )}
                      >
                        <div
                          className={cn(
                            "transition-colors duration-500",
                            isActive ? "text-white" : "text-slate-800"
                          )}
                        >
                          {mod.glyph}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div
                              className={cn(
                                "text-[10px] uppercase tracking-[0.2em] font-black",
                                isActive ? "text-emerald-300/90" : "text-slate-400"
                              )}
                            >
                              {mod.eyebrow}
                            </div>
                            <div className="mt-1 font-semibold tracking-tight text-base truncate">
                              {mod.label}
                            </div>
                          </div>
                          <ArrowRight
                            className={cn(
                              "w-4 h-4 shrink-0 transition-all duration-500",
                              isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
                            )}
                          />
                        </div>
                        <div className={cn("mt-1 text-xs leading-snug", isActive ? "text-slate-300/80" : "text-slate-500")}>
                          {mod.tagline}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="relative mt-6 rounded-2xl border border-slate-200/70 bg-white/50 px-4 py-3 text-xs text-slate-500">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Lifecycle Loop</span>
                  <span className={cn("text-[10px] font-black uppercase tracking-widest", isPaused ? "text-slate-400" : "text-emerald-600")}>
                    {prefersReducedMotion ? "OFF" : isPaused ? "PAUSED" : "ACTIVE"}
                  </span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-slate-200/70 overflow-hidden">
                  <div
                    key={`${activeModule}-${isPaused}`}
                    className={cn(
                      "h-full w-full origin-left",
                      prefersReducedMotion || isPaused ? "scale-x-0" : "scale-x-100",
                      "bg-gradient-to-r from-[oklch(0.55_0.15_130)] to-emerald-400",
                      prefersReducedMotion ? "" : "transition-transform duration-[1700ms] ease-linear"
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Stage */}
            <div className="relative bg-slate-50/50 rounded-[2.5rem] border border-slate-200/60 overflow-hidden min-h-0">
              <div className={cn("absolute inset-0 pointer-events-none bg-gradient-to-br", modules[activeModule].accent)} />
              <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(60%_60%_at_60%_10%,black,transparent)]">
                <div className="absolute -top-28 right-10 w-[520px] h-[520px] rounded-full bg-white/20 blur-[90px]" />
              </div>

              <div
                key={activeModule}
                className={cn(
                  "relative h-full p-6 sm:p-8 lg:p-10",
                  prefersReducedMotion ? "" : "animate-in fade-in slide-in-from-right-6 duration-700"
                )}
              >
                <div className="h-full grid grid-rows-[auto_auto_1fr] gap-6 min-h-0">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className={cn("w-2.5 h-2.5 rounded-full", modules[activeModule].dot)} />
                        <span className="text-[10px] uppercase tracking-[0.25em] font-black text-slate-600">
                          {modules[activeModule].label}
                        </span>
                      </div>
                      <h3 className="mt-3 text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight leading-snug max-w-2xl">
                        {modules[activeModule].tagline}
                      </h3>
                      <p className="mt-3 text-sm md:text-base text-slate-600 font-light leading-relaxed max-w-2xl">
                        {modules[activeModule].description}
                      </p>
                    </div>

                    <div className="hidden md:flex flex-col items-end gap-2 shrink-0">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                        Module {activeModule + 1}
                      </div>
                      <div className="flex gap-1.5">
                        {modules.map((m, i) => (
                          <button
                            key={m.id}
                            onClick={() => setActiveModule(i)}
                            className={cn(
                              "h-2.5 w-10 rounded-full transition-all duration-500",
                              i === activeModule ? "bg-slate-900" : "bg-slate-300/70 hover:bg-slate-400/80"
                            )}
                            aria-label={`Go to ${m.label}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Mini tiles */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {modules[activeModule].tiles.map((t, i) => (
                      <div
                        key={i}
                        className={cn(
                          "rounded-[1.6rem] border border-white/30 bg-white/70 backdrop-blur-sm px-4 py-4",
                          "shadow-[0_18px_50px_-34px_rgba(0,0,0,0.35)]"
                        )}
                      >
                        <div className="flex items-center gap-2 text-slate-700">
                          <span className="w-9 h-9 rounded-2xl bg-slate-900/5 border border-slate-900/10 flex items-center justify-center">
                            {t.icon}
                          </span>
                          <div className="min-w-0">
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                              {t.k}
                            </div>
                            <div className="text-sm font-semibold tracking-tight text-slate-900 truncate">
                              {t.v}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bullet cards */}
                  <div className="min-h-0 pb-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        {modules[activeModule].bullets.map((b, i) => (
                          <div
                            key={i}
                            className={cn(
                              "group rounded-[2rem] border border-white/30 bg-white/70 backdrop-blur-sm p-5 sm:p-6",
                              "transition-all duration-500 hover:bg-white/85 hover:shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)]"
                            )}
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-sm transition-transform duration-500 group-hover:scale-[1.06]">
                                {b.icon}
                              </div>
                              <div className="flex-1">
                                <h4 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900">
                                  {b.title}
                                </h4>
                                <p className="mt-2 text-sm text-slate-600 font-light leading-relaxed">
                                  {b.desc}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-600">
                        <span className="opacity-70">Tip: Click tabs or press arrow keys</span>
                        <div className="flex items-center gap-4">
                           <span className="text-slate-400">1s Loop</span>
                           <button
                             type="button"
                             onClick={() => setActiveModule((v) => (v + 1) % modules.length)}
                             className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-slate-900 text-white hover:brightness-110 transition-all"
                           >
                             Next <ArrowRight className="w-3.5 h-3.5" />
                           </button>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom hint */}
          <div className="flex items-center justify-between text-[10px] text-slate-500">
            <span className="font-light">
              Designed for <span className="font-medium text-slate-700">Premium Precision</span>
            </span>
            <span className="hidden sm:inline font-light">Hover to pause exploration</span>
          </div>
        </div>
      </div>
    </section>
  );
}

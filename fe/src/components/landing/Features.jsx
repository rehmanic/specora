"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Video, ClipboardCheck, ShieldCheck, GitGraph, Sparkles, Search,
  Layout, MessageCircle, FileText, CircleDollarSign, Scale, Network,
  BadgeCheck, ScrollText, Users, Layers, MessageCircleWarning, ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const modules = [
  {
    id: "elicitation",
    label: "Elicitation",
    tagline: "Gather & Extract Requirements",
    accent: "from-amber-400/25 via-emerald-400/15 to-cyan-400/15",
    dot: "bg-amber-400",
    glyph: <MessageCircle className="h-5 w-5" />,
    description:
      "Use AI features to elicit and extract requirements quickly.",
    bullets: [
      {
        icon: <MessageCircle className="h-4 w-4" />,
        title: "Specbot",
        desc: "An AI chatbot that can talk with clients and understand their needs.",
      },
      {
        icon: <Video className="h-4 w-4" />,
        title: "Meetings",
        desc: "Record, transcribe and extract requirements from meetings with stakehoders.",
      },
      {
        icon: <FileText className="h-4 w-4" />,
        title: "Feedbacks",
        desc: "Gather and organize feedback from multiple stakeholders to clarify requirements and ensure everyone is on the same page.",
      },
      {
        icon: <Users className="h-4 w-4" />,
        title: "Group chat",
        desc: "A group chat for all stakeholders for general discussions.",
      },
    ],
  },
  {
    id: "feasibility",
    label: "Feasibility",
    tagline: "Technical, Economic, and Legal Feasibility",
    accent: "from-emerald-400/25 via-teal-400/15 to-cyan-400/15",
    dot: "bg-emerald-400",
    glyph: <ShieldCheck className="h-5 w-5" />,
    description:
      "Check project feasibility through simulations, automated legal checks, and technical research, before moving forward.",
    bullets: [
      {
        icon: <CircleDollarSign className="h-4 w-4" />,
        title: "Economic Simulation",
        desc: "Run Monte Carlo simulations to predict cost and schedule risks before code is written.",
      },
      {
        icon: <Scale className="h-4 w-4" />,
        title: "Legal Engine",
        desc: "Check requirements against legal frameworks for instant compliance feedback.",
      },
      {
        icon: <Search className="h-4 w-4" />,
        title: "Technical Validation",
        desc: "Deep-dive into tech stacks with AI research agents to find constraints early.",
      },
    ],
  },
  {
    id: "prototyping",
    label: "Prototyping",
    tagline: "Visualize and Validate",
    accent: "from-violet-400/25 via-fuchsia-400/15 to-rose-400/15",
    dot: "bg-violet-400",
    glyph: <Layout className="h-5 w-5" />,
    description:
      "Build visual flows that map to specific requirements for crystal clear alignment.",
    bullets: [
      {
        icon: <Layout className="h-4 w-4" />,
        title: "Interactive Boards",
        desc: "Design screen layouts and user flows within the project workspace.",
      },
      {
        icon: <Network className="h-4 w-4" />,
        title: "Requirement Mapping",
        desc: "Tag screens to specific requirements for traceability.",
      },
    ],
  },
  {
    id: "verification",
    label: "Verification",
    tagline: "IEEE Analysis and Ambiguity Detection",
    accent: "from-sky-400/20 via-indigo-500/15 to-emerald-400/10",
    dot: "bg-sky-500",
    glyph: <ClipboardCheck className="h-5 w-5" />,
    description:
      "Use AI to score requirements against global IEEE benchmarks and ARM metrics.",
    bullets: [
      {
        icon: <BadgeCheck className="h-4 w-4" />,
        title: "IEEE AI Analysis",
        desc: "Check requirements against IEEE requirements standards instantly, using AI.",
      },
      {
        icon: <MessageCircleWarning className="h-4 w-4" />,
        title: "Ambiguity Scoring",
        desc: "Identify weak language and hidden complexity with Specora's ARM engine.",
      },
    ],
  },
  {
    id: "specification",
    label: "Specification",
    tagline: "Diagram & Document",
    accent: "from-slate-400/15 via-emerald-400/10 to-indigo-500/10",
    dot: "bg-slate-700",
    glyph: <ScrollText className="h-5 w-5" />,
    description:
      "Generate project documents and diagrams with AI.",
    bullets: [
      {
        icon: <ScrollText className="h-4 w-4" />,
        title: "Documentation",
        desc: "Automatically compile requirements into professional, industry-standard documents such as SRS, Textual Use Case, etc.",
      },
      {
        icon: <GitGraph className="h-4 w-4" />,
        title: "Diagrams",
        desc: "Generate and edit system diagrams with AI to visualize complex logic.",
      }
    ],
  },
];

export default function Features() {
  const [activeModule, setActiveModule] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [pillStyle, setPillStyle] = useState({ top: 0, height: 0 });
  const sectionRef = useRef(null);
  const tabRefs = useRef([]);

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;

  // Dynamic pill positioning
  useLayoutEffect(() => {
    const updatePill = () => {
      const el = tabRefs.current[activeModule];
      if (el) setPillStyle({ top: el.offsetTop, height: el.offsetHeight });
    };
    updatePill();
    window.addEventListener("resize", updatePill);
    const observer = new ResizeObserver(updatePill);
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      window.removeEventListener("resize", updatePill);
      observer.disconnect();
    };
  }, [activeModule]);

  // Auto-advance
  useEffect(() => {
    if (prefersReducedMotion || isPaused) return;
    const t = setInterval(() => setActiveModule((v) => (v + 1) % modules.length), 1800);
    return () => clearInterval(t);
  }, [isPaused, prefersReducedMotion]);

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

  const mod = modules[activeModule];

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
      className="relative overflow-hidden bg-white py-24 outline-none"
      aria-label="Specora platform features"
    >
      {/* Background */}
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-[0.03]" />
      <div className="pointer-events-none absolute -top-24 -left-24 h-[620px] w-[620px] rounded-full bg-gradient-to-br from-[oklch(0.85_0.20_130)]/35 via-sky-400/20 to-transparent blur-[90px]" />
      <div className="pointer-events-none absolute -right-24 -bottom-28 h-[720px] w-[720px] rounded-full bg-gradient-to-tr from-violet-400/25 via-emerald-400/15 to-transparent blur-[110px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-12 pt-24 pb-10">
          {/* Heading */}
          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="mt-5 text-3xl leading-[1.05] font-semibold tracking-tight text-slate-900 md:text-4xl lg:text-5xl">
                Core Modules
                <span className="text-[oklch(0.55_0.15_130)]"> & Features</span>
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed font-light text-slate-500 md:text-base">
                Experience the complete requirements lifecycle with purpose-built modules.
              </p>
            </div>
          </div>

          {/* Theater */}
          <div className="mt-8 grid min-h-0 grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
            {/* Rail */}
            <div className="relative min-h-0 overflow-hidden rounded-[2.5rem] border border-slate-200/60 bg-slate-50/60 p-4 sm:p-5">
              <div className="pointer-events-none absolute inset-0 opacity-[0.7]">
                <div className="absolute -top-20 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-[oklch(0.85_0.20_130)]/25 to-transparent blur-[70px]" />
              </div>

              <div className="relative space-y-2 pr-1">
                {/* Sliding highlight pill */}
                <div
                  className={cn(
                    "pointer-events-none absolute right-1 left-0 rounded-[1.8rem] bg-slate-900 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.45)] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
                    pillStyle.height === 0 ? "opacity-0" : "opacity-100"
                  )}
                  style={{ height: `${pillStyle.height}px`, top: `${pillStyle.top}px` }}
                />

                {modules.map((m, idx) => {
                  const isActive = activeModule === idx;
                  return (
                    <button
                      key={m.id}
                      ref={(el) => (tabRefs.current[idx] = el)}
                      onClick={() => setActiveModule(idx)}
                      aria-pressed={isActive}
                      className={cn(
                        "group relative z-10 flex w-full items-center gap-4 rounded-[1.8rem] border px-4 py-4 text-left transition-colors duration-500",
                        isActive
                          ? "border-transparent text-white"
                          : "border-slate-200/70 bg-white/40 text-slate-600 hover:border-slate-200 hover:bg-white"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-2xl border transition-all duration-500",
                          isActive ? "border-white/10 bg-white/5" : "border-slate-200/70 bg-slate-50"
                        )}
                      >
                        <div
                          className={cn("transition-colors duration-500", isActive ? "text-white" : "text-slate-800")}
                        >
                          {m.glyph}
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="mt-1 truncate text-base font-semibold tracking-tight">{m.label}</div>
                          </div>
                          <ArrowRight
                            className={cn(
                              "h-4 w-4 shrink-0 transition-all duration-500",
                              isActive ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"
                            )}
                          />
                        </div>
                        <div
                          className={cn("mt-1 text-xs leading-snug", isActive ? "text-slate-300/80" : "text-slate-500")}
                        >
                          {m.tagline}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stage */}
            <div className="relative min-h-0 overflow-hidden rounded-[2.5rem] border border-slate-200/60 bg-slate-50/50">
              <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br", mod.accent)} />
              <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(60%_60%_at_60%_10%,black,transparent)]">
                <div className="absolute -top-28 right-10 h-[520px] w-[520px] rounded-full bg-white/20 blur-[90px]" />
              </div>

              <div
                key={activeModule}
                className={cn(
                  "relative h-full p-6 sm:p-8 lg:p-10",
                  prefersReducedMotion ? "" : "animate-in fade-in slide-in-from-right-6 duration-700"
                )}
              >
                <div className="grid h-full min-h-0 grid-rows-[auto_auto_1fr] gap-6">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className={cn("h-2.5 w-2.5 rounded-full", mod.dot)} />
                        <span className="text-[10px] font-black tracking-[0.25em] text-slate-600 uppercase">
                          {mod.label}
                        </span>
                      </div>
                      <h3 className="mt-3 max-w-2xl text-2xl leading-snug font-semibold tracking-tight text-slate-900 md:text-3xl">
                        {mod.tagline}
                      </h3>
                      <p className="mt-3 max-w-2xl text-sm leading-relaxed font-light text-slate-600 md:text-base">
                        {mod.description}
                      </p>
                    </div>

                    {/* Dot nav */}
                    <div className="hidden shrink-0 flex-col items-end gap-2 md:flex">
                      <div className="text-[10px] font-black tracking-widest text-slate-600 uppercase">
                        Module {activeModule + 1}
                      </div>
                      <div className="flex gap-1.5">
                        {modules.map((m, i) => (
                          <button
                            key={m.id}
                            onClick={() => setActiveModule(i)}
                            aria-label={`Go to ${m.label}`}
                            className={cn(
                              "h-2.5 w-10 rounded-full transition-all duration-500",
                              i === activeModule ? "bg-slate-900" : "bg-slate-300/70 hover:bg-slate-400/80"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Bullet cards */}
                  <div className="min-h-0 pb-10">
                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                      {mod.bullets.map((b, i) => (
                        <div
                          key={i}
                          className="group rounded-[2rem] border border-white/30 bg-white/70 p-5 backdrop-blur-sm transition-all duration-500 hover:bg-white/85 hover:shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)] sm:p-6"
                        >
                          <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm transition-transform duration-500 group-hover:scale-[1.06]">
                              {b.icon}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
                                {b.title}
                              </h4>
                              <p className="mt-2 text-sm leading-relaxed font-light text-slate-600">{b.desc}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex items-center justify-between text-[10px] font-black tracking-widest text-slate-600 uppercase">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

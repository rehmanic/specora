@import "tailwindcss";

@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  /* Font families */
  --font-sans: "Inter", system-ui, sans-serif;
  --font-display: "Outfit", "Inter", sans-serif;
}

:root,
.light {
  --radius: 0.75rem;

  --primary: oklch(0.85 0.2 130);
  --primary-foreground: oklch(0.15 0.02 285);
  --secondary: oklch(0.95 0.01 285);
  --secondary-foreground: oklch(0.35 0.05 285);
  --accent: oklch(0.15 0.02 285);
  --accent-foreground: oklch(0.98 0 0);
  --success: oklch(0.65 0.2 155);
  --warning: oklch(0.78 0.16 75);
  --destructive: oklch(0.6 0.24 25);
  --background: oklch(0.985 0.005 285);
  --foreground: oklch(0.15 0.02 285);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.15 0.02 285);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.15 0.02 285);
  --muted: oklch(0.96 0.01 285);
  --muted-foreground: oklch(0.5 0.03 285);
  --border: oklch(0.91 0.01 285);
  --input: oklch(0.91 0.01 285);
  --ring: oklch(0.85 0.2 130);
  --chart-1: oklch(0.15 0.02 285);
  --chart-2: oklch(0.85 0.2 130);
  --chart-3: oklch(0.65 0.2 155);
  --chart-4: oklch(0.78 0.16 75);
  --chart-5: oklch(0.6 0.24 25);
  --sidebar: oklch(0.98 0.005 285);
  --sidebar-foreground: oklch(0.15 0.02 285);
  --sidebar-primary: oklch(0.15 0.02 285);
  --sidebar-primary-foreground: oklch(0.98 0 0);
  --sidebar-accent: oklch(0.94 0.02 285);
  --sidebar-accent-foreground: oklch(0.35 0.05 285);
  --sidebar-border: oklch(0.91 0.01 285);
  --sidebar-ring: oklch(0.15 0.02 285);
  --gradient-start: oklch(0.8 0.22 130);
  --gradient-mid: oklch(0.85 0.2 130);
  --gradient-end: oklch(0.9 0.18 130);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground antialiased;
    font-family: var(--font-sans);
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display);
  }
}

@layer utilities {
  .gradient-primary { background: linear-gradient(135deg, var(--gradient-start), var(--gradient-mid), var(--gradient-end)); }
  .gradient-text { background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .glass { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.3); }
  .mesh-gradient {
    background: radial-gradient(at 40% 20%, oklch(0.15 0.02 285 / 0.4) 0px, transparent 50%),
                radial-gradient(at 80% 0%, oklch(0.85 0.2 130 / 0.1) 0px, transparent 50%),
                radial-gradient(at 0% 50%, oklch(0.2 0.04 285 / 0.3) 0px, transparent 50%),
                radial-gradient(at 80% 50%, oklch(0.3 0.05 285 / 0.3) 0px, transparent 50%),
                radial-gradient(at 0% 100%, oklch(0.25 0.05 285 / 0.4) 0px, transparent 50%),
                radial-gradient(at 80% 100%, oklch(0.15 0.02 285 / 0.3) 0px, transparent 50%),
                linear-gradient(180deg, oklch(0.2 0.05 285) 0%, oklch(0.15 0.03 285) 100%);
    animation: meshMove 20s ease-in-out infinite;
  }
  @keyframes meshMove {
    0%, 100% { background-position: 0% 0%, 100% 0%, 0% 50%, 100% 50%, 0% 100%, 100% 100%, 0% 0%; }
    25% { background-position: 20% 20%, 80% 10%, 10% 60%, 90% 40%, 20% 90%, 80% 100%, 0% 0%; }
    50% { background-position: 40% 10%, 60% 20%, 20% 40%, 80% 60%, 10% 80%, 90% 90%, 0% 0%; }
    75% { background-position: 10% 30%, 90% 10%, 5% 55%, 95% 45%, 15% 95%, 85% 85%, 0% 0%; }
  }
  .hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
  .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 10px -5px rgba(0, 0, 0, 0.05); }
  .focus-ring { @apply focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none; }
  .animate-fade-in { animation: fadeIn 0.3s ease-out; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .pulse-glow { animation: pulseGlow 2s ease-in-out infinite; }
  @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 5px oklch(0.85 0.2 130 / 0.4); transform: scale(1); } 50% { box-shadow: 0 0 15px oklch(0.85 0.2 130 / 0.7); transform: scale(1.15); } }
  .hero-grid { background-size: 60px 60px; background-image: linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px); }
  .shadow-soft { box-shadow: 0 8px 30px -6px rgba(0, 0, 0, 0.08); }
  .shadow-glow { box-shadow: 0 0 20px oklch(0.85 0.2 130 / 0.25); }
}

::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: oklch(0.75 0.02 285); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: oklch(0.65 0.03 285); }

button, [role="button"] { transition: all 0.2s ease; }
button:active:not(:disabled), [role="button"]:active:not(:disabled) { transform: scale(0.98); }
input:focus, textarea:focus, select:focus { box-shadow: 0 0 0 3px oklch(0.15 0.02 285 / 0.15); }
.card-interactive { transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease; }
.card-interactive:hover { transform: translateY(-2px); box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.1); border-color: oklch(0.15 0.02 285 / 0.3); }

/* Basic animations for features section */
.animate-in { animation: animate-in-keyframes 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
.fade-in { animation-name: fade-in-keyframes; }
.slide-in-from-right-6 { animation-name: slide-in-right-keyframes; }

@keyframes animate-in-keyframes { from { opacity: 0; } to { opacity: 1; } }
@keyframes fade-in-keyframes { from { opacity: 0; } to { opacity: 1; } }
@keyframes slide-in-right-keyframes { from { transform: translateX(24px); } to { transform: translateX(0); } }

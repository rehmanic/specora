import { useState, useEffect } from "react";

export default function GreetingHeader({ user }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const formattedDate = time.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="animate-fade-in flex flex-row items-center justify-between gap-4">
      {/* Greeting Left */}
      <div className="space-y-1">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          {getGreeting()}, <span className="text-primary">{user?.display_name || user?.username || "Guest"}</span>! 👋
        </h1>
      </div>

      {/* Date & Time Right */}
      <div className="bg-card/60 flex items-center gap-4 rounded-2xl border border-white/10 px-5 py-3 shadow-sm backdrop-blur-xl transition-shadow hover:shadow-md dark:border-white/5">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className="text-lg leading-none font-semibold tracking-tight">{formattedTime}</span>
          </div>
          <span className="text-muted-foreground mt-1 text-xs font-medium tracking-wider uppercase">
            {formattedDate}
          </span>
        </div>
      </div>
    </div>
  );
}

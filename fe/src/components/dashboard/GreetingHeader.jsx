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

  const formattedDate = time.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="flex flex-row items-center justify-between gap-4 animate-fade-in">
      {/* Greeting Left */}
      <div className="space-y-1">
        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
          {getGreeting()}, <span className="text-primary">{user?.display_name || user?.username || "Guest"}</span>! 👋
        </h1>
      </div>

      {/* Date & Time Right */}
      <div className="flex items-center gap-4 bg-card/60 backdrop-blur-xl border border-white/10 dark:border-white/5 py-3 px-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold tracking-tight leading-none">{formattedTime}</span>
          </div>
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}

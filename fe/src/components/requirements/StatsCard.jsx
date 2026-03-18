"use client";

import React from "react";

export function StatsCard({ icon: Icon, label, value, color = "primary" }) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-violet-500/10 text-violet-500",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    error: "bg-destructive/10 text-destructive",
    info: "bg-blue-500/10 text-blue-500",
  };

  return (
    <div className="bg-card border-border hover-lift flex cursor-default items-center gap-3 overflow-hidden rounded-xl border p-3 lg:p-4">
      <div className={`flex-shrink-0 rounded-lg p-2.5 lg:p-3 ${colorClasses[color]}`}>
        <Icon className="h-4 w-4 lg:h-5 lg:w-5" />
      </div>
      <div className="min-w-0">
        <p className="font-display truncate text-lg leading-tight font-bold lg:text-2xl" title={value}>
          {value}
        </p>
        <p className="text-muted-foreground truncate text-[10px] leading-tight lg:text-sm" title={label}>
          {label}
        </p>
      </div>
    </div>
  );
}

export default StatsCard;

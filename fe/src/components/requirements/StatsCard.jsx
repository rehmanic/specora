"use client";

import React from "react";

export function StatsCard({ icon: Icon, label, value, color = "primary" }) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    error: "bg-destructive/10 text-destructive",
    info: "bg-blue-500/10 text-blue-500",
  };

  return (
    <div className="flex items-center gap-3 p-3 lg:p-4 rounded-xl bg-card border border-border hover-lift cursor-default overflow-hidden">
      <div className={`flex-shrink-0 p-2.5 lg:p-3 rounded-lg ${colorClasses[color]}`}>
        <Icon className="h-4 w-4 lg:h-5 lg:w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-lg lg:text-2xl font-bold font-display truncate leading-tight" title={value}>{value}</p>
        <p className="text-[10px] lg:text-sm text-muted-foreground truncate leading-tight" title={label}>{label}</p>
      </div>
    </div>
  );
}

export default StatsCard;

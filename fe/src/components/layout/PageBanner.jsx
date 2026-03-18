import { cn } from "@/lib/utils";

export default function PageBanner({ title, description, icon: Icon, className }) {
  return (
    <div className={cn("bg-card relative mb-8 overflow-hidden rounded-xl border shadow-sm", className)}>
      <div className="bg-primary/5 hero-grid absolute inset-x-0 top-0 h-full"></div>

      <div className="relative z-10 flex flex-col items-center gap-5 px-6 py-6 text-center sm:flex-row sm:items-start sm:text-left">
        {Icon && (
          <div className="bg-background group relative rounded-2xl border p-4 shadow-sm">
            <div className="bg-primary/10 absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"></div>
            <Icon className="text-primary shadow-primary/20 h-8 w-8 drop-shadow-sm" />
          </div>
        )}
        <div className="mt-1 flex-1 space-y-1.5 sm:mt-0">
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          {description && <p className="text-muted-foreground max-w-2xl text-sm sm:text-base">{description}</p>}
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";

export default function PageBanner({ title, description, icon: Icon, className }) {
  return (
    <div className={cn("relative rounded-xl overflow-hidden bg-card border shadow-sm mb-8", className)}>
      <div className="absolute inset-x-0 top-0 h-full bg-primary/5 hero-grid"></div>
      
      <div className="relative z-10 px-6 py-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
        {Icon && (
          <div className="p-4 bg-background border rounded-2xl shadow-sm relative group">
            <div className="absolute inset-0 bg-primary/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Icon className="h-8 w-8 text-primary shadow-primary/20 drop-shadow-sm" />
          </div>
        )}
        <div className="flex-1 space-y-1.5 mt-1 sm:mt-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-display">{title}</h1>
          {description && (
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

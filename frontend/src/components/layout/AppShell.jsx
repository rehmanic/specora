import Sidebar from "./Sidebar";

export default function AppShell({ children, active }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="flex">
        <Sidebar active={active} />
        <div className="flex-1">
          {/* Top Bar */}
          <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="h-12 flex items-center px-4 md:px-6">
              <span className="text-sm text-muted-foreground">Specora</span>
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import Link from "next/link";

export default function SearchCreateHeader({
  searchQuery,
  setSearchQuery,
  searchPlaceholder = "Search...",
  buttonText = "Create New",
  linkTo,
  onAction,
  showButton = true,
}) {
  const ActionButtonContent = (
    <Button
      onClick={!linkTo ? onAction : undefined}
      className="gradient-primary shadow-primary/20 h-14 gap-2 rounded-xl border-0 px-5 whitespace-nowrap shadow-lg transition-transform hover:scale-105 active:scale-95"
    >
      <Plus className="h-4 w-4" />
      <span className="hidden sm:inline">{buttonText}</span>
    </Button>
  );

  return (
    <div
      className="animate-fade-in flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      style={{ animationDelay: "0.15s" }}
    >
      {/* Search Input */}
      <div className="group relative w-full flex-1">
        <Search className="text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transition-colors" />
        <Input
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="focus:ring-primary/20 h-14 w-full rounded-xl pl-9 transition-all"
        />
      </div>

      {/* Action Buttons */}
      <div className="mt-2 flex flex-wrap items-center justify-end gap-2 sm:mt-0">
        {showButton && (linkTo ? <Link href={linkTo}>{ActionButtonContent}</Link> : ActionButtonContent)}
      </div>
    </div>
  );
}

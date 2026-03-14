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
      className="gap-2 h-14 px-5 gradient-primary border-0 shadow-lg shadow-primary/20 rounded-xl hover:scale-105 transition-transform active:scale-95 whitespace-nowrap"
    >
      <Plus className="h-4 w-4" />
      <span className="hidden sm:inline">{buttonText}</span>
    </Button>
  );

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in w-full" style={{ animationDelay: '0.15s' }}>
      {/* Search Input */}
      <div className="relative group w-full flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 w-full h-14 focus:ring-primary/20 transition-all rounded-xl"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0 justify-end">
        {showButton && (
          linkTo ? (
            <Link href={linkTo}>
              {ActionButtonContent}
            </Link>
          ) : (
            ActionButtonContent
          )
        )}
      </div>
    </div>
  );
}

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import Link from "next/link";

/**
 * Reusable header component containing a search input and an optional action/create button.
 * Can be used for "New Project", "New Meeting", "New User", etc.
 * 
 * @param {string} searchQuery - The current search query string.
 * @param {function} setSearchQuery - Function to update the search query.
 * @param {string} searchPlaceholder - Placeholder text for the search input.
 * @param {string} buttonText - Text to display inside the action button.
 * @param {string} linkTo - URL to navigate to when the button is clicked (if it's a link).
 * @param {function} onAction - Function to call when the button is clicked (if it's not a link).
 * @param {boolean} showButton - Determines if the action button should be rendered. Default: true.
 * @param {ReactNode} extraButtons - Any additional elements/buttons to render next to the action button (e.g., filters).
 */
export default function SearchCreateHeader({ 
  searchQuery, 
  setSearchQuery, 
  searchPlaceholder = "Search...", 
  buttonText = "Create New", 
  linkTo, 
  onAction, 
  showButton = true,
  extraButtons
}) {
  const ActionButtonContent = (
    <Button 
      onClick={!linkTo ? onAction : undefined}
      className="gap-2 h-10 px-5 gradient-primary border-0 shadow-lg shadow-primary/20 rounded-xl hover:scale-105 transition-transform active:scale-95 whitespace-nowrap"
    >
      <Plus className="h-4 w-4" />
      <span className="hidden sm:inline">{buttonText}</span>
    </Button>
  );

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card/40 backdrop-blur-xl p-4 rounded-2xl border border-border/50 shadow-sm animate-fade-in w-full" style={{ animationDelay: '0.15s' }}>
      {/* Search Input */}
      <div className="relative group w-full max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 w-full h-10 bg-background/50 border-white/10 dark:border-white/5 focus:ring-primary/20 transition-all rounded-xl"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0 justify-end">
        {extraButtons && extraButtons}
        
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

import { cn } from "@/lib/utils";

export default function MessageBubble({
  text,
  timestamp,
  name,
  isSender,
  children,
}) {
  const formattedTimestamp =
    timestamp instanceof Date
      ? timestamp.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : timestamp;

  return (
    <div
      className={cn(
        "relative flex w-fit max-w-[75%] flex-col gap-1 rounded-2xl px-4 py-2.5 shadow-sm",
        "sm:max-w-md sm:px-5 sm:py-3",
        isSender
          ? "bg-primary text-primary-foreground rounded-br-none"
          : "bg-muted text-foreground rounded-bl-none"
      )}
    >
      {/* Sender name */}
      <p className="text-xs font-semibold opacity-80">{name}</p>

      {/* Message text */}
      <p className="text-pretty text-sm leading-relaxed">{text}</p>

      {/* Timestamp */}
      <time
        className="text-[10px] opacity-70 sm:text-xs self-end"
        dateTime={
          timestamp instanceof Date ? timestamp.toISOString() : timestamp
        }
      >
        {formattedTimestamp}
      </time>

      {/* Inject menu (or other children like reactions) */}
      {children}
    </div>
  );
}

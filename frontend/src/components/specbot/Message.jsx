import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

export function Message({ text, timestamp, isSender = false, className }) {
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
        "flex w-full",
        isSender ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex w-fit max-w-[75%] flex-col gap-1 rounded-2xl px-4 py-2.5 shadow-sm",
          "sm:max-w-md sm:px-5 sm:py-3",
          isSender
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-muted text-foreground rounded-bl-none",
          className
        )}
      >
        <div className="prose prose-sm max-w-none text-sm leading-relaxed prose-p:mb-2 last:prose-p:mb-0 prose-li:my-0 dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
        </div>
        <time
          className="text-[10px] opacity-70 sm:text-xs self-end"
          dateTime={timestamp instanceof Date ? timestamp.toISOString() : timestamp}
        >
          {formattedTimestamp}
        </time>
      </div>
    </div>
  );
}

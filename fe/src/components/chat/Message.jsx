import { cn } from "@/lib/utils";
import MessageBubble from "./MessageBubble";
import MessageMenu from "./MessageMenu";

export function Message({
  id,
  text,
  timestamp,
  isSender = false,
  name,
  avatarUrl,
  menuOpenId,
  setMenuOpenId,
}) {
  return (
    <div
      className={cn(
        "flex w-full items-start gap-2",
        isSender ? "justify-end" : "justify-start"
      )}
    >
      {!isSender && (
        <img
          src={avatarUrl || "/default-avatar.png"}
          alt={name}
          className="w-8 h-8 rounded-full object-cover"
        />
      )}

      <MessageBubble
        text={text}
        timestamp={timestamp}
        name={name}
        isSender={isSender}
      >
        <MessageMenu
          id={id}
          menuOpenId={menuOpenId}
          setMenuOpenId={setMenuOpenId}
        />
      </MessageBubble>

      {isSender && (
        <img
          src={avatarUrl || "/default-avatar.png"}
          alt={name}
          className="w-8 h-8 rounded-full object-cover"
        />
      )}
    </div>
  );
}

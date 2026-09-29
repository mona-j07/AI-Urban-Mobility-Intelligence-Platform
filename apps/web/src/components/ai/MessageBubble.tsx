import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ItineraryCard } from "@/components/planner/ItineraryCard";

export interface Message {
  role: "user" | "assistant";
  content: string;
  /** Parsed itinerary options if the assistant returned structured data */
  options?: Array<{
    label: string;
    duration_minutes: number;
    fare: number;
    crowd_level: string;
    description?: string;
  }>;
  /** True while waiting for the assistant response */
  loading?: boolean;
}

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  if (message.loading) {
    return (
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Bot className="h-4 w-4" />
        </span>
        <div className="space-y-2 flex-1 max-w-[80%]">
          <Skeleton className="h-4 w-3/4 rounded-lg" />
          <Skeleton className="h-4 w-1/2 rounded-lg" />
          <Skeleton className="h-4 w-2/3 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-start gap-3", isUser && "flex-row-reverse")}>
      {/* Avatar */}
      <span
        className={cn(
          "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-primary/10 text-primary"
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </span>

      {/* Content */}
      <div className={cn("space-y-2 max-w-[80%]", isUser && "items-end flex flex-col")}>
        {/* Plain text bubble */}
        {message.content && (
          <div
            className={cn(
              "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
              isUser
                ? "bg-primary text-primary-foreground rounded-tr-sm"
                : "bg-muted text-foreground rounded-tl-sm"
            )}
          >
            {message.content}
          </div>
        )}

        {/* Itinerary cards (assistant only) */}
        {!isUser && message.options && message.options.length > 0 && (
          <div className="space-y-2 w-full">
            {message.options.map((opt, i) => (
              <ItineraryCard key={i} option={opt} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

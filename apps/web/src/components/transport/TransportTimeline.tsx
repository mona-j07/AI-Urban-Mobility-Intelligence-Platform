import type { Stop } from "@shared/types";
import { cn } from "@/lib/utils";

interface TransportTimelineProps {
  stops: Stop[];
  currentStopIndex?: number;
}

export function TransportTimeline({ stops, currentStopIndex }: TransportTimelineProps) {
  return (
    <div className="flex flex-col gap-0">
      {stops.map((stop, i) => {
        const isCurrent = i === currentStopIndex;
        const isPast = currentStopIndex != null && i < currentStopIndex;

        return (
          <div key={stop.id} className="flex items-start gap-3">
            {/* Timeline dot + connector */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "h-3 w-3 rounded-full border-2 shrink-0 mt-1",
                  isCurrent
                    ? "bg-primary border-primary"
                    : isPast
                    ? "bg-muted-foreground/40 border-muted-foreground/40"
                    : "bg-background border-muted-foreground/30"
                )}
              />
              {i < stops.length - 1 && (
                <div
                  className={cn(
                    "w-0.5 h-6",
                    isPast ? "bg-muted-foreground/40" : "bg-muted-foreground/20"
                  )}
                />
              )}
            </div>

            {/* Stop name */}
            <span
              className={cn(
                "text-sm leading-tight pb-3",
                isCurrent ? "font-semibold text-foreground" : isPast ? "text-muted-foreground" : "text-foreground/80"
              )}
            >
              {stop.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}

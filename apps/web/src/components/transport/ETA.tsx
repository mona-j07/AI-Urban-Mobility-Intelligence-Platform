import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

interface ETAProps {
  minutes?: number;
}

export function ETA({ minutes }: ETAProps) {
  if (minutes == null) {
    return (
      <span className="inline-flex items-center gap-1 text-amber-600 font-medium text-sm">
        <AlertTriangle className="h-3.5 w-3.5" />
        ETA unavailable
      </span>
    );
  }

  return (
    <span
      className={cn(
        "font-medium text-sm",
        minutes <= 3 ? "text-green-600" : minutes <= 10 ? "text-foreground" : "text-muted-foreground"
      )}
    >
      {minutes} min
    </span>
  );
}

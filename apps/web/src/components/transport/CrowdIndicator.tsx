import type { CrowdLevel } from "@shared/types";
import { cn } from "@/lib/utils";

interface CrowdIndicatorProps {
  level: CrowdLevel;
}

const config: Record<CrowdLevel, { dot: string; label: string; text: string }> = {
  LOW: { dot: "bg-green-500", label: "Low", text: "text-green-700" },
  MEDIUM: { dot: "bg-amber-500", label: "Medium", text: "text-amber-700" },
  HIGH: { dot: "bg-red-500", label: "High", text: "text-red-700" },
};

export function CrowdIndicator({ level }: CrowdIndicatorProps) {
  const { dot, label, text } = config[level];

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-sm font-medium", text)}>
      <span className={cn("h-2 w-2 rounded-full", dot)} />
      {label}
    </span>
  );
}

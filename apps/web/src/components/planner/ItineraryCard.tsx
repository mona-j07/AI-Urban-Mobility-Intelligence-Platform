import { Clock, Zap, Wallet, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FareDisplay } from "@/components/transport/FareDisplay";
import { CrowdIndicator } from "@/components/transport/CrowdIndicator";
import type { CrowdLevel } from "@shared/types";
import { cn } from "@/lib/utils";

interface ItineraryOption {
  label: string;
  duration_minutes: number;
  fare: number;
  crowd_level: string;
  description?: string;
  data_source?: string;
}

interface ItineraryCardProps {
  option: ItineraryOption;
}

const labelConfig: Record<string, { icon: React.ElementType; color: string; bg: string; text: string }> = {
  FASTEST:       { icon: Zap,   color: "text-blue-600",  bg: "bg-blue-50  border-blue-200",  text: "Fastest"       },
  CHEAPEST:      { icon: Wallet, color: "text-green-600", bg: "bg-green-50 border-green-200", text: "Cheapest"      },
  LEAST_CROWDED: { icon: Users, color: "text-purple-600",bg: "bg-purple-50 border-purple-200",text: "Least Crowded" },
};

export function ItineraryCard({ option }: ItineraryCardProps) {
  const cfg = labelConfig[option.label] ?? {
    icon: Clock, color: "text-gray-600", bg: "bg-gray-50 border-gray-200", text: option.label,
  };
  const Icon = cfg.icon;
  const crowdLevel = (["LOW", "MEDIUM", "HIGH"].includes(option.crowd_level)
    ? option.crowd_level
    : "MEDIUM") as CrowdLevel;

  return (
    <Card className={cn("border transition-shadow hover:shadow-md", cfg.bg)}>
      <CardContent className="p-4 space-y-3">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn("p-1.5 rounded-full bg-white shadow-sm", cfg.color)}>
              <Icon className="h-4 w-4" />
            </span>
            <span className={cn("font-semibold text-sm", cfg.color)}>{cfg.text}</span>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            <Clock className="h-3 w-3 mr-1 inline" />
            {option.duration_minutes} min
          </Badge>
        </div>

        {/* Description */}
        {option.description && (
          <p className="text-sm text-muted-foreground leading-snug">{option.description}</p>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-4 pt-1">
          <div className="text-sm">
            Fare: <FareDisplay fare={option.fare} />
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Crowd:</span>
            <CrowdIndicator level={crowdLevel} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

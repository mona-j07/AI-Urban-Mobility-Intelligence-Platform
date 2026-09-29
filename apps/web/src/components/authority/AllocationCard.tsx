import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type Status = "over" | "under" | "balanced";

interface Allocation {
  route: string;
  name: string;
  demand: number;
  capacity: number;
  status: Status;
  recommendation: string;
}

const allocations: Allocation[] = [
  {
    route: "21G",
    name: "Tambaram – Thiruvanmiyur (OMR)",
    demand: 1680,
    capacity: 1200,
    status: "over",
    recommendation: "Add 2 additional buses during 7–9 AM and 5–8 PM peak windows.",
  },
  {
    route: "23C",
    name: "Kelambakkam – Marina Beach",
    demand: 1240,
    capacity: 1400,
    status: "balanced",
    recommendation: "Current allocation is adequate. Monitor weekday evenings.",
  },
  {
    route: "M1",
    name: "Chennai Airport – Washermanpet",
    demand: 890,
    capacity: 1600,
    status: "under",
    recommendation: "Reduce frequency from every 8 min to every 12 min off-peak.",
  },
  {
    route: "27H",
    name: "Velachery – Guindy",
    demand: 740,
    capacity: 600,
    status: "over",
    recommendation: "Extend 3 evening buses from Velachery terminus to handle overflow.",
  },
  {
    route: "5C",
    name: "Adyar – Central Station",
    demand: 420,
    capacity: 800,
    status: "under",
    recommendation: "Consider merging with route 5B to optimise fleet utilisation.",
  },
];

const statusConfig: Record<Status, { label: string; className: string; Icon: React.ElementType }> = {
  over:     { label: "Over-served demand",  className: "border-red-300    bg-red-50    text-red-700",    Icon: TrendingUp   },
  under:    { label: "Under-served demand", className: "border-amber-300  bg-amber-50  text-amber-700",  Icon: TrendingDown },
  balanced: { label: "Balanced",            className: "border-green-300  bg-green-50  text-green-700",  Icon: Minus        },
};

interface AllocationCardProps {
  allocation: Allocation;
}

export function AllocationCard({ allocation }: AllocationCardProps) {
  const { label, className, Icon } = statusConfig[allocation.status];
  const pct = Math.round((allocation.demand / allocation.capacity) * 100);

  return (
    <div className="border rounded-xl p-4 space-y-3 hover:shadow-sm transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm">{allocation.route}</span>
            <Badge variant="outline" className={className}>
              <Icon className="h-3 w-3 mr-1" />
              {label}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">{allocation.name}</div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-lg font-bold">{pct}%</div>
          <div className="text-xs text-muted-foreground">utilisation</div>
        </div>
      </div>

      {/* Utilisation bar */}
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            pct > 100 ? "bg-red-500" : pct > 80 ? "bg-amber-500" : "bg-green-500"
          }`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span>Demand: <strong className="text-foreground">{allocation.demand.toLocaleString()}</strong></span>
        <span>Capacity: <strong className="text-foreground">{allocation.capacity.toLocaleString()}</strong></span>
      </div>

      {/* Recommendation */}
      <p className="text-sm text-muted-foreground border-t pt-2.5">{allocation.recommendation}</p>
    </div>
  );
}

export { allocations };

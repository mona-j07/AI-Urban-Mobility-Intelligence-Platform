import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bus, Users, Clock, TrendingUp, ChevronRight } from "lucide-react";

const stats = [
  {
    label: "Active Vehicles",
    value: "5",
    sub: "3 buses · 2 metro",
    icon: Bus,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Avg Crowd Level",
    value: "Medium",
    sub: "Peak hours: 8–10 AM",
    icon: Users,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    label: "Delayed Routes",
    value: "2",
    sub: "21G · 23C running late",
    icon: Clock,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    label: "Today's Demand",
    value: "1,842",
    sub: "+12% vs yesterday",
    icon: TrendingUp,
    color: "text-green-600",
    bg: "bg-green-50",
  },
];

const subPages = [
  { href: "/authority/fleet",      label: "Fleet Map",         desc: "Live vehicle positions across all routes" },
  { href: "/authority/crowd",      label: "Crowd Heatmap",     desc: "Occupancy by route and time of day" },
  { href: "/authority/demand",     label: "Demand Forecast",   desc: "7-day predicted ridership trend" },
  { href: "/authority/delays",     label: "Delay Analysis",    desc: "Scheduled vs actual arrival times" },
  { href: "/authority/allocation", label: "Route Allocation",  desc: "Over/under-served route recommendations" },
];

export default function AuthorityPage() {
  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Authority Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Operations overview — Chennai Urban Mobility
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, sub, icon: Icon, color, bg }) => (
          <Card key={label}>
            <CardContent className="p-5 space-y-3">
              <div className={`inline-flex p-2 rounded-lg ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight">{value}</div>
                <div className="text-xs font-medium text-muted-foreground mt-0.5">{label}</div>
              </div>
              <div className="text-xs text-muted-foreground">{sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sub-page links */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Analytics Modules
        </h2>
        <div className="divide-y rounded-xl border bg-card overflow-hidden">
          {subPages.map(({ href, label, desc }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-between px-4 py-3.5 hover:bg-accent transition-colors group"
            >
              <div>
                <div className="font-medium text-sm">{label}</div>
                <div className="text-xs text-muted-foreground">{desc}</div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

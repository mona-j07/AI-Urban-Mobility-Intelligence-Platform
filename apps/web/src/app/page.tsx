import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Navigation, MapPin, Bot } from "lucide-react";

const quickActions = [
  { href: "/search", label: "Search Routes", desc: "Find the best route between stops", icon: Search, color: "bg-blue-500/10 text-blue-600" },
  { href: "/tracking", label: "Live Tracking", desc: "See buses and metro in real time", icon: Navigation, color: "bg-green-500/10 text-green-600" },
  { href: "/planner", label: "Trip Planner", desc: "Plan your journey with AI assistance", icon: MapPin, color: "bg-purple-500/10 text-purple-600" },
  { href: "/ai", label: "AI Assistant", desc: "Ask anything about transit in Chennai", icon: Bot, color: "bg-amber-500/10 text-amber-600" },
];

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      {/* Hero */}
      <section className="text-center space-y-3">
        <Badge variant="secondary" className="mb-2">AI-Powered Transit</Badge>
        <h1 className="text-4xl font-bold tracking-tight">Urban Mobility</h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Real-time tracking, smart route planning, and crowd predictions for Chennai transit.
        </p>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions.map(({ href, label, desc, icon: Icon, color }) => (
          <Link key={href} href={href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader className="flex flex-row items-start gap-4">
                <div className={`rounded-lg p-2.5 ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">{label}</CardTitle>
                  <CardDescription>{desc}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}

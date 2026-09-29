"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DemandChart } from "@/components/authority/DemandChart";

export default function DemandPage() {
  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Demand Forecast</h1>
        <p className="text-muted-foreground text-sm">
          7-day predicted ridership by route (mock data)
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Weekly Ridership Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <DemandChart />
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DelayChart } from "@/components/authority/DelayChart";

export default function DelaysPage() {
  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Delay Analysis</h1>
        <p className="text-muted-foreground text-sm">
          Scheduled vs actual arrival times for today's trips (mock data)
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Scheduled vs Actual (minutes)</CardTitle>
        </CardHeader>
        <CardContent>
          <DelayChart />
        </CardContent>
      </Card>
    </div>
  );
}

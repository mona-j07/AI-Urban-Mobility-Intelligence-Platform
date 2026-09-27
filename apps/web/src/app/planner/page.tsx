"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function PlannerPage() {
  const [destination, setDestination] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");

  const handlePlan = () => {
    console.log("Plan trip:", { destination, arrivalTime });
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-bold">Trip Planner</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Where are you going?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Destination stop or landmark"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <Input
            type="time"
            placeholder="Desired arrival time"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(e.target.value)}
          />
          <Button onClick={handlePlan} className="w-full">Plan Trip</Button>
        </CardContent>
      </Card>
    </div>
  );
}

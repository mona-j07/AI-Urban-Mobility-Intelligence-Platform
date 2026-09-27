"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockResults = [
  { route: "21G", name: "Tambaram - Thiruvanmiyur", type: "BUS", duration: "35 min", fare: "₹25" },
  { route: "23C", name: "Kelambakkam - Marina Beach", type: "BUS", duration: "55 min", fare: "₹20" },
  { route: "M1", name: "Airport - Washermanpet", type: "METRO", duration: "28 min", fare: "₹40" },
];

export default function SearchPage() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  const handleSearch = () => {
    console.log("Search:", { origin, destination });
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-bold">Search Routes</h1>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input placeholder="Origin stop" value={origin} onChange={(e) => setOrigin(e.target.value)} />
        <Input placeholder="Destination stop" value={destination} onChange={(e) => setDestination(e.target.value)} />
        <Button onClick={handleSearch} className="shrink-0">Search</Button>
      </div>

      <div className="space-y-3">
        {mockResults.map((r) => (
          <Card key={r.route}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{r.route} — {r.name}</CardTitle>
                <Badge variant={r.type === "METRO" ? "default" : "secondary"}>{r.type}</Badge>
              </div>
              <CardDescription>{r.duration} · {r.fare}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

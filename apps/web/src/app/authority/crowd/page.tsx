import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CrowdHeatmap } from "@/components/authority/CrowdHeatmap";

export default function CrowdPage() {
  return (
    <div className="max-w-5xl mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Crowd Heatmap</h1>
        <p className="text-muted-foreground text-sm">
          Occupancy by route and time — today (mock data)
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Route × Time Occupancy</CardTitle>
        </CardHeader>
        <CardContent>
          <CrowdHeatmap />
        </CardContent>
      </Card>
    </div>
  );
}

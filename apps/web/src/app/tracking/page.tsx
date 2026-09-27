import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TrackingPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-bold">Live Tracking</h1>

      <Card className="border-dashed">
        <CardContent className="py-12 text-center text-muted-foreground">
          Live map coming in F5
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">TN-01-AB-1234</CardTitle>
            <Badge className="bg-green-600">ON ROUTE</Badge>
          </div>
          <CardDescription>Route 21G · Heading to Sholinganallur Junction</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <div className="flex gap-4">
            <span>Speed: 28 km/h</span>
            <span>ETA: 6 min</span>
            <span>Crowd: MEDIUM</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

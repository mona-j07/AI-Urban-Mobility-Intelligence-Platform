import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockRoutes = [
  { number: "21G", name: "Tambaram – Thiruvanmiyur (OMR)", type: "BUS" as const },
  { number: "23C", name: "Kelambakkam – Marina Beach", type: "BUS" as const },
  { number: "M1", name: "Chennai Airport – Washermanpet", type: "METRO" as const },
];

export default function RoutesPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-bold">Routes</h1>

      <div className="space-y-3">
        {mockRoutes.map((r) => (
          <Card key={r.number}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{r.number}</CardTitle>
                <Badge variant={r.type === "METRO" ? "default" : "secondary"}>
                  {r.type}
                </Badge>
              </div>
              <CardDescription>{r.name}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { RouteCard } from "@/components/transport/RouteCard";
import { mockRoutes } from "@/lib/mocks";

export default function RoutesPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-bold">Routes</h1>

      <div className="space-y-3">
        {mockRoutes.map((route) => (
          <RouteCard key={route.id} route={route} />
        ))}
      </div>
    </div>
  );
}

import { AllocationCard, allocations } from "@/components/authority/AllocationCard";

export default function AllocationPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Route Allocation</h1>
        <p className="text-muted-foreground text-sm">
          Over/under-served routes with recommendations (mock data)
        </p>
      </div>
      <div className="space-y-3">
        {allocations.map((a) => (
          <AllocationCard key={a.route} allocation={a} />
        ))}
      </div>
    </div>
  );
}

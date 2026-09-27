import { Badge } from "@/components/ui/badge";

interface LiveStatusBadgeProps {
  isSimulated: boolean;
}

export function LiveStatusBadge({ isSimulated }: LiveStatusBadgeProps) {
  if (isSimulated) {
    return (
      <Badge variant="outline" className="border-amber-500 text-amber-600 gap-1.5">
        <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
        Simulated Live Data
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="border-green-500 text-green-600 gap-1.5">
      <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
      Live
    </Badge>
  );
}

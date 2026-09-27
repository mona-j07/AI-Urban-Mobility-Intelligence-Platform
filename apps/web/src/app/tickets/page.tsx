import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Ticket } from "lucide-react";

export default function TicketsPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <h1 className="text-2xl font-bold">My Tickets</h1>

      <Card>
        <CardContent className="py-12 flex flex-col items-center justify-center text-center text-muted-foreground gap-3">
          <Ticket className="h-10 w-10 opacity-40" />
          <p>No tickets yet</p>
          <Button disabled variant="outline">Buy Ticket</Button>
        </CardContent>
      </Card>
    </div>
  );
}

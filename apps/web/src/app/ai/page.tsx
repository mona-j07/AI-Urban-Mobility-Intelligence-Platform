import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Bot } from "lucide-react";

export default function AIPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <h1 className="text-2xl font-bold">AI Assistant</h1>

      {/* Message area */}
      <Card className="flex-1 overflow-y-auto">
        <CardContent className="py-12 flex flex-col items-center justify-center text-center text-muted-foreground gap-3 h-full">
          <Bot className="h-10 w-10 opacity-40" />
          <p>No messages yet. Ask me anything about Chennai transit!</p>
        </CardContent>
      </Card>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          disabled
          placeholder="AI assistant coming in F6"
          className="flex-1"
        />
      </div>
    </div>
  );
}

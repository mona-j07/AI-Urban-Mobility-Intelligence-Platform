"use client";

import { ChatWindow } from "@/components/ai/ChatWindow";

export default function AIPage() {
  return (
    <div className="max-w-2xl mx-auto py-8 flex flex-col h-[calc(100vh-8rem)]">
      <h1 className="text-2xl font-bold mb-4">AI Assistant</h1>
      <div className="flex-1 rounded-xl border shadow-sm overflow-hidden flex flex-col bg-background min-h-0">
        <ChatWindow />
      </div>
    </div>
  );
}

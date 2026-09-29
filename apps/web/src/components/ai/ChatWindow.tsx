"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, AlertCircle } from "lucide-react";
import { MessageBubble, type Message } from "./MessageBubble";

const AI_ENGINE_URL = process.env.NEXT_PUBLIC_AI_ENGINE_URL ?? "http://localhost:8000";

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;

    // 1. Optimistically append user message
    const userMsg: Message = { role: "user", content: text };
    const loadingMsg: Message = { role: "assistant", content: "", loading: true };
    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch(`${AI_ENGINE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      // data shape: { options: TripOption[], source: "ai" | "fallback" }
      const options = Array.isArray(data.options) ? data.options : [];
      const source = data.source === "ai" ? "AI-generated" : "estimated";

      const assistantMsg: Message = {
        role: "assistant",
        content: options.length > 0
          ? `Here are your ${source} route options:`
          : "I couldn't find specific route options for that query. Try asking about travel between two Chennai locations!",
        options: options.length > 0 ? options : undefined,
      };

      setMessages((prev) => [...prev.slice(0, -1), assistantMsg]);
    } catch {
      const errorMsg: Message = {
        role: "assistant",
        content:
          "Couldn't reach the AI assistant — is the AI engine running on port 8000? Start it with: cd services/ai && uvicorn app.main:app --reload",
      };
      setMessages((prev) => [...prev.slice(0, -1), errorMsg]);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Message list */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-3 py-12">
            <Bot className="h-10 w-10 opacity-40" />
            <p className="text-sm max-w-xs">
              Ask me anything about Chennai transit — I can find routes, compare fares, and check crowd levels.
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {[
                "Best route from SSN College to Marina Beach?",
                "Cheapest way to reach Adyar Signal?",
                "How crowded is route 23C now?",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => <MessageBubble key={i} message={msg} />)
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="border-t p-3 flex gap-2 bg-background">
        <Input
          id="ai-chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about Chennai routes, fares, crowd levels…"
          disabled={sending}
          className="flex-1"
          autoComplete="off"
        />
        <Button
          id="ai-chat-send"
          onClick={handleSend}
          disabled={!input.trim() || sending}
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

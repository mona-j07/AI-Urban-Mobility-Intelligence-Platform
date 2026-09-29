"use client";

import { cn } from "@/lib/utils";

const ROUTES = ["21G", "23C", "M1"];
const TIMES  = ["6 AM", "8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM", "8 PM"];

// Mock crowd data: [route][time] → "LOW" | "MEDIUM" | "HIGH"
const mockCrowd: Record<string, Record<string, "LOW" | "MEDIUM" | "HIGH">> = {
  "21G": { "6 AM": "LOW", "8 AM": "HIGH", "10 AM": "HIGH", "12 PM": "MEDIUM", "2 PM": "MEDIUM", "4 PM": "MEDIUM", "6 PM": "HIGH", "8 PM": "MEDIUM" },
  "23C": { "6 AM": "LOW", "8 AM": "MEDIUM", "10 AM": "MEDIUM", "12 PM": "LOW", "2 PM": "LOW", "4 PM": "MEDIUM", "6 PM": "HIGH", "8 PM": "MEDIUM" },
  "M1":  { "6 AM": "MEDIUM", "8 AM": "HIGH", "10 AM": "HIGH", "12 PM": "HIGH", "2 PM": "MEDIUM", "4 PM": "HIGH", "6 PM": "HIGH", "8 PM": "LOW" },
};

const cellColor: Record<"LOW" | "MEDIUM" | "HIGH", string> = {
  LOW:    "bg-green-100 text-green-800",
  MEDIUM: "bg-amber-100 text-amber-800",
  HIGH:   "bg-red-100   text-red-800",
};

export function CrowdHeatmap() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            <th className="text-left pr-4 pb-2 font-semibold text-muted-foreground w-16">Route</th>
            {TIMES.map((t) => (
              <th key={t} className="pb-2 px-1.5 font-medium text-muted-foreground text-center whitespace-nowrap">
                {t}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {ROUTES.map((route) => (
            <tr key={route}>
              <td className="pr-4 py-1.5 font-semibold font-mono">{route}</td>
              {TIMES.map((time) => {
                const level = mockCrowd[route][time];
                return (
                  <td key={time} className="py-1.5 px-1">
                    <div
                      className={cn(
                        "rounded-md text-center text-xs font-medium py-2 px-1 min-w-[52px]",
                        cellColor[level]
                      )}
                    >
                      {level}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
        <span className="font-medium">Legend:</span>
        {(["LOW", "MEDIUM", "HIGH"] as const).map((l) => (
          <span key={l} className={cn("px-2 py-0.5 rounded font-medium", cellColor[l])}>
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

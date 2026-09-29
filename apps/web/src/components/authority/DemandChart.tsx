"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const data = [
  { day: "Mon", "21G": 1240, "23C": 980,  M1: 620  },
  { day: "Tue", "21G": 1380, "23C": 1050, M1: 710  },
  { day: "Wed", "21G": 1520, "23C": 1120, M1: 800  },
  { day: "Thu", "21G": 1450, "23C": 1090, M1: 760  },
  { day: "Fri", "21G": 1680, "23C": 1240, M1: 890  },
  { day: "Sat", "21G": 980,  "23C": 860,  M1: 1020 },
  { day: "Sun", "21G": 820,  "23C": 720,  M1: 940  },
];

const COLORS = { "21G": "#2563eb", "23C": "#16a34a", M1: "#7c3aed" };

export function DemandChart() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="day" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} width={48} />
        <Tooltip
          contentStyle={{ borderRadius: 8, fontSize: 12 }}
          formatter={(v: number) => [`${v.toLocaleString()} riders`, ""]}
        />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
        {(["21G", "23C", "M1"] as const).map((route) => (
          <Line
            key={route}
            type="monotone"
            dataKey={route}
            stroke={COLORS[route]}
            strokeWidth={2.5}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

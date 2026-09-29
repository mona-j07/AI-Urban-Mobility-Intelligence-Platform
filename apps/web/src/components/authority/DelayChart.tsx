"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const data = [
  { trip: "21G-AM1", scheduled: 7,  actual: 14 },
  { trip: "23C-AM2", scheduled: 6,  actual: 8  },
  { trip: "M1-AM3",  scheduled: 4,  actual: 4  },
  { trip: "21G-PM1", scheduled: 7,  actual: 18 },
  { trip: "23C-PM2", scheduled: 6,  actual: 11 },
];

export function DelayChart() {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="trip" tick={{ fontSize: 11 }} />
        <YAxis
          tick={{ fontSize: 12 }}
          width={40}
          label={{ value: "min", angle: -90, position: "insideLeft", fontSize: 11, offset: 8 }}
        />
        <Tooltip
          contentStyle={{ borderRadius: 8, fontSize: 12 }}
          formatter={(v: number) => [`${v} min`, ""]}
        />
        <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="scheduled" name="Scheduled" fill="#93c5fd" radius={[4, 4, 0, 0]} />
        <Bar dataKey="actual"    name="Actual"    fill="#2563eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function TemperatureChart({ data }) {
  // ✅ guard against empty / undefined data
  if (!Array.isArray(data) || data.length === 0) return null;

  const chartData = data
    .slice() // avoid mutating original
    .slice(-50)
    .map((item) => ({
      name: item.time || "",
      temp: Number(item.temperature) // ensure numeric
    }))
    .filter((d) => d.name !== "");

  if (chartData.length === 0) return null;

  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
          />

          <YAxis />

          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1f3a",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff"
            }}
          />

          <Area
            type="monotone"
            dataKey="temp"
            stroke="#ff6b6b"
            fill="#ff6b6b33"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
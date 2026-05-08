"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function TemperatureChart({ data }) {
  if (!data || data.length === 0) return null;

  const chartData = data.map((item) => ({
    time: item.time,
    temperature: Number(item.temperature)
  }));

  return (
    <div
      style={{
        width: "100%",
        height: 400,
        background: "rgba(255,255,255,0.04)",
        borderRadius: "20px",
        padding: "20px",
        marginTop: "20px",
        border: "1px solid rgba(255,255,255,0.08)"
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid
            strokeDasharray="3 3"
            opacity={0.15}
          />

          <XAxis
            dataKey="time"
            stroke="#a0a4b8"
          />

          <YAxis
            stroke="#a0a4b8"
            domain={['auto', 'auto']}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1f3a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              color: "#fff"
            }}
          />

          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#ff6b6b"
            strokeWidth={3}
            dot={{
              r: 5,
              fill: "#ff6b6b"
            }}
            activeDot={{
              r: 7
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
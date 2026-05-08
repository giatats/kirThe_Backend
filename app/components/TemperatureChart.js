"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export default function TemperatureChart({ data }) {
  if (!data || data.length === 0) {
    return null;
  }

  const chartData = data.map((item) => ({
    time: item.time,
    temperature: Number(item.temperature)
  }));

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        borderRadius: "20px",
        padding: "20px",
        border: "1px solid rgba(255,255,255,0.08)",
        marginTop: "20px",
        overflowX: "auto"
      }}
    >
      <LineChart
        width={900}
        height={400}
        data={chartData}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          opacity={0.2}
        />

        <XAxis
          dataKey="time"
          stroke="#a0a4b8"
        />

        <YAxis
          stroke="#a0a4b8"
          domain={['auto', 'auto']}
        />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="temperature"
          stroke="#ff6b6b"
          strokeWidth={3}
          dot={{
            r: 6,
            fill: "#ff6b6b"
          }}
        />
      </LineChart>
    </div>
  );
}
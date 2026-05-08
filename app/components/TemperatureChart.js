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
  console.log("CHART DATA:", data);

  if (!Array.isArray(data)) {
    return <div style={{ color: "red" }}>No chart data (not array)</div>;
  }

  if (data.length === 0) {
    return <div style={{ color: "#aaa" }}>No data for chart</div>;
  }

  const chartData = data.map((item) => ({
    name: item.time,
    temp: Number(item.temperature)
  }));

  return (
    <div style={{
      width: "100%",
      height: 400,
      background: "rgba(255,255,255,0.02)",
      borderRadius: 12,
      padding: 10
    }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

          <XAxis dataKey="name" />
          <YAxis />

          <Tooltip />

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
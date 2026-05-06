"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function TemperatureChart({ data }) {
  const chartData = data.slice(-50).map((item) => ({
    name: item.time,
    temp: item.temperature
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="temp" stroke="#ff6b6b" fill="#ff6b6b33" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
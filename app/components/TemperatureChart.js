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

  // Reverse data so oldest → newest
  const chartData = [...data]
    .reverse()
    .map((item) => ({
      time: item.time,
      temperature: Number(Number(item.temperature).toFixed(1))
    }));

  // Calculate Y-axis limits
  const temps = chartData.map((d) => d.temperature);

  const minTemp = Math.floor(Math.min(...temps)) - 1;
  const maxTemp = Math.ceil(Math.max(...temps)) + 1;

  console.log("TemperatureChart chartData:", chartData, { minTemp, maxTemp });

  const chartWidth = Math.max(900, chartData.length * 140);

  return (
    <div
      style={{
        width: "100%",
        overflowX: "auto",
        background: "rgba(255,255,255,0.04)",
        borderRadius: "20px",
        padding: "20px",
        border: "1px solid rgba(255,255,255,0.08)",
        marginTop: "20px",
        minWidth: 0
      }}
    >
      <LineChart
        width={chartWidth}
        height={420}
        data={chartData}
        margin={{
          top: 20,
          right: 80,
          left: 30,
          bottom: 30
        }}
        layout="vertical"
      >
          {/* Grid */}
        <CartesianGrid
          strokeDasharray="3 3"
          opacity={0.15}
        />

        {/* Y Axis - Time labels (vertical) */}
        <YAxis
            dataKey="time"
            type="category"
            tick={{ fill: "#e8eaf6", fontSize: 11 }}
            axisLine={{ stroke: "#e8eaf6" }}
            tickLine={{ stroke: "#e8eaf6" }}
            width={80}
        />

        {/* X Axis - Temperature (horizontal) */}
        <XAxis
            type="number"
            stroke="#e8eaf6"
            domain={[minTemp, maxTemp]}
            tickCount={6}
            tick={{ fill: "#e8eaf6", fontSize: 12 }}
            axisLine={{ stroke: "#e8eaf6" }}
            tickLine={{ stroke: "#e8eaf6" }}
            allowDecimals={true}
            label={{
                value: "Temperature (°C)",
                position: "insideBottomRight",
                offset: -10
            }}
        />

        {/* Tooltip */}
        <Tooltip
          formatter={(value) => [`${value} °C`, "Temperature"]}
          labelFormatter={(label) => `Time: ${label}`}
          contentStyle={{
            backgroundColor: "#1a1f3a",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "10px",
            color: "#fff"
          }}
        />

        {/* Line */}
        <Line
          type="monotone"
          dataKey="temperature"
          stroke="#ff6b6b"
          strokeWidth={5}
          isAnimationActive={false}
          dot={{
            r: 8,
            fill: "#ff6b6b",
            stroke: "#fff",
            strokeWidth: 2
          }}
          activeDot={{
            r: 9,
            fill: "#fff",
            stroke: "#ff6b6b",
            strokeWidth: 2
          }}
        />
      </LineChart>
    </div>
  );
}
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

  // Prepare chart data
  const chartData = data.map((item) => ({
    time: item.time,
    temperature: Number(Number(item.temperature).toFixed(1))
  }));

  // Calculate axis limits
  const temps = chartData.map((d) => d.temperature);

  const minTemp = Math.floor(Math.min(...temps)) - 1;
  const maxTemp = Math.ceil(Math.max(...temps)) + 1;

  return (
    <div
      style={{
        width: "100%",
        background: "rgba(255,255,255,0.04)",
        borderRadius: "20px",
        padding: "20px",
        border: "1px solid rgba(255,255,255,0.08)",
        marginTop: "20px",
        overflowX: "auto",
        display: "flex",
        justifyContent: "center"
      }}
    >
      <LineChart
        width={1000}
        height={420}
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 30,
          bottom: 40
        }}
      >
        {/* Grid */}
        <CartesianGrid
          strokeDasharray="3 3"
          opacity={0.15}
        />

        {/* X Axis = Time */}
        <XAxis
          dataKey="time"
          stroke="#e8eaf6"
          tick={{ fill: "#e8eaf6", fontSize: 12 }}
          axisLine={{ stroke: "#e8eaf6" }}
          tickLine={{ stroke: "#e8eaf6" }}
          label={{
            value: "Time",
            position: "insideBottom",
            offset: -15,
            fill: "#e8eaf6"
          }}
        />

        {/* Y Axis = Temperature */}
        <YAxis
          stroke="#e8eaf6"
          domain={[minTemp, maxTemp]}
          tickCount={6}
          tick={{ fill: "#e8eaf6", fontSize: 12 }}
          axisLine={{ stroke: "#e8eaf6" }}
          tickLine={{ stroke: "#e8eaf6" }}
          label={{
            value: "Temperature (°C)",
            angle: -90,
            position: "insideLeft",
            fill: "#e8eaf6"
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

        {/* Temperature Line */}
        <Line
          type="monotone"
          dataKey="temperature"
          stroke="#ff6b6b"
          strokeWidth={3}
          dot={{
            r: 5,
            fill: "#ff6b6b",
            strokeWidth: 0
          }}
          activeDot={{
            r: 7
          }}
        />
      </LineChart>
    </div>
  );
}
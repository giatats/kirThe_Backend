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

  // Dynamic Y-axis padding
  const temps = chartData.map(d => d.temperature);

  const minTemp = Math.min(...temps) - 1;
  const maxTemp = Math.max(...temps) + 1;

  return (
    <div
      style={{
        width: "100%",
        background: "rgba(255,255,255,0.04)",
        borderRadius: "20px",
        padding: "20px",
        border: "1px solid rgba(255,255,255,0.08)",
        marginTop: "20px",
        display: "flex",
        justifyContent: "center"
      }}
    >
      <LineChart
        width={1000}
        height={400}
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 10,
          bottom: 20
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          opacity={0.15}
        />

        {/* X AXIS = TIME */}
        <XAxis
          dataKey="time"
          stroke="#a0a4b8"
          label={{
            value: "Time",
            position: "insideBottom",
            offset: -10,
            fill: "#a0a4b8"
          }}
        />

        {/* Y AXIS = TEMPERATURE */}
        <YAxis
          stroke="#a0a4b8"
          domain={[minTemp, maxTemp]}
          label={{
            value: "Temperature (°C)",
            angle: -90,
            position: "insideLeft",
            fill: "#a0a4b8"
          }}
        />

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
    </div>
  );
}
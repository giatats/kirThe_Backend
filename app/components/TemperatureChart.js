"use client";

import dynamic from "next/dynamic";

const ResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => mod.ResponsiveContainer),
  { ssr: false }
);

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
    <div style={{
        height: 400,
        background: "red",
        color: "white"
    }}>
        TEST CHART CONTAINER
    </div>
    );
//   return (
//     <div
//       style={{
//         width: "100%",
//         height: "400px",
//         background: "rgba(255,255,255,0.04)",
//         borderRadius: "20px",
//         padding: "20px",
//         border: "1px solid rgba(255,255,255,0.08)",
//         marginTop: "20px"
//       }}
//     >
//       <ResponsiveContainer width="100%" height="100%">
//         <LineChart data={chartData}>
//           <CartesianGrid
//             strokeDasharray="3 3"
//             opacity={0.2}
//           />

//           <XAxis
//             dataKey="time"
//             stroke="#a0a4b8"
//           />

//           <YAxis
//             stroke="#a0a4b8"
//           />

//           <Tooltip />

//           <Line
//             type="monotone"
//             dataKey="temperature"
//             stroke="#ff6b6b"
//             strokeWidth={3}
//             dot={{ r: 4 }}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
}
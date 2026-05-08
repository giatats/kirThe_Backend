"use client";

import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function TemperatureChart({ data }) {
  if (!data || data.length === 0) {
    return null;
  }

  const chartData = useMemo(() => {
    const reversed = [...data].reverse();
    return {
      labels: reversed.map((item) => item.time),
      datasets: [
        {
          label: "Temperature (°C)",
          data: reversed.map((item) => Number(Number(item.temperature).toFixed(1))),
          borderColor: "#ff6b6b",
          backgroundColor: "rgba(255,107,107,0.16)",
          pointBackgroundColor: "#ff6b6b",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 5,
          tension: 0.4,
          fill: true,
          borderWidth: 3
        }
      ]
    };
  }, [data]);

  const temps = chartData.datasets[0].data;
  const minTemp = Math.floor(Math.min(...temps)) - 1;
  const maxTemp = Math.ceil(Math.max(...temps)) + 1;

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.parsed.y} °C`
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Time",
            color: "#e8eaf6",
            font: { size: 13 }
          },
          ticks: {
            color: "#e8eaf6",
            maxRotation: 45,
            minRotation: 45,
            autoSkip: true,
            maxTicksLimit: 8
          },
          grid: {
            color: "rgba(255,255,255,0.08)"
          }
        },
        y: {
          title: {
            display: true,
            text: "Temperature (°C)",
            color: "#e8eaf6",
            font: { size: 13 }
          },
          ticks: {
            color: "#e8eaf6"
          },
          grid: {
            color: "rgba(255,255,255,0.08)"
          },
          min: minTemp,
          max: maxTemp
        }
      }
    }),
    [minTemp, maxTemp]
  );

  return (
    <div
      style={{
        width: "100%",
        height: "460px",
        background: "rgba(255,255,255,0.04)",
        borderRadius: "20px",
        padding: "20px",
        border: "1px solid rgba(255,255,255,0.08)",
        marginTop: "20px",
        minWidth: 0
      }}
    >
      <Line data={chartData} options={options} />
    </div>
  );
}
// src/components/charts/AttendanceChart.jsx

import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const AttendanceChart = ({ data }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data) return;

    const ctx = canvasRef.current.getContext("2d");

    // Destroy old chart instance on re-render
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Gradient background for bars
    const gradient = ctx.createLinearGradient(0, 0, 0, 260);
    gradient.addColorStop(0, "rgba(56, 189, 248, 0.9)");   // sky-400
    gradient.addColorStop(1, "rgba(37, 99, 235, 0.15)");   // blue-600 (light)

    const labels = data.labels || [];
    const values = data.values || [];

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Check-ins",
            data: values,
            backgroundColor: gradient,
            borderColor: "rgba(37, 99, 235, 0.8)",
            borderWidth: 1,
            borderRadius: 8,
            maxBarThickness: 28,
            hoverBackgroundColor: "rgba(56, 189, 248, 1)",
            hoverBorderColor: "rgba(37, 99, 235, 1)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, // let parent div control height
        layout: {
          padding: {
            top: 16,
            right: 16,
            left: 8,
            bottom: 8,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(15, 23, 42, 0.9)", // slate-900
            titleFont: {
              size: 12,
              family: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              weight: "600",
            },
            bodyFont: {
              size: 12,
              family: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            },
            padding: 10,
            cornerRadius: 6,
            displayColors: false,
            callbacks: {
              label: (context) => {
                const value = context.parsed.y ?? 0;
                return `${value} check-in${value === 1 ? "" : "s"}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 11,
                family:
                  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              },
              color: "#6b7280", // gray-500
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(148, 163, 184, 0.2)", // gray-400/20
              drawBorder: false,
            },
            ticks: {
              stepSize: 1,
              font: {
                size: 11,
                family:
                  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              },
              color: "#6b7280",
            },
          },
        },
        animation: {
          duration: 600,
          easing: "easeOutQuart",
        },
      },
    });

    // Cleanup on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data]);

  return (
    <div
      style={{
        width: "100%",
        height: "260px",
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default AttendanceChart;

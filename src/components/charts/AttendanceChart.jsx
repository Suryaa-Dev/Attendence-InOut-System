// src/components/charts/AttendanceChart.jsx

import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const AttendanceChart = ({ data }) => {
  const canvasRef = useRef(null);
  let chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy(); // destroy previous chart instance
    }

    chartInstance.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Check-ins",
            data: data.values,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 },
          },
        },
      },
    });
  }, [data]);

  return <canvas ref={canvasRef} height="120px"></canvas>;
};

export default AttendanceChart;

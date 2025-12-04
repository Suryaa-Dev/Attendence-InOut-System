// src/pages/user/MyAttendance.jsx

import React, {
  useContext,
  useMemo,
  useState,
  useRef,
  useEffect,
} from "react";
import { AuthContext } from "../../context/AuthContext";
import { AttendanceContext } from "../../context/AttendanceContext";
import Chart from "chart.js/auto";

const getMonthFromISODate = (dateStr) =>
  dateStr ? dateStr.slice(0, 7) : ""; // "YYYY-MM"

const diffHours = (startISO, endISO) => {
  if (!startISO || !endISO) return 0;
  const start = new Date(startISO);
  const end = new Date(endISO);
  const ms = end - start;
  if (ms <= 0 || isNaN(ms)) return 0;
  return ms / (1000 * 60 * 60);
};

const MyAttendance = () => {
  // const { user } = useContext(AuthContext);
  const { user, logout } = useContext(AuthContext);
  const { logs } = useContext(AttendanceContext);

  const [selectedMonth, setSelectedMonth] = useState("");

  // === 1) Filter logs that belong to logged-in user ===
  const myLogs = useMemo(() => {
    if (!user) return [];

    // Prefer stable employee id if available (EMP001, etc.)
    const userKey = user.id || user.email;

    return logs.filter((log) => log.userId === userKey);
  }, [logs, user]);

  // === 2) Apply month filter ===
  const filteredLogs = useMemo(() => {
    const base = myLogs;

    if (!selectedMonth) {
      return [...base].sort(
        (a, b) =>
          new Date(b.checkIn || b.date) - new Date(a.checkIn || a.date)
      );
    }

    return base
      .filter((log) => getMonthFromISODate(log.date) === selectedMonth)
      .sort(
        (a, b) =>
          new Date(b.checkIn || b.date) - new Date(a.checkIn || a.date)
      );
  }, [myLogs, selectedMonth]);

  // === 3) Summary stats ===
  const summary = useMemo(() => {
    const source = filteredLogs.length ? filteredLogs : myLogs;
    if (!source.length) {
      return {
        totalDays: 0,
        totalHours: "0.00",
        averageHours: "0.00",
      };
    }

    const days = new Set(source.map((log) => log.date));
    const totalHoursNum = source.reduce(
      (sum, log) => sum + diffHours(log.checkIn, log.checkOut),
      0
    );
    const avg =
      days.size > 0 ? (totalHoursNum / days.size).toFixed(2) : "0.00";

    return {
      totalDays: days.size,
      totalHours: totalHoursNum.toFixed(2),
      averageHours: avg,
    };
  }, [filteredLogs, myLogs]);

  // === 4) Chart refs & instances ===
  const hoursCanvasRef = useRef(null);
  const statusCanvasRef = useRef(null);
  const hoursChartRef = useRef(null);
  const statusChartRef = useRef(null);

  // === 5) Prepare chart data from filtered logs ===
  const chartData = useMemo(() => {
    // Group by date => total hours
    const map = new Map();

    filteredLogs.forEach((log) => {
      const date = log.date;
      const hours = diffHours(log.checkIn, log.checkOut);
      map.set(date, (map.get(date) || 0) + hours);
    });

    const dates = Array.from(map.keys()).sort(
      (a, b) => new Date(a) - new Date(b)
    );
    const hoursArr = dates.map((d) => Number(map.get(d).toFixed(2)));

    // Status distribution (Completed vs Inside)
    let completed = 0;
    let inside = 0;

    filteredLogs.forEach((log) => {
      if (log.checkIn && log.checkOut) completed += 1;
      else if (log.checkIn && !log.checkOut) inside += 1;
    });

    return {
      dates,
      hoursArr,
      completed,
      inside,
    };
  }, [filteredLogs]);

  // === 6) Build Hours per Day bar chart ===
  useEffect(() => {
    if (!hoursCanvasRef.current) return;

    const ctx = hoursCanvasRef.current.getContext("2d");

    if (hoursChartRef.current) {
      hoursChartRef.current.destroy();
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, 260);
    gradient.addColorStop(0, "rgba(34, 197, 94, 0.9)"); // green-500
    gradient.addColorStop(1, "rgba(22, 163, 74, 0.15)"); // green-600 (light)

    hoursChartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: chartData.dates,
        datasets: [
          {
            label: "Hours Worked",
            data: chartData.hoursArr,
            backgroundColor: gradient,
            borderColor: "rgba(22, 163, 74, 0.9)",
            borderWidth: 1,
            borderRadius: 8,
            maxBarThickness: 30,
            hoverBackgroundColor: "rgba(34, 197, 94, 1)",
            hoverBorderColor: "rgba(22, 163, 74, 1)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: { top: 16, right: 16, bottom: 8, left: 8 },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            padding: 10,
            cornerRadius: 6,
            displayColors: false,
            callbacks: {
              label: (ctx) => `${ctx.parsed.y || 0} hrs`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: {
                size: 11,
                family:
                  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              },
              color: "#6b7280",
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(148, 163, 184, 0.25)",
              drawBorder: false,
            },
            ticks: {
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

    return () => {
      if (hoursChartRef.current) {
        hoursChartRef.current.destroy();
      }
    };
  }, [chartData.dates, chartData.hoursArr]);

  // === 7) Build Completed vs Inside doughnut chart ===
  useEffect(() => {
    if (!statusCanvasRef.current) return;

    const ctx = statusCanvasRef.current.getContext("2d");

    if (statusChartRef.current) {
      statusChartRef.current.destroy();
    }

    const { completed, inside } = chartData;
    // If no logs, avoid weird empty chart – just don't render Chart
    if (completed === 0 && inside === 0) {
      return;
    }

    statusChartRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Completed Days", "Ongoing Days"],
        datasets: [
          {
            data: [completed, inside],
            backgroundColor: [
              "rgba(59, 130, 246, 0.9)", // blue
              "rgba(234, 179, 8, 0.9)", // amber
            ],
            borderColor: [
              "rgba(37, 99, 235, 1)",
              "rgba(202, 138, 4, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        cutout: "65%",
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              font: {
                size: 11,
                family:
                  "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              },
            },
          },
          tooltip: {
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            padding: 8,
            cornerRadius: 6,
            displayColors: false,
          },
        },
        animation: {
          duration: 700,
          easing: "easeOutCubic",
        },
      },
    });

    return () => {
      if (statusChartRef.current) {
        statusChartRef.current.destroy();
      }
    };
  }, [chartData.completed, chartData.inside]);

  return (
    <div className="container py-4">
      {/* Header + month filter */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
  <div>
    <h3>My Attendance</h3>
    <p className="text-muted mb-0">
      Logged in as <strong>{user?.email}</strong>
    </p>
  </div>

  <div className="d-flex align-items-center gap-3">
    {/* Month filter */}
    <div style={{ minWidth: "220px" }}>
      <label className="form-label mb-1">Filter by Month</label>
      <input
        type="month"
        className="form-control"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      />
    </div>

    {/* Logout button */}
    <button
      onClick={() => logout()}
      className="btn btn-outline-danger"
    >
      Logout
    </button>
  </div>
</div>


      {/* Summary cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted mb-1">Total Days Recorded</h6>
              <h3 className="mb-0">{summary.totalDays}</h3>
              <small className="text-muted">
                Based on your attendance logs
              </small>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted mb-1">Total Hours</h6>
              <h3 className="mb-0">{summary.totalHours} hrs</h3>
              <small className="text-muted">
                Across all recorded days
              </small>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted mb-1">Average Hours / Day</h6>
              <h3 className="mb-0">{summary.averageHours} hrs</h3>
              <small className="text-muted">
                Based on unique attendance days
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="row g-3 mb-4">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">Work Hours Trend</h5>
                <small className="text-muted">
                  {selectedMonth
                    ? `For ${selectedMonth}`
                    : "All recorded days"}
                </small>
              </div>
              <div style={{ height: "260px" }}>
                {chartData.dates.length === 0 ? (
                  <div className="d-flex h-100 justify-content-center align-items-center text-muted">
                    No data to display yet.
                  </div>
                ) : (
                  <canvas ref={hoursCanvasRef} />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="mb-2">Day Status</h5>
              <small className="text-muted mb-3">
                Completed vs ongoing days based on your logs
              </small>
              <div style={{ height: "220px" }}>
                {chartData.completed === 0 && chartData.inside === 0 ? (
                  <div className="d-flex h-100 justify-content-center align-items-center text-muted">
                    No records yet.
                  </div>
                ) : (
                  <canvas ref={statusCanvasRef} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5 className="mb-3">Attendance Logs</h5>

          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Total Hours</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No attendance records found.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => {
                    const hours = diffHours(
                      log.checkIn,
                      log.checkOut
                    ).toFixed(2);

                    let statusLabel = "Inside";
                    let statusClass = "bg-warning text-dark";

                    if (!log.checkIn && !log.checkOut) {
                      statusLabel = "No Record";
                      statusClass = "bg-secondary";
                    } else if (log.checkIn && log.checkOut) {
                      statusLabel = "Completed";
                      statusClass = "bg-success";
                    }

                    return (
                      <tr key={log.id}>
                        <td>{log.date}</td>
                        <td>
                          {log.checkIn
                            ? new Date(
                                log.checkIn
                              ).toLocaleTimeString()
                            : "-"}
                        </td>
                        <td>
                          {log.checkOut
                            ? new Date(
                                log.checkOut
                              ).toLocaleTimeString()
                            : "-"}
                        </td>
                        <td>{hours}</td>
                        <td>
                          <span className={`badge ${statusClass}`}>
                            {statusLabel}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAttendance;

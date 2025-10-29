import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";
import "../../styles/Charts.css";

const GrowthChart = React.memo(({ data }) => {
  const { t } = useTranslation();
  const [viewType, setViewType] = React.useState("user");
  const [zoom, setZoom] = React.useState(1);

  const mockData = useMemo(
    () => [
      { month: "Jan", users: 500, cards: 450 },
      { month: "Feb", users: 800, cards: 720 },
      { month: "Mar", users: 1200, cards: 1100 },
      { month: "Apr", users: 1000, cards: 950 },
      { month: "May", users: 1500, cards: 1400 },
      { month: "Jun", users: 1800, cards: 1700 },
      { month: "Jul", users: 2000, cards: 1900 },
      { month: "Aug", users: 2200, cards: 2100 },
      { month: "Sept", users: 2800, cards: 2700 },
    ],
    []
  );

  const chartData = useMemo(
    () => (data && Array.isArray(data) && data.length > 0 ? data : mockData),
    [data, mockData]
  );

  const rawMaxValue = useMemo(
    () =>
      chartData.length > 0
        ? Math.max(
            ...chartData.map((d) =>
              Math.max(Number(d.users) || 0, Number(d.cards) || 0)
            )
          )
        : 0,
    [chartData]
  );

  const maxValue = useMemo(
    () => Math.max(rawMaxValue * zoom, 1),
    [rawMaxValue, zoom]
  );
  const yAxisTick = useMemo(
    () => (maxValue > 0 ? Math.ceil(maxValue / 500) * 500 : 500),
    [maxValue]
  );

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>{t("dashboard.growthDynamics")}</h3>
        <div className="zoom-controls-header">
          <button onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.25))}>
            −
          </button>
          <button onClick={() => setZoom((prev) => Math.min(2, prev + 0.25))}>
            +
          </button>
        </div>
      </div>
      <div className="chart-controls">
        <div className="toggle-buttons">
          <button
            className={`toggle-btn ${viewType === "user" ? "active" : ""}`}
            onClick={() => setViewType("user")}
          >
            <span className="toggle-dot"></span>
            User
          </button>
          <button
            className={`toggle-btn ${viewType === "card" ? "active" : ""}`}
            onClick={() => setViewType("card")}
          >
            <span className="toggle-dot"></span>
            Card
          </button>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fill: "#666", fontSize: 12 }} />
            <YAxis
              domain={[0, yAxisTick]}
              tickCount={6}
              tick={{ fill: "#666", fontSize: 12 }}
              label={{ value: "S", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Bar
              dataKey={viewType === "user" ? "users" : "cards"}
              fill="#4A90E2"
              radius={[8, 8, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

GrowthChart.displayName = "GrowthChart";

export default GrowthChart;

import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../utils/formatting";
import "../../styles/Charts.css";

const RevenueChart = React.memo(({ data }) => {
  const { t } = useTranslation();

  const mockData = useMemo(
    () => [
      { day: "Mon", revenue: 200, fees: 100 },
      { day: "Tue", revenue: 350, fees: 150 },
      { day: "Wed", revenue: 560, fees: 180 },
      { day: "Thu", revenue: 480, fees: 140 },
      { day: "Fri", revenue: 620, fees: 220 },
      { day: "Sat", revenue: 450, fees: 180 },
      { day: "Sun", revenue: 390, fees: 160 },
    ],
    []
  );

  const chartData = useMemo(
    () => (data && Array.isArray(data) && data.length > 0 ? data : mockData),
    [data, mockData]
  );

  const weeklyTotal = useMemo(
    () => chartData.reduce((sum, d) => sum + d.revenue, 0),
    [chartData]
  );
  const trend = 0.2;

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h3>{t("dashboard.revenueFromSales")}</h3>
        </div>
        <div className="dropdown-wrapper">
          <select className="dropdown">
            <option>Days</option>
          </select>
        </div>
      </div>
      <div className="revenue-value">
        <p className="earned-label">{t("dashboard.earnedThisWeek")}</p>
        <span className="value">{formatCurrency(weeklyTotal)}</span>
        <span className="trend">
          <span className="trend-icon">↑</span>
          {t("dashboard.comparedTo", { percentage: trend })}
        </span>
      </div>
      <div style={{ flex: 1, minHeight: 0, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis
              domain={[0, 800]}
              tickCount={5}
              label={{ value: "S", angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              formatter={(value) => formatCurrency(value)}
              labelFormatter={(label) => label}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#4A90E2"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="fees"
              stroke="#9B59B6"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

RevenueChart.displayName = "RevenueChart";

export default RevenueChart;

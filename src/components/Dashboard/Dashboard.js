import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchDashboardMetrics,
  fetchTopTransactions,
  fetchGrowthDynamics,
  fetchRevenueData,
  fetchWithdrawalHistory,
  selectDashboard,
} from "../../store/slices/dashboardSlice";
import { selectAuth } from "../../store/slices/authSlice";
import { SCOPES } from "../../utils/scopes";
import Header from "./Header";
import MetricCard from "./MetricCard";
import TopTransactions from "./TopTransactions";
import GrowthChart from "./GrowthChart";
import RevenueChart from "./RevenueChart";
import WithdrawalHistory from "./WithdrawalHistory";
import AccessWrapper from "../AccessWrapper";
import DateRangePicker from "../DateRangePicker";
import { useTranslation } from "react-i18next";
import updateIcon from "../../assets/icons/update.svg";
import "../../styles/Dashboard.css";

const Dashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  useSelector(selectAuth);
  const {
    metrics,
    topTransactions,
    growthData,
    revenueData,
    withdrawalHistory,
    lastUpdated,
    isLoadingMetrics,
    isLoadingTopTransactions,
    isLoadingGrowth,
    isLoadingRevenue,
    isLoadingWithdrawals,
    errorMetrics,
    errorTopTransactions,
    errorGrowth,
    errorRevenue,
    errorWithdrawals,
  } = useSelector(selectDashboard);

  // Helper functions defined first - memoized with useCallback
  const formatDate = useCallback((date) => {
    if (!date) return "";
    const d = new Date(date);
    const month = d.toLocaleDateString("en-US", { month: "short" });
    const day = d.getDate();
    return `${day} ${month.toLowerCase()}`;
  }, []);

  const formatTime = useCallback((date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }, []);

  const formatDateRangeDisplay = useCallback((startDate, endDate) => {
    if (!startDate || !endDate) return "";
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startMonth = start.toLocaleDateString("en-US", { month: "short" });
    const endMonth = end.toLocaleDateString("en-US", { month: "short" });
    const startDay = start.getDate();
    const endDay = end.getDate();

    if (startMonth === endMonth) {
      return `${startDay} - ${endDay} ${startMonth.toLowerCase()}`;
    } else {
      return `${startDay} ${startMonth.toLowerCase()} - ${endDay} ${endMonth.toLowerCase()}`;
    }
  }, []);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [dateDisplayValue, setDateDisplayValue] = useState(
    `${formatDate(currentTime)}, ${formatTime(currentTime)}`
  );

  useEffect(() => {
    if (metrics === null) {
      dispatch(fetchDashboardMetrics());
      dispatch(fetchTopTransactions());
      dispatch(fetchGrowthDynamics());
      dispatch(fetchRevenueData());
      dispatch(fetchWithdrawalHistory());
    }
  }, [dispatch, metrics]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const mockMetrics = useMemo(
    () => ({
      totalUsers: 1758,
      totalCards: 986,
      averageProfit: 2542,
      totalTransactions: 2156,
      totalTransactionAmount: 68547.0,
      revenue: 6854.7,
    }),
    []
  );

  const mockTopTransactions = useMemo(
    () => [
      { userId: "User_123456", transactionCount: 213, totalAmount: 11594.0 },
      { userId: "User_123457", transactionCount: 200, totalAmount: 10493.26 },
      { userId: "User_146894", transactionCount: 190, totalAmount: 9395.98 },
      { userId: "User_134695", transactionCount: 145, totalAmount: 7158.47 },
      { userId: "User_796431", transactionCount: 136, totalAmount: 6158.32 },
    ],
    []
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        dispatch(fetchDashboardMetrics()),
        dispatch(fetchTopTransactions()),
        dispatch(fetchGrowthDynamics()),
        dispatch(fetchRevenueData()),
        dispatch(fetchWithdrawalHistory()),
      ]);
    } catch (error) {
      // Error handled
    } finally {
      setIsRefreshing(false);
    }
  }, [dispatch]);

  const getTimeAgo = useCallback(() => {
    if (!lastUpdated) return t("common.minutesAgo", { count: 2 });
    const diff = Math.floor((new Date() - new Date(lastUpdated)) / 60000);
    return diff === 0
      ? t("common.justNow")
      : t("common.minutesAgo", { count: diff });
  }, [lastUpdated, t]);

  const data = useMemo(() => metrics || mockMetrics, [metrics, mockMetrics]);
  const topTrans = useMemo(
    () => (topTransactions.length > 0 ? topTransactions : mockTopTransactions),
    [topTransactions, mockTopTransactions]
  );

  const handleDateRangeChange = useCallback(
    (range) => {
      setDateRange(range);
      if (range.startDate && range.endDate) {
        setDateDisplayValue(
          formatDateRangeDisplay(range.startDate, range.endDate)
        );
      }
    },
    [formatDateRangeDisplay]
  );

  const handleDisplayValueChange = useCallback((value) => {
    if (value) {
      setDateDisplayValue(value);
    }
  }, []);

  const dateDisplay = useMemo(
    () =>
      dateRange.startDate && dateRange.endDate
        ? `${dateDisplayValue}, ${formatTime(currentTime)}`
        : `${dateDisplayValue}, ${formatTime(currentTime)}`,
    [
      dateRange.startDate,
      dateRange.endDate,
      dateDisplayValue,
      currentTime,
      formatTime,
    ]
  );

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="dashboard-content">
          <div className="dashboard-header-info">
            <h1 className="dashboard-title">{t("dashboard.title")}</h1>
            <div className="dashboard-meta">
              <div className="refresh-container">
                <img src={updateIcon} alt="Update" className="refresh-icon" />
                <button
                  className="refresh-info"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  {isRefreshing
                    ? t("common.refreshing")
                    : t("common.lastUpdated", { time: getTimeAgo() })}
                </button>
              </div>
              <DateRangePicker
                onChange={handleDateRangeChange}
                onDisplayValueChange={handleDisplayValueChange}
                displayValue={dateDisplay}
              />
            </div>
          </div>

          {/* 6 Metrics + Top 5 Transactions */}
          <div className="top-row-grid">
            <AccessWrapper
              scopesRequired={[SCOPES.VIEW_DASHBOARD]}
              isLoading={isLoadingMetrics}
              error={errorMetrics}
            >
              <div className="metrics-grid">
                <MetricCard
                  title={t("dashboard.totalUsers")}
                  value={data.totalUsers}
                  trend="0.2"
                  showArrow
                  titleSize="14"
                />
                <MetricCard
                  title={t("dashboard.totalCards")}
                  value={data.totalCards}
                  subtitle="Total number of cards issued to users"
                  showArrow
                  showIndicator
                />
                <MetricCard
                  title={t("dashboard.averageProfit")}
                  value={data.averageProfit}
                  trend="0.1"
                />
                <MetricCard
                  title={t("dashboard.totalTransactions")}
                  value={data.totalTransactions}
                  trend="0.1"
                />
                <MetricCard
                  title={t("dashboard.totalTransactionAmount")}
                  value={data.totalTransactionAmount}
                  trend="0.2"
                />
                <MetricCard
                  title={t("dashboard.revenue")}
                  value={data.revenue}
                  description={t("dashboard.revenueDescription")}
                  highlighted={true}
                />
              </div>
            </AccessWrapper>
            <AccessWrapper
              scopesRequired={[SCOPES.VIEW_DASHBOARD]}
              isLoading={isLoadingTopTransactions}
              error={errorTopTransactions}
            >
              <TopTransactions transactions={topTrans} />
            </AccessWrapper>
          </div>

          {/* Row 3: Charts and Table - 3 Columns */}
          <div className="charts-section">
            <AccessWrapper
              scopesRequired={[SCOPES.VIEW_DASHBOARD]}
              isLoading={isLoadingGrowth}
              error={errorGrowth}
            >
              <GrowthChart data={growthData} />
            </AccessWrapper>

            <AccessWrapper
              scopesRequired={[SCOPES.VIEW_DASHBOARD]}
              isLoading={isLoadingRevenue}
              error={errorRevenue}
            >
              <RevenueChart data={revenueData} />
            </AccessWrapper>

            <AccessWrapper
              scopesRequired={[SCOPES.VIEW_WITHDRAWALS]}
              isLoading={isLoadingWithdrawals}
              error={errorWithdrawals}
            >
              <WithdrawalHistory withdrawals={withdrawalHistory} />
            </AccessWrapper>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

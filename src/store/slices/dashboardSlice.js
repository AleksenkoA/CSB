import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchDashboardMetrics = createAsyncThunk(
  "dashboard/fetchMetrics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/dashboard/summary");
      const data = response.data;
      return {
        totalUsers: data.users_total || data.users?.total,
        totalCards: data.cards_issued || data.cards?.issued,
        averageProfit: data.avg_profit_per_client || data.profit?.average,
        totalTransactions: data.tx_total || data.transactions?.total,
        totalTransactionAmount:
          data.tx_amount_total || data.transactions?.amount,
        revenue: data.revenue_total || data.revenue,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchGrowthDynamics = createAsyncThunk(
  "dashboard/fetchGrowthDynamics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/dashboard/user-card-dynamics");
      let users = [];
      let cards = [];

      // Handle different response structures
      if (response.data?.data) {
        users = response.data.data.users || [];
        cards = response.data.data.cards || [];
      } else if (response.data?.users && response.data?.cards) {
        users = Array.isArray(response.data.users) ? response.data.users : [];
        cards = Array.isArray(response.data.cards) ? response.data.cards : [];
      } else if (Array.isArray(response.data)) {
        const dataArray = response.data;
        users =
          dataArray.filter(
            (item) => item.type === "user" || item.dataKey === "users"
          ) || [];
        cards =
          dataArray.filter(
            (item) => item.type === "card" || item.dataKey === "cards"
          ) || [];
      }

      // Ensure we have arrays
      if (!Array.isArray(users)) users = [];
      if (!Array.isArray(cards)) cards = [];

      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ];
      const chartData = [];

      const maxLength = Math.max(users.length, cards.length);
      for (let i = 0; i < maxLength; i++) {
        const userPoint = users[i];
        const cardPoint = cards[i];

        let userDate = userPoint?.x || userPoint?.date || userPoint?.[0];
        let userValue = userPoint?.y || userPoint?.value || userPoint?.[1] || 0;

        let cardDate = cardPoint?.x || cardPoint?.date || cardPoint?.[0];
        let cardValue = cardPoint?.y || cardPoint?.value || cardPoint?.[1] || 0;

        // Use the date that exists, or current date as fallback
        const date = new Date(userDate || cardDate || Date.now());
        const monthIndex = date.getMonth();
        const monthName = monthNames[monthIndex] || "Jan";

        chartData.push({
          month: monthName,
          users: Number(userValue) || 0,
          cards: Number(cardValue) || 0,
        });
      }

      return chartData.length > 0 ? chartData : null;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchRevenueData = createAsyncThunk(
  "dashboard/fetchRevenue",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/dashboard/revenue-from-card-sales");
      let data = [];

      if (response.data.data && Array.isArray(response.data.data)) {
        data = response.data.data;
      } else if (Array.isArray(response.data)) {
        data = response.data;
      } else if (
        response.data.revenue &&
        Array.isArray(response.data.revenue)
      ) {
        data = response.data.revenue;
      }

      const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const chartData = data.slice(-7).map((item, index) => {
        const dateValue = item.x || item.date || item[0] || new Date();
        const amount = item.y || item.amount || item.value || item[1] || 0;

        const date = new Date(dateValue);
        let dayIndex = date.getDay();
        const dayName =
          dayNames[dayIndex] || dayNames[index % 7] || dayNames[0];

        return {
          day: dayName,
          revenue: Number(amount) || 0,
          fees: Math.round((Number(amount) || 0) * 0.25),
        };
      });

      return chartData.length > 0 ? chartData : null;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchWithdrawalHistory = createAsyncThunk(
  "dashboard/fetchWithdrawalHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/dashboard/withdrawals-history");
      const withdrawals = response.data.data || [];

      return withdrawals.map((item) => ({
        date: item.date,
        amount: item.amount || 0,
        status: item.status || "Successfully",
      }));
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTopTransactions = createAsyncThunk(
  "dashboard/fetchTopTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/dashboard/summary");
      const topTrans =
        response.data.top_transactions || response.data.topTransactions || [];

      return topTrans.map((item) => ({
        userId:
          item.user?.id ||
          `User_${item.user?.username || item.user?.email || "unknown"}`,
        transactionCount: item.tx_count || item.transactionCount || 0,
        totalAmount: item.amount || item.totalAmount || 0,
      }));
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    metrics: null,
    topTransactions: [],
    growthData: null,
    revenueData: null,
    withdrawalHistory: [],
    isLoading: false,
    isLoadingMetrics: false,
    isLoadingTopTransactions: false,
    isLoadingGrowth: false,
    isLoadingRevenue: false,
    isLoadingWithdrawals: false,
    errorMetrics: null,
    errorTopTransactions: null,
    errorGrowth: null,
    errorRevenue: null,
    errorWithdrawals: null,
    error: null,
    lastUpdated: null,
  },
  reducers: {
    setLastUpdated: (state) => {
      state.lastUpdated = new Date();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardMetrics.pending, (state) => {
        state.isLoading = true;
        state.isLoadingMetrics = true;
        state.errorMetrics = null;
        state.error = null;
      })
      .addCase(fetchDashboardMetrics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoadingMetrics = false;
        state.metrics = action.payload;
        state.lastUpdated = new Date();
      })
      .addCase(fetchDashboardMetrics.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoadingMetrics = false;
        state.errorMetrics = action.payload;
        state.error = action.payload;
      })
      .addCase(fetchTopTransactions.pending, (state) => {
        state.isLoading = true;
        state.isLoadingTopTransactions = true;
        state.errorTopTransactions = null;
      })
      .addCase(fetchTopTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoadingTopTransactions = false;
        state.topTransactions = action.payload;
      })
      .addCase(fetchTopTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoadingTopTransactions = false;
        state.errorTopTransactions = action.payload;
      })
      .addCase(fetchGrowthDynamics.pending, (state) => {
        state.isLoading = true;
        state.isLoadingGrowth = true;
        state.errorGrowth = null;
      })
      .addCase(fetchGrowthDynamics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoadingGrowth = false;
        state.growthData = action.payload;
      })
      .addCase(fetchGrowthDynamics.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoadingGrowth = false;
        state.errorGrowth = action.payload;
      })
      .addCase(fetchRevenueData.pending, (state) => {
        state.isLoading = true;
        state.isLoadingRevenue = true;
        state.errorRevenue = null;
      })
      .addCase(fetchRevenueData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoadingRevenue = false;
        state.revenueData = action.payload;
      })
      .addCase(fetchRevenueData.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoadingRevenue = false;
        state.errorRevenue = action.payload;
      })
      .addCase(fetchWithdrawalHistory.pending, (state) => {
        state.isLoading = true;
        state.isLoadingWithdrawals = true;
        state.errorWithdrawals = null;
      })
      .addCase(fetchWithdrawalHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoadingWithdrawals = false;
        state.withdrawalHistory = action.payload;
      })
      .addCase(fetchWithdrawalHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoadingWithdrawals = false;
        state.errorWithdrawals = action.payload;
      });
  },
});

export const { setLastUpdated, clearError } = dashboardSlice.actions;

export const selectDashboard = (state) => state.dashboard;

export default dashboardSlice.reducer;

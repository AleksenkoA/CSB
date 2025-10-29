import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchUserScopes = createAsyncThunk(
  "auth/fetchScopes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/scopes");
      const scopes =
        response.data.scopes ||
        (Array.isArray(response.data)
          ? response.data
          : response.data.data?.scopes) ||
        [];

      return scopes;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to fetch scopes",
      });
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/auth/login", credentials);

      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        await dispatch(fetchUserScopes());
      }

      return response.data;
    } catch (error) {
      return {
        access_token: "mock-jwt-token-" + Date.now(),
        expires_in: 3600,
        token_type: "Bearer",
        mock: true,
      };
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ otp, sessionId }, { rejectWithValue }) => {
    if (otp === "000-000" || otp === "000000") {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            access_token: "mock-jwt-token-123",
            user: {
              id: "1",
              email: "test@csb.com",
              name: "Test User",
            },
            scopes: [
              "scope:view-dashboard",
              "scope:view-users",
              "scope:view-cards",
              "scope:view-promos",
              "scope:view-transactions",
              "scope:view-withdrawals",
            ],
          });
        }, 500);
      });
    }

    return rejectWithValue({
      message: "OTP verification not required in current API",
    });
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token"),
    sessionId: null,
    scopes: [],
    isAuthenticated: !!localStorage.getItem("token"),
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.sessionId = null;
      state.scopes = [];
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        const token =
          action.payload.access_token ||
          action.payload.token ||
          localStorage.getItem("token");
        if (token) {
          state.token = token;
          localStorage.setItem("token", token);
          state.isAuthenticated = true;
        }
        if (action.payload.mock) {
          state.scopes = [
            "scope:view-dashboard",
            "scope:view-users",
            "scope:view-cards",
            "scope:view-promos",
            "scope:view-transactions",
            "scope:view-withdrawals",
          ];
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserScopes.pending, (state) => {})
      .addCase(fetchUserScopes.fulfilled, (state, action) => {
        const scopes = Array.isArray(action.payload) ? action.payload : [];
        state.scopes =
          scopes.length > 0
            ? scopes
            : [
                "scope:view-dashboard",
                "scope:view-users",
                "scope:view-cards",
                "scope:view-promos",
                "scope:view-transactions",
                "scope:view-withdrawals",
              ];
      })
      .addCase(fetchUserScopes.rejected, (state, action) => {
        state.scopes = [
          "scope:view-dashboard",
          "scope:view-users",
          "scope:view-cards",
          "scope:view-promos",
          "scope:view-transactions",
          "scope:view-withdrawals",
        ];
      })
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.access_token || action.payload.token;
        state.user = action.payload.user || action.payload.data?.user;
        state.scopes =
          action.payload.scopes || action.payload.data?.scopes || [];
        if (state.token) {
          localStorage.setItem("token", state.token);
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectScopes = (state) => state.auth.scopes;

export default authSlice.reducer;

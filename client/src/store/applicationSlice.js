
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/axios.js";

export const fetchApplications = createAsyncThunk(
  "applications/fetchAll",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/applications", {
        params: filters,
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load applications"
      );
    }
  }
);

export const fetchDashboardStats = createAsyncThunk(
  "applications/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/dashboard/stats");
      return data.stats;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to load dashboard statistics"
      );
    }
  }
);

export const createApplication = createAsyncThunk(
  "applications/create",
  async (applicationData, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        "/applications",
        applicationData
      );

      return data.application;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create application"
      );
    }
  }
);

export const updateApplication = createAsyncThunk(
  "applications/update",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(
        `/applications/${id}`,
        updates
      );

      return data.application;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update application"
      );
    }
  }
);

export const deleteApplication = createAsyncThunk(
  "applications/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/applications/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete application"
      );
    }
  }
);

const applicationSlice = createSlice({
  name: "applications",

  initialState: {
    items: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
    stats: null,
    loading: false,
    statsLoading: false,
    error: null,
  },

  reducers: {
    clearApplicationError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch applications
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.applications;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to load applications";
      })

      // Fetch dashboard statistics
      .addCase(fetchDashboardStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error =
          action.payload || "Failed to load statistics";
      })

      // Create application
      .addCase(createApplication.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.pagination.total += 1;
      })

      // Update application
      .addCase(updateApplication.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item._id === action.payload._id
            ? action.payload
            : item
        );
      })

      // Delete application
      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item._id !== action.payload
        );

        state.pagination.total = Math.max(
          0,
          state.pagination.total - 1
        );
      });
  },
});

export const { clearApplicationError } = applicationSlice.actions;

export default applicationSlice.reducer;

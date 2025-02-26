import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import httpClient from "../../helpers/http-client";

// Async thunk to create an allocation
export const createAllocation = createAsyncThunk(
  "allocation/createAllocation",
  async (allocationData, { rejectWithValue }) => {
    try {
      const response = await httpClient.post("/allocations", allocationData);
      return response.data.allocation;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Async thunk to get allocations by item
export const getAllocationsByItem = createAsyncThunk(
  "allocation/getAllocationsByItem",
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await httpClient.get(`/allocations/item/${itemId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Async thunk to get allocations by participant
export const getAllocationsByParticipant = createAsyncThunk(
  "allocation/getAllocationsByParticipant",
  async (participantId, { rejectWithValue }) => {
    try {
      const response = await httpClient.get(
        `/allocations/participant/${participantId}`
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Async thunk to update an allocation
export const updateAllocation = createAsyncThunk(
  "allocation/updateAllocation",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      await httpClient.put(`/allocations/${id}`, updateData);
      return { id, updateData };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Async thunk to delete an allocation
export const deleteAllocation = createAsyncThunk(
  "allocation/deleteAllocation",
  async (id, { rejectWithValue }) => {
    try {
      await httpClient.delete(`/allocations/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const allocationSlice = createSlice({
  name: "allocation",
  initialState: {
    allocations: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAllocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAllocation.fulfilled, (state, action) => {
        state.loading = false;
        state.allocations.push(action.payload);
      })
      .addCase(createAllocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || action.error.message;
      })
      .addCase(getAllocationsByItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllocationsByItem.fulfilled, (state, action) => {
        state.loading = false;
        // You can choose to store by item or merge with overall allocation state
        state.allocations = action.payload;
      })
      .addCase(getAllocationsByItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || action.error.message;
      })
      .addCase(getAllocationsByParticipant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllocationsByParticipant.fulfilled, (state, action) => {
        state.loading = false;
        state.allocations = action.payload;
      })
      .addCase(getAllocationsByParticipant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || action.error.message;
      })
      .addCase(updateAllocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAllocation.fulfilled, (state, action) => {
        state.loading = false;

        // Optionally update allocation in state
        state.error = action.payload.message || action.error.message;
      })
      .addCase(updateAllocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || action.error.message;
      })
      .addCase(deleteAllocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAllocation.fulfilled, (state, action) => {
        state.loading = false;
        state.allocations = state.allocations.filter(
          (alloc) => alloc.id !== action.payload
        );
      })
      .addCase(deleteAllocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || action.error.message;
      });
  },
});

export default allocationSlice.reducer;

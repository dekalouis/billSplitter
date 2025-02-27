import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import httpClient from "../../helpers/http-client";

export const createAllocation = createAsyncThunk(
  "allocation/createAllocation",
  async ({ itemId, participantId }, { rejectWithValue }) => {
    try {
      const payload = {
        ItemId: itemId,
        ParticipantId: participantId,
      };
      // console.log("Allocation payloadNYAAAA:", payload);
      const response = await httpClient.post("/allocations", payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to allocate item");
    }
  }
);

export const getAllocationsByBill = createAsyncThunk(
  "allocation/getAllocationsByBill",
  async (billId, { rejectWithValue }) => {
    try {
      const response = await httpClient.get(`/allocations/bill/${billId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch allocations"
      );
    }
  }
);

export const deleteAllocation = createAsyncThunk(
  "allocation/deleteAllocation",
  async (id, thunkAPI) => {
    try {
      await httpClient.delete(`/allocations/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
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
        state.error = action.payload;
      })

      .addCase(getAllocationsByBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllocationsByBill.fulfilled, (state, action) => {
        state.loading = false;
        state.allocations = action.payload.allocations;
      })
      .addCase(getAllocationsByBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
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
        state.error = action.payload;
      });
  },
});

export default allocationSlice.reducer;

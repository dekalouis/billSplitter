import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import httpClient from "../../helpers/http-client";

// Async thunk to create a participant
export const createParticipant = createAsyncThunk(
  "participant/createParticipant",
  async (participantData, { rejectWithValue }) => {
    try {
      const response = await httpClient.post("/participants", participantData);
      return response.data.participant;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Async thunk to get participants by BillId
export const getParticipantsByBill = createAsyncThunk(
  "participant/getParticipantsByBill",
  async (billId, { rejectWithValue }) => {
    try {
      const response = await httpClient.get(`/participants/bill/${billId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Async thunk to update a participant
export const updateParticipant = createAsyncThunk(
  "participant/updateParticipant",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      await httpClient.put(`/participants/${id}`, updateData);
      return { id, updateData };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Async thunk to delete a participant
export const deleteParticipant = createAsyncThunk(
  "participant/deleteParticipant",
  async (id, { rejectWithValue }) => {
    try {
      await httpClient.delete(`/participants/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const participantSlice = createSlice({
  name: "participant",
  initialState: {
    participants: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createParticipant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createParticipant.fulfilled, (state, action) => {
        state.loading = false;
        state.participants.push(action.payload);
      })
      .addCase(createParticipant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || action.error.message;
      })
      .addCase(getParticipantsByBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getParticipantsByBill.fulfilled, (state, action) => {
        state.loading = false;
        state.participants = action.payload;
      })
      .addCase(getParticipantsByBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || action.error.message;
      })
      .addCase(updateParticipant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateParticipant.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update the participant in state.participants here.
      })
      .addCase(updateParticipant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || action.error.message;
      })
      .addCase(deleteParticipant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteParticipant.fulfilled, (state, action) => {
        state.loading = false;
        state.participants = state.participants.filter(
          (p) => p.id !== action.payload
        );
      })
      .addCase(deleteParticipant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || action.error.message;
      });
  },
});

export default participantSlice.reducer;

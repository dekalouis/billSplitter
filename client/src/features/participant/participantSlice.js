import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import httpClient from "../../helpers/http-client";

export const createParticipant = createAsyncThunk(
  "participant/createParticipant",
  async ({ BillId, name }, { rejectWithValue }) => {
    try {
      const response = await httpClient.post("/participants", { BillId, name });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to create participant"
      );
    }
  }
);

export const getParticipantsByBill = createAsyncThunk(
  "participant/getParticipantsByBill",
  async (BillId, { rejectWithValue }) => {
    try {
      const response = await httpClient.get(`/participants/bill/${BillId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch participants"
      );
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
        state.participants.push(action.payload); // Ensure new participants are added
        // console.log(action.payload, `-----`, "PAYLOADNYA");
      })
      .addCase(createParticipant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getParticipantsByBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getParticipantsByBill.fulfilled, (state, action) => {
        state.loading = false;
        state.participants = action.payload.participants;
      })
      .addCase(getParticipantsByBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default participantSlice.reducer;

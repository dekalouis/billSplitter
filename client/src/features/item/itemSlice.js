import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import httpClient from "../../helpers/http-client";

export const createItem = createAsyncThunk(
  "item/createItem",
  async (itemData, { rejectWithValue }) => {
    try {
      const response = await httpClient.post("/items", itemData);
      return response.data.item;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getItemsByBill = createAsyncThunk(
  "item/getItemsByBill",
  async (billId, { rejectWithValue }) => {
    try {
      const response = await httpClient.get(`/items/bill/${billId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateItem = createAsyncThunk(
  "item/updateItem",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      await httpClient.put(`/items/${id}`, updateData);
      return { id, updateData };
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteItem = createAsyncThunk(
  "item/deleteItem",
  async (id, { rejectWithValue }) => {
    try {
      await httpClient.delete(`/items/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const itemSlice = createSlice({
  name: "item",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || action.error.message;
      })
      .addCase(getItemsByBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getItemsByBill.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getItemsByBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || action.error.message;
      })
      .addCase(updateItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateItem.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || action.error.message;
      })
      .addCase(deleteItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || action.error.message;
      });
  },
});

export default itemSlice.reducer;

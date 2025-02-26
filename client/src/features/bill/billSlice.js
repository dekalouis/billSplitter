import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import httpClient from "../../helpers/http-client";

export const createBill = createAsyncThunk(
  "bill/createBill",
  async (billData, { rejectWithValue }) => {
    try {
      const response = await httpClient.post("/bills/add-bill", billData);
      return response.data.bill; // assume the response structure from API doc
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const getBillsByUser = createAsyncThunk(
  "bill/getBillsByUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await httpClient.get(`/bills`);
      // console.log("API ResponseNYA:", response.data);
      return response.data.bills;
    } catch (err) {
      // console.error("ERRORNUA", err.response?.data || err.message);
      return rejectWithValue(err.response.data);
    }
  }
);

export const getBillById = createAsyncThunk(
  "bill/getBillById",
  async (billId, { rejectWithValue }) => {
    try {
      const response = await httpClient.get(`/bills/${billId}`);
      return response.data.bill;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Async thunk to update a bill
// export const updateBill = createAsyncThunk(
//   "bill/updateBill",
//   async ({ billId, updateData }, { rejectWithValue }) => {
//     try {
//       const response = await httpClient.put(`/bills/${billId}`, updateData);
//       return { billId, updateData };
//     } catch (err) {
//       return rejectWithValue(err.response.data);
//     }
//   }
// );

export const deleteBill = createAsyncThunk(
  "bill/deleteBill",
  async (billId, { rejectWithValue }) => {
    try {
      await httpClient.delete(`/bills/${billId}`);
      return billId;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const uploadBillImage = createAsyncThunk(
  "bill/uploadBillImage",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await httpClient.post("/bills/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // console.log(response.data);
      // response.data ada imageUrl, rawGPT, and parsed data
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const billSlice = createSlice({
  name: "bill",
  initialState: {
    bills: [],
    currentBill: null,
    uploadData: null,
    loading: false,
    error: null,
  },
  reducers: {
    // setBills: (state, action) => {
    //   state.bills = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder
      // createBill
      .addCase(createBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBill.fulfilled, (state, action) => {
        state.loading = false;
        state.bills.push(action.payload);
      })
      .addCase(createBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || action.error.message;
      })
      // getBillsByUser
      .addCase(getBillsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBillsByUser.fulfilled, (state, action) => {
        state.loading = false;
        // console.log("fetched!!!!", action.payload);

        state.bills = action.payload;
        // console.log("updated:", state.bills);
      })

      .addCase(getBillsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || action.error.message;
      })
      // getBillById
      .addCase(getBillById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBillById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBill = action.payload;
      })
      .addCase(getBillById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || action.error.message;
      })
      // updateBill
      // .addCase(updateBill.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(updateBill.fulfilled, (state, action) => {
      //   state.loading = false;
      //   // update in bills array if needed
      // })
      // .addCase(updateBill.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload.message || action.error.message;
      // })
      // deleteBill
      .addCase(deleteBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBill.fulfilled, (state, action) => {
        state.loading = false;
        state.bills = state.bills.filter((bill) => bill.id !== action.payload);
      })
      .addCase(deleteBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || action.error.message;
      })
      // uploadBillImage
      .addCase(uploadBillImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadBillImage.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadData = action.payload;
      })
      .addCase(uploadBillImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || action.error.message;
      });
  },
});

export const { setBills } = billSlice.actions;
export default billSlice.reducer;

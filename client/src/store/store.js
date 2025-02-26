import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
// import billReducer from "../features/bill/billSlice";
// import itemReducer from "../features/item/itemSlice";
// import participantReducer from "../features/participant/participantSlice";
// import allocationReducer from "../features/allocation/allocationSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    // bill: billReducer,
    // item: itemReducer,
    // participant: participantReducer,
    // allocation: allocationReducer,
  },
});

export default store;

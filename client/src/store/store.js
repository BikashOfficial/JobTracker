
import { configureStore } from "@reduxjs/toolkit";
import applicationReducer from "./applicationSlice.js";

export const store = configureStore({
  reducer: {
    applications: applicationReducer,
  },
});

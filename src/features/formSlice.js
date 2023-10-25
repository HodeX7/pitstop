import { createSlice } from "@reduxjs/toolkit";

export const formSlice = createSlice({
  name: "form",
  initialState: {
    data: {
      name: "",
      ageGroup: "",
      participantsDetails: [],
    },
    playerPayment: null,
    teamPayment: null,
  },

  reducers: {
    update: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { update } = formSlice.actions;

export default formSlice.reducer;

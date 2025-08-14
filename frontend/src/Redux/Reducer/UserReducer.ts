import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserReducerInitalState } from "../../Types/Reducer-types";
import type { User } from "../../Types/type";

const initialState: UserReducerInitalState = {
  user: null,
  loading: true,
};

export const userReducer = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    userExist: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
    },
    userNoExist: (state) => {
      state.loading = false;
      state.user = null;
    },
  },
});

export const { userExist, userNoExist } = userReducer.actions;

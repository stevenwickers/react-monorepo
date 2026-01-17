import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TokenClaims = Record<string, unknown>;

export interface AccountInfo {
  userName: string;
  name: string;
  homeAccountId: string;
  userClaims: TokenClaims | null;
}

interface UserState {
  account: AccountInfo | null;
}

const initialState: UserState = {
  account: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSignedIn: (state, action: PayloadAction<AccountInfo>) => {
      state.account = action.payload;
    },
    setSignedOut: (state) => {
      state.account = null;
    },
  },
});

export const { setSignedIn, setSignedOut } = userSlice.actions;
export default userSlice.reducer;

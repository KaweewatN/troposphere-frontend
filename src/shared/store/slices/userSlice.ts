import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserProfile {
  name: string;
  email: string;
  picture?: string | null;
}

interface UserState {
  profile: UserProfile | null;
  isLoaded: boolean;
}

const initialState: UserState = {
  profile: null,
  isLoaded: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
      state.isLoaded = true;
    },
    clearUserProfile: (state) => {
      state.profile = null;
      state.isLoaded = false;
    },
  },
});

export const { setUserProfile, clearUserProfile } = userSlice.actions;
export default userSlice.reducer;

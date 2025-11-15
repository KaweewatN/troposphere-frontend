import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserMembership {
  user_id: number;
  club_id: number;
  club_name: string;
  role: string;
  joined_at: string;
}

interface UserProfile {
  id: number;
  email: string;
  name: string;
  picture?: string | null;
  global_role: number;
  memberships: UserMembership[];
  created_at: string;
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

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Setting } from "@/types";

export interface SettingsState {
  settings: Setting | null;
  loading: boolean;
}

const initialState: SettingsState = {
  settings: null,
  loading: false,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<Setting | null>) => {
      state.settings = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setSettings, setLoading } = settingsSlice.actions;

export default settingsSlice.reducer;


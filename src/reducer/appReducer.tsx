import {createSlice} from "@reduxjs/toolkit";

export interface AppState {
  activeTabIndex: string;
}

const appSlice = createSlice({
  name: "app",
  initialState: {
    activeTabIndex: '1',
  } as AppState,
  reducers: {
    updateActiveTabIndex: (state, action) => {
      state.activeTabIndex = action.payload;
    },
  }
});

export const appActions = appSlice.actions;
export const appReducer = appSlice.reducer;

export const selectActiveTabIndex = (state: any) => state.app.activeTabIndex as string;
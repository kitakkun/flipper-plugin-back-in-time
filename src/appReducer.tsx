import {NotifyValueChange} from "./events/FlipperIncomingEvents";
import {createSlice} from "@reduxjs/toolkit";

export interface AppState {
  activeTabIndex: number;
  selectedInstanceUUID: string | null;
  selectedPropertyName: string | null;
  selectedPropertyValueChangeLog: NotifyValueChange[];
}

const appSlice = createSlice({
  name: "app",
  initialState: {
    activeTabIndex: 0,
    selectedInstanceUUID: null,
    selectedPropertyName: null,
    selectedPropertyValueChangeLog: [],
  } as AppState,
  reducers: {
    updateActiveTabIndex: (state, action) => {
      state.activeTabIndex = action.payload;
    },
    selectProperty: (state, action) => {
      state.selectedInstanceUUID = action.payload.instanceUUID;
      state.selectedPropertyName = action.payload.propertyName;
    },
  }
});

export const appActions = appSlice.actions;
export const appReducer = appSlice.reducer;

export const selectActiveTabIndex = (state: any) => state.app.activeTabIndex;
export const selectSelectedInstanceUUID = (state: any) => state.app.selectedInstanceUUID as string | null;
export const selectSelectedPropertyName = (state: any) => state.app.selectedPropertyName as string | null;
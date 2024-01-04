import {NotifyValueChange} from "../events/FlipperIncomingEvents";
import {createSlice} from "@reduxjs/toolkit";

export interface AppState {
  activeTabIndex: string;
  selectedInstanceUUID: string | null;
  selectedPropertyName: string | null;
  selectedPropertyValueChangeLog: NotifyValueChange[];
  hideNonDebuggableProperties: boolean;
}

const appSlice = createSlice({
  name: "app",
  initialState: {
    activeTabIndex: '1',
    selectedInstanceUUID: null,
    selectedPropertyName: null,
    selectedPropertyValueChangeLog: [],
    hideNonDebuggableProperties: true,
  } as AppState,
  reducers: {
    updateActiveTabIndex: (state, action) => {
      state.activeTabIndex = action.payload;
    },
    selectProperty: (state, action) => {
      state.selectedInstanceUUID = action.payload.instanceUUID;
      state.selectedPropertyName = action.payload.propertyName;
    },
    hideNonDebuggablePropertiesToggled: (state, action) => {
      state.hideNonDebuggableProperties = action.payload;
    }
  }
});

export const appActions = appSlice.actions;
export const appReducer = appSlice.reducer;

export const selectActiveTabIndex = (state: any) => state.app.activeTabIndex as string;
export const selectSelectedInstanceUUID = (state: any) => state.app.selectedInstanceUUID as string | null;
export const selectSelectedPropertyName = (state: any) => state.app.selectedPropertyName as string | null;
export const selectHideNonDebuggableProperties = (state: any) => state.app.hideNonDebuggableProperties as boolean;
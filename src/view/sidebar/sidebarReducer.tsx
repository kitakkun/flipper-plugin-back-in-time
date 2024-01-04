import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {DebuggableStateHolderInfo, PropertyInfo} from "../../data/RegisterInstance";
import {NotifyValueChange} from "../../events/FlipperIncomingEvents";

export interface PropertyInspectorState {
  selectedInstance: DebuggableStateHolderInfo,
  selectedPropertyInfo: PropertyInfo,
  selectedPropertyValueChangeLog: NotifyValueChange[],
}

export interface SidebarState {
  propertyInspectorState: PropertyInspectorState | null;
}

const initialState: SidebarState = {
  propertyInspectorState: null,
}

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: initialState,
  reducers: {
    openPropertyInspector: (state, action: PayloadAction<PropertyInspectorState>) => {
      state.propertyInspectorState = action.payload;
    }
  }
});

export const sidebarActions = sidebarSlice.actions;
export const sidebarReducer = sidebarSlice.reducer;

export const sideBarStateSelector = (state: any) => state.sidebar as SidebarState;

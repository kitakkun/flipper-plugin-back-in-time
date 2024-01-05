import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface SidebarState {
  instanceUUID: string;
  propertyName: string;
}

const initialState: SidebarState = {
  instanceUUID: "",
  propertyName: "",
}

export interface PropertyInspectorNavArguments {
  instanceUUID: string;
  propertyName: string;
}

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: initialState,
  reducers: {
    openPropertyInspector: (state, action: PayloadAction<PropertyInspectorNavArguments>) => {
      state.instanceUUID = action.payload.instanceUUID;
      state.propertyName = action.payload.propertyName;
    }
  }
});

export const sidebarActions = sidebarSlice.actions;
export const sidebarReducer = sidebarSlice.reducer;

export const sidebarStateSelector = (state: any) => state.sidebar as SidebarState;

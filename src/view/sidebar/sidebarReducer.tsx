import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {DebuggableStateHolderInfo, PropertyInfo} from "../../data/RegisterInstance";
import {MethodCallInfo} from "../../data/MethodCallInfo";

export interface PropertyInspectorState {
  selectedInstance: DebuggableStateHolderInfo,
  selectedPropertyInfo: PropertyInfo,
  selectedPropertyRelevantCalls: MethodCallInfo[],
}

export interface SidebarState {
  propertyInspectorState: PropertyInspectorState | null;
}

const initialState: SidebarState = {
  propertyInspectorState: null,
}

function resetState(sidebarState: SidebarState) {
  sidebarState.propertyInspectorState = null;
}

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: initialState,
  reducers: {
    openPropertyInspector: (state, action: PayloadAction<PropertyInspectorState>) => {
      resetState(state);
      state.propertyInspectorState = action.payload;
    }
  }
});

export const sidebarActions = sidebarSlice.actions;
export const sidebarReducer = sidebarSlice.reducer;

export const sideBarStateSelector = (state: any) => state.sidebar as SidebarState;

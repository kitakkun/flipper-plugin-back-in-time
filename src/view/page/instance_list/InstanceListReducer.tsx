import {createSlice} from "@reduxjs/toolkit";
import {DebuggableStateHolderInfo} from "../../../data/RegisterInstance";
import {flipperActions} from "../../../reducer/flipperReducer";
import {NotifyValueChange} from "../../../events/FlipperIncomingEvents";

export interface InstanceListState {
  instances: DebuggableStateHolderInfo[];
  valueChangedEvents: NotifyValueChange[];
  selectedInstanceUUID: string | null;
  selectedPropertyName: string | null;
  nonDebuggablePropertyVisible: boolean;
}

const initialState: InstanceListState = {
  instances: [],
  valueChangedEvents: [],
  selectedInstanceUUID: null,
  selectedPropertyName: null,
  nonDebuggablePropertyVisible: true,
};

const instanceListSlice = createSlice({
  name: "instanceList",
  initialState: initialState,
  reducers: {
    selectProperty: (state, action) => {
      state.selectedInstanceUUID = action.payload.instanceUUID;
      state.selectedPropertyName = action.payload.propertyName;
    },
    updateNonDebuggablePropertyVisibility: (state, action) => {
      state.nonDebuggablePropertyVisible = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(flipperActions.registerInstance, (state, action) => {
        state.instances.push({...action.payload, alive: true});
      })
      .addCase(flipperActions.updateInstanceAliveStatus, (state, action) => {
        Object.entries(action.payload.isAlive).forEach(([instanceUUID, alive]) => {
          const instance = state.instances.find((info) => info.instanceUUID == instanceUUID);
          if (!instance) return;
          instance.alive = alive;
        });
      })
      .addCase(flipperActions.notifyValueChange, (state, action) => {
        state.valueChangedEvents.push(action.payload);
      });
  }
});

export const instanceListActions = instanceListSlice.actions;
export const instanceListReducer = instanceListSlice.reducer;

export const instanceListStateSelector = (state: any) => state.instanceList as InstanceListState;

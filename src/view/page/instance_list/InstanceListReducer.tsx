import {createSlice} from "@reduxjs/toolkit";
import {DebuggableStateHolderInfo} from "../../../data/RegisterInstance";
import {flipperActions} from "../../../reducer/flipperReducer";
import {MethodCallInfo} from "../../../data/MethodCallInfo";

export interface InstanceListState {
  instances: DebuggableStateHolderInfo[];
  methodCallInfoList: MethodCallInfo[];
}

const initialState: InstanceListState = {
  instances: [],
  methodCallInfoList: [],
};

const instanceListSlice = createSlice({
    name: "instanceList",
    initialState: initialState,
    reducers: {},
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
        .addCase(flipperActions.notifyMethodCall, (state, action) => {
          state.methodCallInfoList.push({
            methodName: action.payload.methodName,
            instanceUUID: action.payload.instanceUUID,
            callUUID: action.payload.methodCallUUID,
            calledAt: action.payload.calledAt,
            valueChanges: [],
          });
        })
        .addCase(flipperActions.notifyValueChange, (state, action) => {
          state.methodCallInfoList.find((event) => event.callUUID == action.payload.methodCallUUID)
            ?.valueChanges
            ?.push({
              propertyName: action.payload.propertyName,
              value: action.payload.value,
            });
        });
    }
  })
;

export const instanceListActions = instanceListSlice.actions;
export const instanceListReducer = instanceListSlice.reducer;

export const instanceListStateSelector = (state: any) => state.instanceList as InstanceListState;

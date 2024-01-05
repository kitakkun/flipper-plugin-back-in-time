import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {DebuggableStateHolderInfo} from "../../../data/RegisterInstance";
import {MethodCallInfo} from "../../../data/MethodCallInfo";

export interface ValueEmitState {
  open: boolean;
  instanceInfo: DebuggableStateHolderInfo | null;
  methodCallInfo: MethodCallInfo | null;
}

const initialState: ValueEmitState = {
  open: false,
  instanceInfo: null,
  methodCallInfo: null,
};

export interface ValueEmitParams {
  instanceInfo: DebuggableStateHolderInfo;
  methodCallInfo: MethodCallInfo;
}

const valueEmitSlice = createSlice({
  name: "valueEmit",
  initialState: initialState,
  reducers: {
    open: (state, action: PayloadAction<ValueEmitParams>) => {
      state.instanceInfo = action.payload.instanceInfo;
      state.methodCallInfo = action.payload.methodCallInfo;
      state.open = true;
    },
    close: (state) => {
      state.open = false;
    }
  },
});

export const valueEmitActions = valueEmitSlice.actions;
export const valueEmitReducer = valueEmitSlice.reducer;

export const valueEmitStateSelector = (state: any) => state.valueEmit as ValueEmitState;

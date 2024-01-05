import {createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {MethodCallInfo} from "../../../data/MethodCallInfo";
import {InstanceInfo} from "../../../data/InstanceInfo";
import {classInfoListSelector} from "../../../reducer/appReducer";
import {ClassInfo} from "../../../data/ClassInfo";

export interface ValueEmitNavArguments {
  instanceInfo: InstanceInfo;
  methodCallInfo: MethodCallInfo;
}

export interface ValueEmitState {
  open: boolean;
  instanceInfo: InstanceInfo | null;
  methodCallInfo: MethodCallInfo | null;
  classInfo: ClassInfo | null;
}

interface ValueEmitReducerState {
  open: boolean;
  instanceInfo: InstanceInfo | null;
  methodCallInfo: MethodCallInfo | null;
}

const initialState: ValueEmitReducerState = {
  open: false,
  instanceInfo: null,
  methodCallInfo: null,
};

const valueEmitSlice = createSlice({
  name: "valueEmit",
  initialState: initialState,
  reducers: {
    open: (state, action: PayloadAction<ValueEmitNavArguments>) => {
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

const selectValueEmitState = (state: any) => state.valueEmit as ValueEmitState;
export const valueEmitStateSelector = createSelector(
  [selectValueEmitState, classInfoListSelector],
  (state, classInfoList) => {
    const classInfo = classInfoList.find((info) => info.name == state.instanceInfo?.className);

    return {
      open: state.open,
      instanceInfo: state.instanceInfo,
      methodCallInfo: state.methodCallInfo,
      classInfo: classInfo,
    } as ValueEmitState;
  }
);

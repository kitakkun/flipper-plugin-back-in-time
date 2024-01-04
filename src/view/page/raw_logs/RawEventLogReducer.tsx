import {createSlice} from "@reduxjs/toolkit";
import {flipperActions} from "../../../reducer/flipperReducer";
import {RawEventLog} from "../../../data/RawEventLog";

export interface RawEventLogState {
  logs: RawEventLog[];
}

const initialState: RawEventLogState = {
  logs: [],
};

const rawEventLogSlice = createSlice({
  name: "rawEventLog",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(flipperActions.registerInstance, (state, action) => {
        state.logs.push({label: "register", payload: action.payload});
      })
      .addCase(flipperActions.updateInstanceAliveStatus, (state, action) => {
          state.logs.push({label: "updateInstanceAliveStatus", payload: action.payload});
        }
      )
      .addCase(flipperActions.notifyValueChange, (state, action) => {
          state.logs.push({label: "notifyValueChange", payload: action.payload});
        }
      )
      .addCase(flipperActions.notifyMethodCall, (state, action) => {
        state.logs.push({label: "notifyMethodCall", payload: action.payload});
      });
  }
});

export const rawEventLogActions = rawEventLogSlice.actions;
export const rawEventLogReducer = rawEventLogSlice.reducer;

export const rawEventLogStateSelector = (state: any) => state.rawEventLog as RawEventLogState;

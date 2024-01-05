import {createSlice} from "@reduxjs/toolkit";
import {appActions} from "../../../reducer/appReducer";
import {RawEventLogState} from "./RawLogView";

const initialState: RawEventLogState = {
  logs: [],
};

const rawEventLogSlice = createSlice({
  name: "rawEventLog",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(appActions.register, (state, action) => {
        state.logs.push({label: "register", payload: action.payload});
      })
      .addCase(appActions.updateInstanceAliveStatuses, (state, action) => {
          state.logs.push({label: "updateInstanceAliveStatus", payload: action.payload});
        }
      )
      .addCase(appActions.registerValueChange, (state, action) => {
          state.logs.push({label: "notifyValueChange", payload: action.payload});
        }
      )
      .addCase(appActions.registerMethodCall, (state, action) => {
        state.logs.push({label: "notifyMethodCall", payload: action.payload});
      });
  }
});

export const rawEventLogActions = rawEventLogSlice.actions;
export const rawEventLogReducer = rawEventLogSlice.reducer;

export const rawEventLogStateSelector = (state: any) => state.rawEventLog as RawEventLogState;

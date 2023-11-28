import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {NotifyMethodCall, NotifyValueChange, RegisterInstance} from "./events/FlipperIncomingEvents";
import {DebuggableStateHolderInfo} from "./data/RegisterInstance";
import {CheckInstanceAliveResponse} from "./events/FlipperOutgoingEvents";
import {RawEventLog} from "./data/RawEventLog";

export type FlipperEvent = {
  registerInstance: DebuggableStateHolderInfo[];
  valueChanges: NotifyValueChange[];
  methodCalls: NotifyMethodCall[];
  rawEvents: RawEventLog[];
}

const initialState: FlipperEvent = {
  registerInstance: [],
  valueChanges: [],
  methodCalls: [],
  rawEvents: [],
}

const flipperEventSlice = createSlice({
  name: 'flipper',
  initialState: initialState,
  reducers: {
    registerInstance: (state, action: PayloadAction<RegisterInstance>) => {
      state.rawEvents.push({label: "register", payload: action.payload});
      state.registerInstance.push({...action.payload, alive: true});
    },
    notifyValueChange: (state, action: PayloadAction<NotifyValueChange>) => {
      state.rawEvents.push({label: "valueChange", payload: action.payload});
      state.valueChanges.push(action.payload);
    },
    notifyMethodCall: (state, action: PayloadAction<NotifyMethodCall>) => {
      state.rawEvents.push({label: "methodCall", payload: action.payload});
      state.methodCalls.push(action.payload);
    },
    updateInstanceAliveStatus: (state, action: PayloadAction<CheckInstanceAliveResponse>) => {
      state.rawEvents.push({label: "checkInstanceAlive", payload: action.payload});
      const response = action.payload
      Object.entries(response.isAlive).forEach(([instanceUUID, alive]) => {
        const instance = state.registerInstance.find((info) => info.instanceUUID == instanceUUID);
        if (!instance) return;
        instance.alive = alive;
      });
    }
  }
});

export const flipperActions = flipperEventSlice.actions;
export const flipperReducer = flipperEventSlice.reducer;

export const selectRegisteredInstances = (state: any) => state.flipper.registerInstance as DebuggableStateHolderInfo[];
export const selectValueChanges = (state: any) => state.flipper.valueChanges as NotifyValueChange[];
export const selectMethodCalls = (state: any) => state.flipper.methodCalls as NotifyMethodCall[];
export const selectRawEvents = (state: any) => state.flipper.rawEvents as RawEventLog[];
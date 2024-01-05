import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {NotifyMethodCall, NotifyValueChange, RegisterInstance} from "../events/FlipperIncomingEvents";
import {DebuggableStateHolderInfo} from "../data/RegisterInstance";
import {CheckInstanceAlive, CheckInstanceAliveResponse, ForceSetPropertyValue} from "../events/FlipperOutgoingEvents";
import {RawEventLog} from "../data/RawEventLog";
import {FlipperPendingEvent} from "../events/FlipperPendingEvent";
import {MethodCallInfo} from "../data/MethodCallInfo";

export type FlipperEvent = {
  registerInstance: DebuggableStateHolderInfo[];
  valueChanges: NotifyValueChange[];
  methodCalls: MethodCallInfo[];
  pendingForceSetPropertyValueEvent: FlipperPendingEvent<ForceSetPropertyValue> | null;
  pendingRefreshInstanceAliveStatusEvent: FlipperPendingEvent<CheckInstanceAlive> | null;
}

const initialState: FlipperEvent = {
  registerInstance: [],
  valueChanges: [],
  methodCalls: [],
  pendingForceSetPropertyValueEvent: null,
  pendingRefreshInstanceAliveStatusEvent: null,
}

const flipperEventSlice = createSlice({
  name: 'flipper',
  initialState: initialState,
  reducers: {
    registerInstance: (state, action: PayloadAction<RegisterInstance>) => {
      state.registerInstance.push({...action.payload, alive: true});
    },
    notifyMethodCall: (state, action: PayloadAction<NotifyMethodCall>) => {
      state.methodCalls.push({
        callUUID: action.payload.methodCallUUID,
        instanceUUID: action.payload.instanceUUID,
        methodName: action.payload.methodName,
        calledAt: action.payload.calledAt,
        valueChanges: [],
      });
    },
    notifyValueChange: (state, action: PayloadAction<NotifyValueChange>) => {
      state.methodCalls
        .find((methodCall) => methodCall.callUUID == action.payload.methodCallUUID)
        ?.valueChanges
        ?.push({propertyName: action.payload.propertyName, value: action.payload.value});
    },
    updateInstanceAliveStatus: (state, action: PayloadAction<CheckInstanceAliveResponse>) => {
      const response = action.payload
      Object.entries(response.isAlive).forEach(([instanceUUID, alive]) => {
        const instance = state.registerInstance.find((info) => info.instanceUUID == instanceUUID);
        if (!instance) return;
        instance.alive = alive;
      });
    },

    sendForceSetPropertyValue: (state, action: PayloadAction<ForceSetPropertyValue>) => {
      state.pendingForceSetPropertyValueEvent = {
        payload: action.payload,
        sent: false,
      };
    },
    sendRefreshInstanceAliveStatus: (state, action: PayloadAction<CheckInstanceAlive>) => {
      state.pendingRefreshInstanceAliveStatusEvent = {
        payload: action.payload,
        sent: false,
      };
    },
    sendForceSetPropertyValueEventCompleted: (state) => {
      if (state.pendingForceSetPropertyValueEvent) {
        state.pendingForceSetPropertyValueEvent.sent = true;
      }
    },
    sendRefreshInstanceAliveStatusEventCompleted: (state) => {
      if (state.pendingRefreshInstanceAliveStatusEvent) {
        state.pendingRefreshInstanceAliveStatusEvent.sent = true;
      }
    },
  }
});

export const flipperActions = flipperEventSlice.actions;
export const flipperReducer = flipperEventSlice.reducer;

export const selectRegisteredInstances = (state: any) => state.flipper.registerInstance as DebuggableStateHolderInfo[];
export const selectValueChanges = (state: any) => state.flipper.valueChanges as NotifyValueChange[];
export const selectMethodCalls = (state: any) => state.flipper.methodCalls as MethodCallInfo[];
export const selectRawEvents = (state: any) => state.flipper.rawEvents as RawEventLog[];
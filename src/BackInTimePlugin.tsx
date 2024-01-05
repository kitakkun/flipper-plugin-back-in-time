// Read more: https://fbflipper.com/docs/tutorial/js-custom#creating-a-first-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#pluginclient
import {createState, PluginClient} from "flipper-plugin";
import {IncomingEvents} from "./events/FlipperIncomingEvents";
import {OutgoingEvents} from "./events/FlipperOutgoingEvents";
import {configureStore} from "@reduxjs/toolkit";
import {flipperActions, flipperReducer} from "./reducer/flipperReducer";
import {appReducer} from "./reducer/appReducer";
import {instanceListReducer} from "./view/page/instance_list/InstanceListReducer";
import {sidebarReducer} from "./view/sidebar/sidebarReducer";
import {rawEventLogReducer} from "./view/page/raw_logs/RawEventLogReducer";
import {valueEmitReducer} from "./view/page/value_emit/ValueEmitReducer";
import {editAndEmitValueReducer} from "./view/page/edited_value_emitter/EditAndEmitValueReducer";
import {
  AtomicPersistentState,
  initPersistentStateSlice,
  persistentStateReducer
} from "./reducer/PersistentStateReducer";

export default (client: PluginClient<IncomingEvents, OutgoingEvents>) => {
  initPersistentStateSlice(generatePersistentStates());

  const store = configureStore({
    reducer: {
      app: appReducer,
      persistentState: persistentStateReducer(),
      flipper: flipperReducer,
      instanceList: instanceListReducer,
      rawEventLog: rawEventLogReducer,
      sidebar: sidebarReducer,
      valueEmit: valueEmitReducer,
      editAndEmitValue: editAndEmitValueReducer,
    },
  });

  const dispatch = store.dispatch;

  client.onMessage("register", (event) => dispatch(flipperActions.registerInstance(event)));
  client.onMessage("notifyValueChange", (event) => dispatch(flipperActions.notifyValueChange(event)));
  client.onMessage("notifyMethodCall", (event) => dispatch(flipperActions.notifyMethodCall(event)));

  store.subscribe(() => {
    const pendingEvent = store.getState().flipper.pendingForceSetPropertyValueEvent
    if (pendingEvent && !pendingEvent.sent) {
      dispatch(flipperActions.sendForceSetPropertyValueEventCompleted());
      client.send("forceSetPropertyValue", pendingEvent.payload);
    }
  });

  store.subscribe(() => {
    const pendingEvent = store.getState().flipper.pendingRefreshInstanceAliveStatusEvent
    if (pendingEvent && !pendingEvent.sent) {
      dispatch(flipperActions.sendRefreshInstanceAliveStatusEventCompleted());
      client.send("refreshInstanceAliveStatus", pendingEvent.payload)
        .then((response) => dispatch(flipperActions.updateInstanceAliveStatus(response)));
    }
  });

  return {store};
}

function generatePersistentStates(): AtomicPersistentState {
  return {
    showNonDebuggableProperty: createState(true, {persist: "DebuggerPreferences.showNonDebuggableProperty", persistToLocalStorage: true}),
  };
}

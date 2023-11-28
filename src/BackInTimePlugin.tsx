// Read more: https://fbflipper.com/docs/tutorial/js-custom#creating-a-first-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#pluginclient
import {PluginClient} from "flipper-plugin";
import {IncomingEvents} from "./events/FlipperIncomingEvents";
import {OutgoingEvents} from "./events/FlipperOutgoingEvents";
import {configureStore} from "@reduxjs/toolkit";
import {flipperActions, flipperReducer} from "./reducer/flipperReducer";
import {appReducer} from "./reducer/appReducer";

export default (client: PluginClient<IncomingEvents, OutgoingEvents>) => {
  const store = configureStore({
    reducer: {
      app: appReducer,
      flipper: flipperReducer,
    },
  });

  const dispatch = store.dispatch;

  client.onMessage("register", (event) => dispatch(flipperActions.registerInstance(event)));
  client.onMessage("notifyValueChange", (event) => dispatch(flipperActions.notifyValueChange(event)));
  client.onMessage("notifyMethodCall", (event) => dispatch(flipperActions.notifyMethodCall(event)));

  const forceSetState = (instanceId: string, propertyKey: string, value: string, valueType: string) => {
    client.send("forceSetPropertyValue", {
      instanceUUID: instanceId,
      propertyName: propertyKey,
      value: value,
      valueType: valueType,
    });
  };

  const refreshInstanceAliveStatus = (instanceUUIDs: string[]) => {
    if (instanceUUIDs.length == 0) return;
    client
      .send("refreshInstanceAliveStatus", {instanceUUIDs: instanceUUIDs})
      .then((response) => dispatch(flipperActions.updateInstanceAliveStatus(response)));
  };

  return {
    store,
    forceSetState,
    refreshInstanceAliveStatus,
  };
}

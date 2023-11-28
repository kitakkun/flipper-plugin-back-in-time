// Read more: https://fbflipper.com/docs/tutorial/js-custom#creating-a-first-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#pluginclient
import {PluginClient} from "flipper-plugin";
import useViewModel from "./ViewModel";
import {IncomingEvents} from "./events/FlipperIncomingEvents";
import {OutgoingEvents} from "./events/FlipperOutgoingEvents";

export default (client: PluginClient<IncomingEvents, OutgoingEvents>) => {
  const viewModel = useViewModel();
  const state = viewModel.state;
  const actions = viewModel.actions;

  client.onMessage("register", actions.register);
  client.onMessage("notifyValueChange", actions.notifyValueChange);
  client.onMessage("notifyMethodCall", actions.notifyMethodCall);

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
      .then((response) => {
        Object.entries(response.isAlive).forEach(([instanceUUID, alive]) => {
          actions.updateInstanceAliveStatus(instanceUUID, alive);
        });
      });
  };

  return {
    ...state,
    forceSetState,
    refreshInstanceAliveStatus,
  };
}

import BackInTimePlugin from "./BackInTimePlugin";
import BackInTimeComponent from "./BackInTimeComponent";
import {PluginClient, usePlugin} from "flipper-plugin";
import {IncomingEvents} from "./events/FlipperIncomingEvents";
import {OutgoingEvents} from "./events/FlipperOutgoingEvents";

export function plugin(client: PluginClient<IncomingEvents, OutgoingEvents>) {
  return BackInTimePlugin(client);
}
export function Component() {
  return BackInTimeComponent();
}

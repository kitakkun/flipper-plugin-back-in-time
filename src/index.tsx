import React from 'react';
import {PluginClient, usePlugin, createState, useValue, Layout, Panel, DetailSidebar} from 'flipper-plugin';
import {Button} from "antd";
import { JsonViewer } from '@textea/json-viewer';

/**
 * information about debug target instance
 * this object is sent after registration of the instance completed.
 * @param instanceId IdentityHashCode of the instance
 * @param propertyNames list of names of debuggable property
 * @param registeredAt
 */
type DebugTargetRegistrationInfo = {
  instanceUUID: string;
  propertyNames: string;
  registeredAt: number;
}

type ValueChangedEvent = {
  instanceUUID: string;
  propertyName: string;
  value: string;
  valueType: string;
}

type SetPropertyValueMethod = {
  instanceId: string;
  propertyKey: string;
  value: string;
}

type Events = {
  error: string;
  register: DebugTargetRegistrationInfo;
  valueChanged: ValueChangedEvent;
};

type Methods = {
  setPropertyValue(params: SetPropertyValueMethod): Promise<any>;
}

// Read more: https://fbflipper.com/docs/tutorial/js-custom#creating-a-first-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#pluginclient
export function plugin(client: PluginClient<Events, Methods>) {
  const registeredInstanceInfo = createState<Record<string, DebugTargetRegistrationInfo>>({}, {persist: 'registrationInfo'})

  const valueChangeLog = createState<Record<string, ValueChangedEvent[]>>({}, {persist: 'valueChangeLog'})

  client.onMessage("register", (info) => {
    registeredInstanceInfo.update((draft) => {
      draft[info.instanceUUID] = info;
    });
  });

  client.onMessage("valueChanged", (event) => {
    valueChangeLog.update((draft) => {
      if (!draft[event.instanceUUID]) draft[event.instanceUUID] = [];
      draft[event.instanceUUID].push(event);
    });
  });

  function forceSetState(instanceId: string, propertyKey: string, value: string) {
    client.send("setPropertyValue", {
      instanceId: instanceId,
      propertyKey: propertyKey,
      value: value,
    });
  }

  return {registeredInstanceInfo, forceSetState, valueChangeLog};
}

// Read more: https://fbflipper.com/docs/tutorial/js-custom#building-a-user-interface-for-the-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#react-hooks
export function Component() {
  const instance = usePlugin(plugin);
  const registeredInfo = useValue(instance.registeredInstanceInfo);
  const forceSetState = instance.forceSetState;
  const valueChangeLog = useValue(instance.valueChangeLog);

  return (
    <Layout.ScrollContainer>
      <h1>ValueChangedEvents</h1>
      {Object.entries(valueChangeLog).map(([id, events]) => (
        <div key={id}>
          <h2>{id}</h2>
          {events.map((event) => (
            <pre key={event.valueType}>
              <JsonViewer value={JSON.parse(event.value)} />
            </pre>
          ))}
        </div>
      ))}
      {Object.entries(registeredInfo).map(([id, info]) => (
        <pre key={id} data-testid={id}>
          {JSON.stringify(info)}
        </pre>
      ))}
      <Button onClick={() => forceSetState("hoge", "propertyKey", "stringified JSON value")}>
        Click Me
      </Button>
    </Layout.ScrollContainer>
  );
}

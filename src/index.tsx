import React from 'react';
import {PluginClient, usePlugin, createState, useValue, Layout, Panel, DetailSidebar} from 'flipper-plugin';
import InstanceList from "./components/InstanceList";
import {Typography} from "@mui/material";
import {InstanceInfo, InstanceInfoWithAliveState} from "./data/InstanceInfo";

type ValueChangedEvent = {
  instanceUUID: string;
  propertyName: string;
  value: string;
  valueType: string;
}

type SetPropertyValueMethod = {
  instanceUUID: string;
  propertyName: string;
  value: string;
}

type Events = {
  error: string;
  register: InstanceInfo;
  valueChanged: ValueChangedEvent;
};

type InstanceAliveStatusRequest = {
  instanceUUIDs: string[];
}

type Methods = {
  setPropertyValue(params: SetPropertyValueMethod): Promise<any>;
  refreshInstanceAliveStatus(instanceUUIDs: InstanceAliveStatusRequest): Promise<boolean[]>;
}

// Read more: https://fbflipper.com/docs/tutorial/js-custom#creating-a-first-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#pluginclient
export function plugin(client: PluginClient<Events, Methods>) {
  const registeredInstanceInfo = createState<InstanceInfoWithAliveState[]>([], {persist: 'registrationInfo'})
  const valueChangeLog = createState<Record<string, ValueChangedEvent[]>>({}, {persist: 'valueChangeLog'})

  client.onMessage("register", (info) => {
    registeredInstanceInfo.update((draft) => {
      draft.push({
        ...info,
        alive: true,
      });
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
      instanceUUID: instanceId,
      propertyName: propertyKey,
      value: value,
    });
  }

  const refreshInstanceAliveStatus = (instanceUUIDs: string[]) => {
    if (instanceUUIDs.length == 0) return;
    const response = client.send("refreshInstanceAliveStatus", {instanceUUIDs: instanceUUIDs});
    response.then((result) => {
      registeredInstanceInfo.update((draft) => {
        draft.forEach((info) => {
          const index = instanceUUIDs.indexOf(info.uuid);
          info.alive = result[index];
        });
      });
    });
  }

  return {registeredInstanceInfo, forceSetState, valueChangeLog, refreshInstanceAliveStatus};
}

type SelectedProperty = {
  instanceId: string;
  propertyKey: string;
}

// Read more: https://fbflipper.com/docs/tutorial/js-custom#building-a-user-interface-for-the-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#react-hooks
export function Component() {
  const instance = usePlugin(plugin);
  const registeredInfo = useValue(instance.registeredInstanceInfo);
  const forceSetState = instance.forceSetState;
  const valueChangeLog = useValue(instance.valueChangeLog);
  const [selectedProperty, setSelectedProperty] = React.useState<SelectedProperty | null>(null);

  const selectedInstance = selectedProperty ? registeredInfo.find((info) => info.uuid == selectedProperty.instanceId) : null;
  const refreshInstanceAliveStatus = instance.refreshInstanceAliveStatus;
  return (
    <>
      <Layout.ScrollContainer>
        <InstanceList
          instances={registeredInfo}
          onSelectedProperty={(instanceUUID, propertyName) => {
            setSelectedProperty({instanceId: instanceUUID, propertyKey: propertyName});
          }}
          onClickRefresh={() => refreshInstanceAliveStatus(registeredInfo.map((info) => info.uuid))}
        />
      </Layout.ScrollContainer>
      <DetailSidebar
        minWidth={400}
      >
        {selectedProperty ?
          <>
            <Typography variant="subtitle1">
              Parent Instance Info
            </Typography>
            <Typography variant="subtitle1">
              Property Info
            </Typography>
            <pre>
            {JSON.stringify(selectedProperty)}
          </pre>
          </>
          : null
        }
      </DetailSidebar>
    </>
  );
}

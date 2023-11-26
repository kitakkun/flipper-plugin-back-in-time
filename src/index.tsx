import React, {useEffect} from 'react';
import {createState, DetailSidebar, Layout, PluginClient, usePlugin, useValue} from 'flipper-plugin';
import InstanceList from "./components/InstanceList";
import {DebuggableStateHolderInfo} from "./data/RegisterInstance";
import PropertyInspector from "./components/PropertyInspector";
import {IncomingEvents, NotifyValueChange} from "./events/FlipperIncomingEvents";
import {OutgoingEvents} from "./events/FlipperOutgoingEvents";

// Read more: https://fbflipper.com/docs/tutorial/js-custom#creating-a-first-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#pluginclient
export function plugin(client: PluginClient<IncomingEvents, OutgoingEvents>) {
  const registeredInstances = createState<DebuggableStateHolderInfo[]>([], {persist: 'registrationInfo'})
  const valueChangeLog = createState<Record<string, NotifyValueChange[]>>({}, {persist: 'valueChangeLog'})

  client.onMessage("register", (event) => {
    registeredInstances.update((draft) => {
      draft.push({
        instanceUUID: event.instanceUUID,
        instanceType: event.instanceType,
        properties: event.properties,
        registeredAt: event.registeredAt,
        alive: true,
      });
    });
    valueChangeLog.update((draft) => {
      draft[event.instanceUUID] = [];
    });
  });

  client.onMessage("notifyValueChange", (event) => {
    valueChangeLog.update((draft) => {
      if (!draft[event.instanceUUID]) draft[event.instanceUUID] = [];
      draft[event.instanceUUID].push(event);
    });
  });

  function forceSetState(instanceId: string, propertyKey: string, value: string, valueType: string) {
    client.send("forceSetPropertyValue", {
      instanceUUID: instanceId,
      propertyName: propertyKey,
      value: value,
      valueType: valueType,
    });
  }

  const refreshInstanceAliveStatus = (instanceUUIDs: string[]) => {
    if (instanceUUIDs.length == 0) return;
    client
      .send("refreshInstanceAliveStatus", {instanceUUIDs: instanceUUIDs})
      .then((response) => {
        registeredInstances.update((draft) => {
          response.isAlive.forEach((isAlive, instanceUUID) => {
            const index = draft.findIndex((info) => info.instanceUUID == instanceUUID);
            if (index == -1) return;
            draft[index].alive = isAlive;
          });
        });
      });
  }

  return {registeredInstanceInfo: registeredInstances, forceSetState, valueChangeLog, refreshInstanceAliveStatus};
}

export type SelectedProperty = {
  instanceUUID: string;
  propertyName: string;
}

// Read more: https://fbflipper.com/docs/tutorial/js-custom#building-a-user-interface-for-the-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#react-hooks
export function Component() {
  const instance = usePlugin(plugin);
  const registeredInfo = useValue(instance.registeredInstanceInfo);
  const forceSetState = instance.forceSetState;
  const valueChangeLog = useValue(instance.valueChangeLog);

  const [selectedProperty, setSelectedProperty] = React.useState<SelectedProperty | null>(null);
  const [selectedInstance, setSelectedInstance] = React.useState<DebuggableStateHolderInfo | null>(null);
  const [selectedPropertyValueChangeLog, setSelectedPropertyValueChangeLog] = React.useState<NotifyValueChange[]>([]);

  useEffect(() => {
    const instanceUUID = selectedProperty?.instanceUUID;
    if (!instanceUUID) return;
    const selectedInstance = registeredInfo.find((info) => info.instanceUUID == instanceUUID);
    setSelectedInstance(selectedInstance ? selectedInstance : null);
    setSelectedPropertyValueChangeLog(valueChangeLog[instanceUUID].filter((event) => event.propertyName == selectedProperty.propertyName));
  }, [selectedProperty, valueChangeLog])

  const refreshInstanceAliveStatus = instance.refreshInstanceAliveStatus;

  return (
    <>
      <Layout.ScrollContainer>
        <InstanceList
          instances={registeredInfo}
          onSelectedProperty={(instanceUUID, propertyName) => {
            setSelectedProperty({instanceUUID: instanceUUID, propertyName: propertyName});
          }}
          onClickRefresh={() => refreshInstanceAliveStatus(registeredInfo.map((info) => info.instanceUUID))}
          valueChangedEvents={valueChangeLog}
        />
      </Layout.ScrollContainer>
      <DetailSidebar width={600}>
        {selectedProperty && selectedInstance ?
          <PropertyInspector
            selectedInstance={selectedInstance}
            selectedProperty={selectedProperty}
            selectedPropertyValueChangeLog={selectedPropertyValueChangeLog}/>
          : null
        }
      </DetailSidebar>
    </>
  );
}

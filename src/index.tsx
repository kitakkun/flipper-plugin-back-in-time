import React, {useEffect} from 'react';
import {createState, DetailSidebar, Layout, PluginClient, usePlugin, useValue} from 'flipper-plugin';
import InstanceList from "./components/InstanceList";
import {DebuggableStateHolderInfo} from "./data/RegisterInstance";
import PropertyInspector from "./components/PropertyInspector";
import {IncomingEvents, NotifyValueChange} from "./events/FlipperIncomingEvents";
import {OutgoingEvents} from "./events/FlipperOutgoingEvents";
import {Box, Tab, Tabs} from "@mui/material";

// Read more: https://fbflipper.com/docs/tutorial/js-custom#creating-a-first-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#pluginclient
export function plugin(client: PluginClient<IncomingEvents, OutgoingEvents>) {
  const registeredInstances = createState<DebuggableStateHolderInfo[]>([], {persist: 'registrationInfo'});
  const valueChangeLog = createState<Record<string, NotifyValueChange[]>>({}, {persist: 'valueChangeLog'});
  const rawEventLog = createState<string[]>([], {persist: 'rawEventLog'});

  client.onMessage("register", (event) => {
    rawEventLog.update((draft) => {
      draft.push("register: " + JSON.stringify(event))
    });
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
    rawEventLog.update((draft) => {
      draft.push("notifyValueChange: " + JSON.stringify(event))
    });
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
          Object.entries(response.isAlive).forEach(([instanceUUID, alive]) => {
            const index = draft.findIndex((info) => info.instanceUUID == instanceUUID);
            if (index == -1) return;
            draft[index].alive = alive;
          });
        });
      });
  }

  return {registeredInstanceInfo: registeredInstances, forceSetState, valueChangeLog, refreshInstanceAliveStatus, rawEventLog};
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
  const rawEventLog = useValue(instance.rawEventLog)
  const [activeTabIndex, setActiveTabIndex] = React.useState(0);

  return (
    <>
      <Layout.ScrollContainer>
        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
          <Tabs value={activeTabIndex} onChange={(_, index) => setActiveTabIndex(index)}
                aria-label="basic tabs example">
            <Tab label="Registered instances"/>
            <Tab label="Raw event log"/>
          </Tabs>
        </Box>
        {
          activeTabIndex == 0 ?
            <InstanceList
              instances={registeredInfo}
              onSelectedProperty={(instanceUUID, propertyName) => {
                setSelectedProperty({instanceUUID: instanceUUID, propertyName: propertyName});
              }}
              onClickRefresh={() => refreshInstanceAliveStatus(registeredInfo.map((info) => info.instanceUUID))}
              valueChangedEvents={valueChangeLog}
            /> : null
        }
        {
          activeTabIndex == 1 ?
            <Box padding={2}>
              <ul>
                {rawEventLog.map((log, index) => <li key={index}>{log}</li>)}
              </ul>
            </Box> : null
        }
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

import React, {useEffect} from 'react';
import {createState, DetailSidebar, Layout, PluginClient, usePlugin, useValue} from 'flipper-plugin';
import InstanceList from "./components/InstanceList";
import {DebuggableStateHolderInfo} from "./data/RegisterInstance";
import PropertyInspector from "./components/PropertyInspector";
import {IncomingEvents, NotifyValueChange} from "./events/FlipperIncomingEvents";
import {ForceSetPropertyValue, OutgoingEvents} from "./events/FlipperOutgoingEvents";
import {Box, Tab, Tabs} from "@mui/material";
import MyTabs from "./components/MyTabs";
import useViewModel from "./ViewModel";

// Read more: https://fbflipper.com/docs/tutorial/js-custom#creating-a-first-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#pluginclient
export function plugin(client: PluginClient<IncomingEvents, OutgoingEvents>) {
  const viewModel = useViewModel();
  const state = viewModel.state;
  const actions = viewModel.actions;

  client.onMessage("register", actions.register);
  client.onMessage("notifyValueChange", actions.notifyValueChange);
  client.onMessage("notifyMethodCall", actions.notifyMethodCall);

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
        state.registeredInstances.update((draft) => {
          Object.entries(response.isAlive).forEach(([instanceUUID, alive]) => {
            actions.updateInstanceAliveStatus(instanceUUID, alive);
          });
        });
      });
  }

  return {
    registeredInstanceInfo: state.registeredInstances,
    valueChangeLog: state.valueChangeLog,
    rawEventLog: state.rawEventLog,
    forceSetState,
    refreshInstanceAliveStatus,
  };
}

export type SelectedProperty = {
  instanceUUID: string;
  propertyName: string;
}

// Read more: https://fbflipper.com/docs/tutorial/js-custom#building-a-user-interface-for-the-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#react-hooks
export function Component() {
  const instance = usePlugin(plugin);

  // data stored in PluginClient
  const registeredInfo = useValue(instance.registeredInstanceInfo);
  const valueChangeLog = useValue(instance.valueChangeLog);
  const rawEventLog = useValue(instance.rawEventLog)

  // method to send message to mobile app
  const refreshInstanceAliveStatus = instance.refreshInstanceAliveStatus;
  const forceSetState = instance.forceSetState;

  // state for UI
  const [selectedProperty, setSelectedProperty] = React.useState<SelectedProperty | null>(null);
  const [selectedInstance, setSelectedInstance] = React.useState<DebuggableStateHolderInfo | null>(null);
  const [selectedPropertyValueChangeLog, setSelectedPropertyValueChangeLog] = React.useState<NotifyValueChange[]>([]);
  const [activeTabIndex, setActiveTabIndex] = React.useState(0);

  useEffect(() => {
    const instanceUUID = selectedProperty?.instanceUUID;
    if (!instanceUUID) return;
    const selectedInstance = registeredInfo.find((info) => info.instanceUUID == instanceUUID);
    setSelectedInstance(selectedInstance ? selectedInstance : null);
    setSelectedPropertyValueChangeLog(valueChangeLog[instanceUUID].filter((event) => event.propertyName == selectedProperty.propertyName));
  }, [selectedProperty, valueChangeLog])

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

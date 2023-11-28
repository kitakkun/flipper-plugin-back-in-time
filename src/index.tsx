import React, {useEffect} from 'react';
import {DetailSidebar, Layout, PluginClient, usePlugin, useValue} from 'flipper-plugin';
import RegisteredInstancePage from "./page/registered_instance/RegisteredInstancePage";
import {DebuggableStateHolderInfo} from "./data/RegisterInstance";
import PropertyInspector from "./sidebar/PropertyInspector";
import {IncomingEvents, NotifyValueChange} from "./events/FlipperIncomingEvents";
import {OutgoingEvents} from "./events/FlipperOutgoingEvents";
import {Box, Tab, Tabs} from "@mui/material";
import useViewModel from "./ViewModel";
import RawLogPage from "./page/raw_logs/RawLogPage";

// Read more: https://fbflipper.com/docs/tutorial/js-custom#creating-a-first-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#pluginclient
export function plugin(client: PluginClient<IncomingEvents, OutgoingEvents>) {
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

export type SelectedProperty = {
  instanceUUID: string;
  propertyName: string;
}

// Read more: https://fbflipper.com/docs/tutorial/js-custom#building-a-user-interface-for-the-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#react-hooks
export function Component() {
  const instance = usePlugin(plugin);

  // data stored in PluginClient
  const registeredInfo = useValue(instance.registeredInstances);
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
          (() => {
            switch (activeTabIndex) {
              case 0:
                return <RegisteredInstancePage
                  instances={registeredInfo}
                  onSelectProperty={(instanceUUID, propertyName) => {
                    setSelectedProperty({instanceUUID: instanceUUID, propertyName: propertyName});
                  }}
                  onClickRefresh={() => refreshInstanceAliveStatus(registeredInfo.map((info) => info.instanceUUID))}
                  valueChangedEvents={valueChangeLog}
                />
              case 1:
                return <RawLogPage rawEventLog={rawEventLog}/>
              default:
                return null;
            }
          })()
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

// Read more: https://fbflipper.com/docs/tutorial/js-custom#building-a-user-interface-for-the-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#react-hooks
import {DetailSidebar, Layout, PluginClient, usePlugin, useValue} from "flipper-plugin";
import {DebuggableStateHolderInfo} from "./data/RegisterInstance";
import {NotifyValueChange} from "./events/FlipperIncomingEvents";
import {useEffect} from "react";
import React from "react";
import RegisteredInstancePage from "./page/registered_instance/RegisteredInstancePage";
import RawLogPage from "./page/raw_logs/RawLogPage";
import PropertyInspector from "./sidebar/PropertyInspector";
import {plugin} from "./index";
import TabMenu from "./component/TabMenu";
import BackInTimeSideBar from "./BackInTimeSideBar";

export type SelectedProperty = {
  instanceUUID: string;
  propertyName: string;
}

export default () => {
  const pluginInstance = usePlugin(plugin);
  const state = pluginInstance.state;
  const actions = pluginInstance.actions;

  // data stored in PluginClient
  const registeredInfo = useValue(pluginInstance.state.registeredInstances);
  const valueChangeLog = useValue(pluginInstance.state.valueChangeLog);
  const rawEventLog = useValue(pluginInstance.state.rawEventLog)

  // state for UI
  const [activeTabIndex, setActiveTabIndex] = React.useState(0);

  const TabContent = (activeTabIndex: number) => {
    switch (activeTabIndex) {
      case 0:
        return <RegisteredInstancePage
          instances={registeredInfo}
          onSelectProperty={(instanceUUID, propertyName) => {
            actions.selectProperty(instanceUUID, propertyName);
          }}
          onClickRefresh={() => pluginInstance.refreshInstanceAliveStatus(registeredInfo.map((info) => info.instanceUUID))}
          valueChangedEvents={valueChangeLog}
        />
      case 1:
        return <RawLogPage rawEventLog={rawEventLog}/>
      default:
        return null;
    }
  }

  return (
    <>
      <Layout.ScrollContainer>
        <TabMenu activeTabIndex={activeTabIndex} onTabChange={setActiveTabIndex}/>
        {TabContent(activeTabIndex)}
      </Layout.ScrollContainer>
      <BackInTimeSideBar state={state}/>
    </>
  );
}

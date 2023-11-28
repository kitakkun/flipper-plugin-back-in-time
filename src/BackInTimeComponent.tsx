// Read more: https://fbflipper.com/docs/tutorial/js-custom#building-a-user-interface-for-the-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#react-hooks
import {Layout, usePlugin, useValue} from "flipper-plugin";
import React from "react";
import {plugin} from "./index";
import TabMenu from "./component/TabMenu";
import BackInTimeSideBar from "./BackInTimeSideBar";
import TabContent from "./component/TabContent";

export default () => {
  const pluginInstance = usePlugin(plugin);
  const state = pluginInstance.state;
  const actions = pluginInstance.actions;

  const activeTabIndex = useValue(state.activeTabIndex);

  return (
    <>
      <Layout.ScrollContainer>
        <TabMenu activeTabIndex={activeTabIndex} onTabChange={actions.updateActiveTabIndex}/>
        <TabContent
          activeTabIndex={activeTabIndex}
          state={state}
          actions={actions}
          refreshInstanceAliveStatus={pluginInstance.refreshInstanceAliveStatus}
        />
      </Layout.ScrollContainer>
      <BackInTimeSideBar state={state}/>
    </>
  );
}

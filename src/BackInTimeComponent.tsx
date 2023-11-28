// Read more: https://fbflipper.com/docs/tutorial/js-custom#building-a-user-interface-for-the-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#react-hooks
import {Layout, usePlugin, useValue} from "flipper-plugin";
import React from "react";
import {plugin} from "./index";
import TabMenu from "./component/TabMenu";
import BackInTimeSideBar from "./BackInTimeSideBar";
import TabContent from "./component/TabContent";
import {Provider, shallowEqual, useDispatch, useSelector} from "react-redux";
import {appActions, AppState, selectActiveTabIndex} from "./appReducer";

export default () => {
  const pluginInstance = usePlugin(plugin);
  const activeTabIndex = useSelector(selectActiveTabIndex);
  const dispatch = useDispatch();

  return (
    <>
      <Layout.ScrollContainer>
        <TabMenu
          activeTabIndex={activeTabIndex}
          onTabChange={(newIndex) => dispatch(appActions.updateActiveTabIndex(newIndex))}
        />
        <TabContent
          activeTabIndex={activeTabIndex}
          refreshInstanceAliveStatus={pluginInstance.refreshInstanceAliveStatus}
        />
      </Layout.ScrollContainer>
      <BackInTimeSideBar />
    </>
  );
}

// Read more: https://fbflipper.com/docs/tutorial/js-custom#building-a-user-interface-for-the-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#react-hooks
import {Layout} from "flipper-plugin";
import React from "react";
import TabMenu from "./view/component/TabMenu";
import BackInTimeSideBar from "./view/sidebar/BackInTimeSideBar";
import TabContent from "./view/component/TabContent";
import {useDispatch, useSelector} from "react-redux";
import {appActions, selectActiveTabIndex} from "./reducer/appReducer";

export default () => {
  const activeTabIndex = useSelector(selectActiveTabIndex);
  const dispatch = useDispatch();

  return (
    <>
      <Layout.ScrollContainer>
        <TabMenu
          activeTabIndex={activeTabIndex}
          onTabChange={(newIndex) => dispatch(appActions.updateActiveTabIndex(newIndex))}
        />
        <TabContent activeTabIndex={activeTabIndex}/>
      </Layout.ScrollContainer>
      <BackInTimeSideBar/>
    </>
  );
}

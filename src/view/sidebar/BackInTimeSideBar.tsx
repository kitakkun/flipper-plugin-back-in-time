import {DetailSidebar} from "flipper-plugin";
import React from "react";
import {useSelector} from "react-redux";
import {sideBarStateSelector} from "./sidebarReducer";
import PropertyInspectorView from "./PropertyInspectorView";

export function BackInTimeSideBar() {
  const sidebarState = useSelector(sideBarStateSelector);

  return (
    <DetailSidebar width={600}>
      {
        sidebarState.propertyInspectorState ? <PropertyInspectorView
          selectedInstance={sidebarState.propertyInspectorState.selectedInstance}
          selectedPropertyInfo={sidebarState.propertyInspectorState.selectedPropertyInfo}
          selectedPropertyValueChangeLog={sidebarState.propertyInspectorState.selectedPropertyValueChangeLog}
        /> : null
      }
    </DetailSidebar>
  );
}
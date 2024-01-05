import {DetailSidebar} from "flipper-plugin";
import React from "react";
import {useSelector} from "react-redux";
import {sideBarStateSelector} from "./sidebarReducer";
import {PropertyInspectorPage} from "./property_inspector/PropertyInspectorPage";

export function BackInTimeSideBar() {
  const sidebarState = useSelector(sideBarStateSelector);

  return (
    <DetailSidebar width={600}>
      {
        sidebarState.propertyInspectorState ? <PropertyInspectorPage
          state={sidebarState.propertyInspectorState}
        /> : null
      }
    </DetailSidebar>
  );
}
import {DetailSidebar} from "flipper-plugin";
import React from "react";
import {useSelector} from "react-redux";
import {sidebarStateSelector} from "../../reducer/sidebarReducer";
import {PropertyInspectorPage} from "./property_inspector/PropertyInspectorPage";

export function BackInTimeSideBar() {
  const sidebarState = useSelector(sidebarStateSelector);

  return (
    <DetailSidebar width={600}>
      <PropertyInspectorPage/>
    </DetailSidebar>
  );
}
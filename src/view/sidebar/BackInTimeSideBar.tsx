import {DetailSidebar} from "flipper-plugin";
import React from "react";
import {useSelector} from "react-redux";
import {propertyInspectorReducerStateSelector} from "./property_inspector/propertyInspectorReducer";
import {PropertyInspectorPage} from "./property_inspector/PropertyInspectorPage";

export function BackInTimeSideBar() {
  const sidebarState = useSelector(propertyInspectorReducerStateSelector);

  return (
    <DetailSidebar width={600}>
      <PropertyInspectorPage/>
    </DetailSidebar>
  );
}
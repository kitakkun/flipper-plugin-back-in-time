import {useDispatch, useSelector} from "react-redux";
import {flipperActions} from "../../../reducer/flipperReducer";
import React from "react";
import {InstanceListView} from "./InstanceListView";
import {instanceListActions, instanceListStateSelector} from "./InstanceListReducer";
import {sidebarActions} from "../../sidebar/sidebarReducer";

export function InstanceListPage() {
  const state = useSelector(instanceListStateSelector);
  const dispatch = useDispatch();

  return <InstanceListView
    state={state}
    onSelectProperty={(instanceUUID, propertyName) => {
      const instanceInfo = state.instances.find((instance) => instance.instanceUUID == instanceUUID);
      const propertyInfo = instanceInfo?.properties?.find((property) => property.name == propertyName);
      const valueChanges = state.valueChangedEvents.filter((event) => event.instanceUUID == instanceUUID && event.propertyName == propertyName);
      if (!instanceInfo || !propertyInfo) return;
      dispatch(sidebarActions.openPropertyInspector({
        selectedInstance: instanceInfo,
        selectedPropertyInfo: propertyInfo,
        selectedPropertyValueChangeLog: valueChanges,
      }))
    }}
    onClickRefresh={() => {
      dispatch(flipperActions.sendRefreshInstanceAliveStatus({instanceUUIDs: state.instances.map((info) => info.instanceUUID)}));
    }}
    onChangeNonDebuggablePropertyVisible={(visible) => {
      dispatch(instanceListActions.updateNonDebuggablePropertyVisibility(visible));
    }}
  />;
}
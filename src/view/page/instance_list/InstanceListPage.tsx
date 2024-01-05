import {useDispatch, useSelector} from "react-redux";
import React from "react";
import {InstanceListView} from "./InstanceListView";
import {persistentStateActions} from "../../../reducer/PersistentStateReducer";
import {selectInstanceList} from "./InstanceListSelector";
import {appActions} from "../../../reducer/appReducer";
import {propertyInspectorActions} from "../../sidebar/property_inspector/propertyInspectorReducer";

export function InstanceListPage() {
  const state = useSelector(selectInstanceList);
  const dispatch = useDispatch();

  return <InstanceListView
    state={state}
    onSelectProperty={(instanceUUID, propertyName) => {
      const instanceInfo = state.instances.find((instance) => instance.uuid == instanceUUID);
      const propertyInfo = instanceInfo?.properties?.find((property) => property.name == propertyName);
      if (!instanceInfo || !propertyInfo) return;
      dispatch(propertyInspectorActions.openPropertyInspector({
        instanceUUID: instanceInfo.uuid,
        propertyName: propertyInfo.name,
      }))
    }}
    onClickRefresh={() => {
      dispatch(appActions.refreshInstanceAliveStatuses({instanceUUIDs: state.instances.map((info) => info.uuid)}));
    }}
    onChangeNonDebuggablePropertyVisible={(visible) => {
      dispatch(persistentStateActions().updateNonDebuggablePropertyVisibility(visible));
    }}
  />;
}

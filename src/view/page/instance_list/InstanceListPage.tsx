import {useDispatch, useSelector} from "react-redux";
import {flipperActions} from "../../../reducer/flipperReducer";
import React from "react";
import {InstanceListView} from "./InstanceListView";
import {instanceListStateSelector} from "./InstanceListReducer";
import {sidebarActions} from "../../sidebar/sidebarReducer";
import {persistentStateActions, persistentStateSelector} from "../../../reducer/PersistentStateReducer";

export function InstanceListPage() {
  const state = useSelector(instanceListStateSelector);
  const persistentState = useSelector(persistentStateSelector);
  const dispatch = useDispatch();

  return <InstanceListView
    state={state}
    nonDebuggablePropertyVisible={persistentState.showNonDebuggableProperty}
    onSelectProperty={(instanceUUID, propertyName) => {
      const instanceInfo = state.instances.find((instance) => instance.instanceUUID == instanceUUID);
      const propertyInfo = instanceInfo?.properties?.find((property) => property.name == propertyName);
      const methodCallInfoList = state.methodCallInfoList.filter((event) => event.instanceUUID == instanceUUID);
      if (!instanceInfo || !propertyInfo) return;
      dispatch(sidebarActions.openPropertyInspector({
        selectedInstance: instanceInfo,
        selectedPropertyInfo: propertyInfo,
        selectedPropertyRelevantCalls: methodCallInfoList,
      }))
    }}
    onClickRefresh={() => {
      dispatch(flipperActions.sendRefreshInstanceAliveStatus({instanceUUIDs: state.instances.map((info) => info.instanceUUID)}));
    }}
    onChangeNonDebuggablePropertyVisible={(visible) => {
      dispatch(persistentStateActions().updateNonDebuggablePropertyVisibility(visible));
    }}
  />;
}

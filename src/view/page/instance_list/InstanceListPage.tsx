import {useDispatch, useSelector} from "react-redux";
import {flipperActions} from "../../../reducer/flipperReducer";
import React from "react";
import {InstanceListView} from "./InstanceListView";
import {instanceListActions, instanceListStateSelector} from "./InstanceListReducer";

export function InstanceListPage() {
  const state = useSelector(instanceListStateSelector);
  const dispatch = useDispatch();

  return <InstanceListView
    state={state}
    onSelectProperty={(instanceUUID, propertyName) => {
      dispatch(instanceListActions.selectProperty({instanceUUID, propertyName}));
    }}
    onClickRefresh={() => {
      dispatch(flipperActions.sendRefreshInstanceAliveStatus({instanceUUIDs: state.instances.map((info) => info.instanceUUID)}));
    }}
    onChangeNonDebuggablePropertyVisible={(visible) => {
      dispatch(instanceListActions.updateNonDebuggablePropertyVisibility(visible));
    }}
  />;
}

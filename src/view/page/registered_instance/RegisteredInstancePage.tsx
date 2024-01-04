import {useDispatch, useSelector} from "react-redux";
import {flipperActions, selectRegisteredInstances, selectValueChanges} from "../../../reducer/flipperReducer";
import React from "react";
import RegisteredInstanceView from "./RegisteredInstanceView";
import {appActions, selectHideNonDebuggableProperties} from "../../../reducer/appReducer";

export function RegisteredInstancePage() {
  const instances = useSelector(selectRegisteredInstances);
  const valueChangeLog = useSelector(selectValueChanges);
  const dispatch = useDispatch();
  const hideNonDebuggableProperties = useSelector(selectHideNonDebuggableProperties);

  return <RegisteredInstanceView
    instances={instances}
    onSelectProperty={(instanceUUID, propertyName) => {
      dispatch(appActions.selectProperty({instanceUUID, propertyName}))
    }}
    onClickRefresh={() => {
      dispatch(flipperActions.sendRefreshInstanceAliveStatus({instanceUUIDs: instances.map((info) => info.instanceUUID)}));
    }}
    hideNonDebuggableProperties={hideNonDebuggableProperties}
    onHideNonDebuggablePropertiesCheckedChange={(checked) => {
      dispatch(appActions.hideNonDebuggablePropertiesToggled(checked))
    }}
    valueChangedEvents={valueChangeLog}
  />;
}

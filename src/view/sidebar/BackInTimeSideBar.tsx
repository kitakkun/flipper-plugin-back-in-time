import {DetailSidebar} from "flipper-plugin";
import PropertyInspector from "./PropertyInspector";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {flipperActions, selectRegisteredInstances, selectValueChanges} from "../../reducer/flipperReducer";
import {selectSelectedInstanceUUID, selectSelectedPropertyName} from "../../reducer/appReducer";

export default () => {
  const instances = useSelector(selectRegisteredInstances);
  const valueChanges = useSelector(selectValueChanges);
  const selectedPropertyName = useSelector(selectSelectedPropertyName);
  const selectedInstanceUUID = useSelector(selectSelectedInstanceUUID);
  const selectedInstance = instances.find((instance) => instance.instanceUUID === selectedInstanceUUID);
  const selectedPropertyValueChangeLog = valueChanges.filter((event) =>
    event.instanceUUID === selectedInstanceUUID && event.propertyName === selectedPropertyName);
  const dispatch = useDispatch();

  return (
    <DetailSidebar width={600}>
      {selectedPropertyName && selectedInstance ?
        <PropertyInspector
          selectedInstance={selectedInstance}
          selectedPropertyName={selectedPropertyName}
          selectedPropertyValueChangeLog={selectedPropertyValueChangeLog}
          onValueEmit={(instanceUUID: string, propertyName: string, value: string, valueType: string) => {
            dispatch(flipperActions.sendForceSetPropertyValue({instanceUUID, propertyName, value, valueType}));
          }}
        />
        : null
      }
    </DetailSidebar>
  );
}
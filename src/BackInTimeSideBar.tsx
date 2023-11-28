import {DetailSidebar, useValue} from "flipper-plugin";
import PropertyInspector from "./sidebar/PropertyInspector";
import React from "react";
import {useSelector} from "react-redux";
import {selectRegisteredInstances, selectValueChanges} from "./flipperReducer";
import {selectSelectedInstanceUUID, selectSelectedPropertyName} from "./appReducer";

export default () => {
  const instances = useSelector(selectRegisteredInstances);
  const valueChanges = useSelector(selectValueChanges);
  const selectedPropertyName = useSelector(selectSelectedPropertyName);
  const selectedInstanceUUID = useSelector(selectSelectedInstanceUUID);
  const selectedInstance = instances.find((instance) => instance.instanceUUID === selectedInstanceUUID);
  const selectedPropertyValueChangeLog = valueChanges.filter((event) =>
    event.instanceUUID === selectedInstanceUUID && event.propertyName === selectedPropertyName);

  return (
    <DetailSidebar width={600}>
      {selectedPropertyName && selectedInstance ?
        <PropertyInspector
          selectedInstance={selectedInstance}
          selectedPropertyName={selectedPropertyName}
          selectedPropertyValueChangeLog={selectedPropertyValueChangeLog}/>
        : null
      }
    </DetailSidebar>
  );
}
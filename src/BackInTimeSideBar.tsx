import {DetailSidebar, useValue} from "flipper-plugin";
import PropertyInspector from "./sidebar/PropertyInspector";
import React from "react";
import {State} from "./ViewModel";

type BackInTimeSideBarProps = { state: State };

export default ({state}: BackInTimeSideBarProps) => {
  const selectedProperty = useValue(state.selectedPropertyName);
  const selectedInstance = useValue(state.selectedInstance);
  const selectedPropertyValueChangeLog = useValue(state.selectedPropertyValueChangeLog);

  return (
    <DetailSidebar width={600}>
      {selectedProperty && selectedInstance ?
        <PropertyInspector
          selectedInstance={selectedInstance}
          selectedPropertyName={selectedProperty}
          selectedPropertyValueChangeLog={selectedPropertyValueChangeLog}/>
        : null
      }
    </DetailSidebar>
  );
}
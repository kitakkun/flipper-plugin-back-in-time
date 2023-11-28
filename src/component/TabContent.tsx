import RegisteredInstancePage from "../page/registered_instance/RegisteredInstancePage";
import RawLogPage from "../page/raw_logs/RawLogPage";
import React from "react";
import {Actions, State} from "../ViewModel";
import {useValue} from "flipper-plugin";

type TabContentProps = {
  activeTabIndex: number;
  state: State;
  actions: Actions;
  refreshInstanceAliveStatus: (instanceUUIDs: string[]) => void;
};

export default ({activeTabIndex, state, actions, refreshInstanceAliveStatus}: TabContentProps) => {
  const registeredInfo = useValue(state.registeredInstances);
  const valueChangeLog = useValue(state.valueChangeLog);
  const rawEventLog = useValue(state.rawEventLog);

  switch (activeTabIndex) {
    case 0:
      return <RegisteredInstancePage
        instances={registeredInfo}
        onSelectProperty={(instanceUUID, propertyName) => {
          actions.selectProperty(instanceUUID, propertyName);
        }}
        onClickRefresh={() => refreshInstanceAliveStatus(registeredInfo.map((info) => info.instanceUUID))}
        valueChangedEvents={valueChangeLog}
      />
    case 1:
      return <RawLogPage rawEventLog={rawEventLog}/>
    default:
      return null;
  }
}

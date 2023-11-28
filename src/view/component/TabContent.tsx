import RegisteredInstancePage from "../page/registered_instance/RegisteredInstancePage";
import RawLogPage from "../page/raw_logs/RawLogPage";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {selectRawEvents, selectRegisteredInstances, selectValueChanges} from "../../reducer/flipperReducer";
import {appActions} from "../../reducer/appReducer";

type TabContentProps = {
  activeTabIndex: number;
  refreshInstanceAliveStatus: (instanceUUIDs: string[]) => void;
};

export default ({activeTabIndex, refreshInstanceAliveStatus}: TabContentProps) => {
  const registeredInfo = useSelector(selectRegisteredInstances);
  const valueChangeLog = useSelector(selectValueChanges);
  const rawEventLog = useSelector(selectRawEvents);
  const dispatch = useDispatch();

  switch (activeTabIndex) {
    case 0:
      return <RegisteredInstancePage
        instances={registeredInfo}
        onSelectProperty={(instanceUUID, propertyName) => {
          dispatch(appActions.selectProperty({instanceUUID, propertyName}))
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
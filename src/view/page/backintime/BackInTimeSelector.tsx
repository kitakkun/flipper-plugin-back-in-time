import {createSelector} from "@reduxjs/toolkit";
import {backInTimeReducerStateSelector} from "./BackInTimeReducer";
import {instanceInfoListSelector, methodCallInfoListSelector} from "../../../reducer/appReducer";
import {HistoryInfo} from "./HistoryInfo";

export interface BackInTimeState {
  open: boolean;
  histories: HistoryInfo[];
}

export const backInTimeStateSelector = createSelector(
  [backInTimeReducerStateSelector,
    instanceInfoListSelector,
    methodCallInfoListSelector,
  ],
  (reducerState, instanceInfoList, methodCallInfoList) => {
    const instanceInfo = instanceInfoList.find((info) => info.uuid == reducerState.instanceUUID);

    const registerEvent: HistoryInfo = {
      title: "register",
      timestamp: instanceInfo?.registeredAt ?? 0,
      subtitle: "uuid: " + instanceInfo?.uuid,
      description: instanceInfo?.className ?? "",
    };

    const methodCallEvents: HistoryInfo[] = methodCallInfoList.map((info) => {
      return {
        title: "methodCall",
        timestamp: info.calledAt,
        subtitle: info.methodName,
        description: info.valueChanges.map((change) => `${change.propertyName} = ${change.value}`).join(", "),
      } as HistoryInfo;
    });

    return {
      open: reducerState.open,
      histories: [registerEvent, ...methodCallEvents]
    } as BackInTimeState;
  }
)
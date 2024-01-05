import {createSelector} from "@reduxjs/toolkit";
import {classInfoListSelector, instanceInfoListSelector, methodCallInfoListSelector} from "../../../reducer/appReducer";
import {PropertyInspectorState} from "./PropertyInspectorView";
import {sidebarStateSelector} from "../../../reducer/sidebarReducer";

export const propertyInspectorStateSelector = createSelector(
  [instanceInfoListSelector, classInfoListSelector, methodCallInfoListSelector, sidebarStateSelector],
  (instanceInfoList, classInfoList, methodCallInfoList, state) => {
    const instanceInfo = instanceInfoList.find((info) => info.uuid == state?.instanceUUID)
    const classInfo = classInfoList.find((info) => info.name == instanceInfo?.className);
    const propertyInfo = classInfo?.properties.find((info) => info.name == state?.propertyName);
    const filteredMethodCallInfoList = methodCallInfoList.filter((event) => event.instanceUUID == state?.instanceUUID && event.valueChanges.some((change) => change.propertyName == state?.propertyName));

    return {
      instanceInfo: instanceInfo,
      propertyInfo: propertyInfo,
      methodCallInfoList: filteredMethodCallInfoList,
    } as PropertyInspectorState;
  }
);

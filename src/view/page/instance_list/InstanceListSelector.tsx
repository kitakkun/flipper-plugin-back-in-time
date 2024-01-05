import {classInfoListSelector, instanceInfoListSelector, methodCallInfoListSelector} from "../../../reducer/appReducer";
import {createSelector} from "@reduxjs/toolkit";
import {persistentStateSelector} from "../../../reducer/PersistentStateReducer";
import {InstanceItem, InstanceListState, PropertyItem} from "./InstanceListView";

export const selectInstanceList = createSelector(
  [instanceInfoListSelector, classInfoListSelector, methodCallInfoListSelector, persistentStateSelector],
  (instanceInfoList, classInfoList, methodCallInfoList, persistentState): InstanceListState => {
    const aliveInstance = instanceInfoList.filter((instance) => instance.alive)

    const instances = aliveInstance.map((instance) => {
      const classInfo = classInfoList.find((info) => info.name == instance.className);
      if (!classInfo) return;
      return {
        name: classInfo.name,
        uuid: instance.uuid,
        properties: classInfo.properties.map((property) => (
          {
            name: property.name,
            type: property.type,
            debuggable: property.debuggable,
          } as PropertyItem
        )),
      } as InstanceItem;
    }).filter((instance) => instance != null) as InstanceItem[];

    const propertyToEventCountMap = new Map<string, number>();
    methodCallInfoList
      .filter((info) => aliveInstance.some((instance) => instance.uuid == info.instanceUUID))
      .forEach((event) => {
        event.valueChanges.forEach((change) => {
          const key = `${event.instanceUUID}-${change.propertyName}`;
          const count = propertyToEventCountMap.get(key) ?? 0;
          propertyToEventCountMap.set(key, count + 1);
        })
      });
    const getPropertyEventCount = (instanceUUID: string, propertyName: string) => methodCallInfoList
      .filter((info) => info.instanceUUID == instanceUUID)
      .flatMap((info) => info.valueChanges.filter((change) => change.propertyName == propertyName))
      .length;

    return {
      instances: instances,
      showNonDebuggableProperty: persistentState.showNonDebuggableProperty,
      getPropertyEventCount: getPropertyEventCount,
    } as InstanceListState;
  }
);
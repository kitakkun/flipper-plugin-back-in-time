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
      const allValueChangeEvents = methodCallInfoList
        .filter((info) => info.instanceUUID == instance.uuid)
        .flatMap((info) => info.valueChanges);
      if (!classInfo) return;
      return {
        name: classInfo.name,
        superClassName: classInfo.superClassName,
        uuid: instance.uuid,
        properties: classInfo.properties.map((property) => (
          {
            name: property.name,
            type: property.type,
            debuggable: property.debuggable,
            eventCount: allValueChangeEvents.filter((event) => event.propertyName == property.name).length,
          } as PropertyItem
        )),
      } as InstanceItem;
    }).filter((instance) => instance != null) as InstanceItem[];

    return {
      instances: instances,
      showNonDebuggableProperty: persistentState.showNonDebuggableProperty,
    } as InstanceListState;
  }
);
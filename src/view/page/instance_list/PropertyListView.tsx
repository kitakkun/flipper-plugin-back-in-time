import {Badge, List} from "antd";
import React from "react";
import {InstanceItem} from "./InstanceListView";

export function PropertyListView({instance, onClickProperty, getNumOfEvents, showNonDebuggableProperty}: {
  instance: InstanceItem,
  onClickProperty: (propertyName: string) => void,
  getNumOfEvents: (propertyName: string) => number,
  showNonDebuggableProperty: boolean,
}) {
  return (
    <List
      dataSource={instance.properties}
      renderItem={(property) => (
        <List.Item
          key={property.name}
          onClick={() => onClickProperty(property.name)}
          hidden={!showNonDebuggableProperty && !property.debuggable}
        >
          <>
            <List.Item.Meta
              title={property.name}
              description={property.type}
            />
            <Badge count={getNumOfEvents(property.name)}/>
          </>
        </List.Item>
      )}
    />
  );
}

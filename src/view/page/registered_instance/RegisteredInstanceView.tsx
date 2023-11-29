import React from "react";

import {NotifyValueChange} from "../../../events/FlipperIncomingEvents";
import {DebuggableStateHolderInfo} from "../../../data/RegisterInstance";
import {Badge, Button, Collapse, List, Typography} from "antd";
import {ReloadOutlined} from "@ant-design/icons";
import {Layout, theme} from "flipper-plugin";

type InstanceListProps = {
  instances: DebuggableStateHolderInfo[];
  onSelectProperty: (instanceUUID: string, propertyName: string) => void;
  onClickRefresh: () => void;
  valueChangedEvents: NotifyValueChange[];
}

export default function RegisteredInstanceView({instances, onSelectProperty, onClickRefresh, valueChangedEvents}: InstanceListProps) {
  const eventsByInstance = (instanceUUID: string) => {
    const events = valueChangedEvents.filter((event) => event.instanceUUID == instanceUUID);
    if (!events) return [];
    return events;
  }

  return <Layout.Container padv={theme.inlinePaddingV} padh={theme.inlinePaddingH} gap={theme.space.medium}>
    <Button onClick={onClickRefresh}>Refresh<ReloadOutlined/></Button>
    <Collapse>
      {instances.map((instance) => (
        <Collapse.Panel header={<InstanceHeader instance={instance}/>} key={instance.instanceUUID}>
          <InstanceProperties
            instance={instance}
            onClickProperty={(propertyName) => {
              onSelectProperty(instance.instanceUUID, propertyName);
            }}
            getNumOfEvents={(propertyName) => {
              return eventsByInstance(instance.instanceUUID).filter((event) => event.propertyName == propertyName).length;
            }}
          />
        </Collapse.Panel>
      ))}
    </Collapse>
  </Layout.Container>;
}

function InstanceHeader({instance}: {
  instance: DebuggableStateHolderInfo
}) {
  return (
    <>
      <Typography.Title level={5}>{instance.instanceType}</Typography.Title>
      <Typography.Text>id: {instance.instanceUUID}</Typography.Text>
    </>
  )
}

function InstanceProperties({instance, onClickProperty, getNumOfEvents}: {
  instance: DebuggableStateHolderInfo,
  onClickProperty: (propertyName: string) => void,
  getNumOfEvents: (propertyName: string) => number,
}) {
  return (
    <List
      dataSource={instance.properties}
      renderItem={(property) => (
        <List.Item
          key={property.name}
          onClick={() => {
            onClickProperty(property.name)
          }}
        >
          <>
            <List.Item.Meta
              title={property.name}
              description={property.propertyType}
            />
            <Badge count={getNumOfEvents(property.name)}/>
          </>
        </List.Item>
      )}
    />
  );
}

import React from "react";
import {DebuggableStateHolderInfo} from "../../../data/RegisterInstance";
import {Badge, Button, Collapse, List, Switch, Typography} from "antd";
import {ReloadOutlined} from "@ant-design/icons";
import {Layout, theme} from "flipper-plugin";
import {InstanceListState} from "./InstanceListReducer";

type InstanceListProps = {
  state: InstanceListState;
  onSelectProperty: (instanceUUID: string, propertyName: string) => void;
  onClickRefresh: () => void;
  onChangeNonDebuggablePropertyVisible: (visible: boolean) => void;
}

export function InstanceListView(
  {
    state,
    onSelectProperty,
    onClickRefresh,
    onChangeNonDebuggablePropertyVisible,
  }: InstanceListProps
) {
  const eventsByInstance = (instanceUUID: string) => {
    const events = state.valueChangedEvents.filter((event) => event.instanceUUID == instanceUUID);
    if (!events) return [];
    return events;
  }

  return <Layout.Container padv={theme.inlinePaddingV} padh={theme.inlinePaddingH} gap={theme.space.medium} grow={true}>
    <Layout.Horizontal gap={theme.space.medium} style={{display: "flex", alignItems: "center"}}>
      show non-debuggable properties:
      <Switch
        checked={state.nonDebuggablePropertyVisible}
        onChange={(visible) => {
          onChangeNonDebuggablePropertyVisible(visible)
        }}
      />
      <Button onClick={onClickRefresh}>Refresh<ReloadOutlined/></Button>
    </Layout.Horizontal>
    <Layout.ScrollContainer>
      <Collapse>
        {state.instances.map((instance) => (
          <Collapse.Panel header={<InstanceHeader instance={instance}/>} key={instance.instanceUUID}>
            <InstanceProperties
              instance={instance}
              onClickProperty={(propertyName) => {
                onSelectProperty(instance.instanceUUID, propertyName);
              }}
              nonDebuggablePropertyVisible={state.nonDebuggablePropertyVisible}
              getNumOfEvents={(propertyName) => {
                return eventsByInstance(instance.instanceUUID).filter((event) => event.propertyName == propertyName).length;
              }}
            />
          </Collapse.Panel>
        ))}
      </Collapse>
    </Layout.ScrollContainer>
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

function InstanceProperties({instance, onClickProperty, getNumOfEvents, nonDebuggablePropertyVisible}: {
  instance: DebuggableStateHolderInfo,
  onClickProperty: (propertyName: string) => void,
  getNumOfEvents: (propertyName: string) => number,
  nonDebuggablePropertyVisible: boolean,
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
          hidden={!nonDebuggablePropertyVisible && !property.debuggable}
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

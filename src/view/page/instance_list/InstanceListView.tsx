import React from "react";
import {Button, Collapse, CollapsePanelProps, Row, Switch, Typography} from "antd";
import {ReloadOutlined} from "@ant-design/icons";
import {Layout, theme} from "flipper-plugin";
import {PropertyListView} from "./PropertyListView";
import {History} from "@mui/icons-material";

export interface InstanceItem {
  name: string;
  uuid: string;
  superClassName: string;
  properties: PropertyItem[];
}

export interface PropertyItem {
  name: string;
  type: string;
  debuggable: boolean;
}

export interface InstanceListState {
  instances: InstanceItem[];
  showNonDebuggableProperty: boolean;
  getPropertyEventCount: (instanceUUID: string, propertyName: string) => number;
}

type InstanceListProps = {
  state: InstanceListState;
  onSelectProperty: (instanceUUID: string, propertyName: string) => void;
  onClickRefresh: () => void;
  onChangeNonDebuggablePropertyVisible: (visible: boolean) => void;
  onClickHistory: (instanceUUID: string) => void;
}

export function InstanceListView({state, onSelectProperty, onClickRefresh, onChangeNonDebuggablePropertyVisible, onClickHistory,}: InstanceListProps) {
  const items: CollapsePanelProps[] = state.instances.map((instance) => ({
    key: instance.uuid,
    header: <>
      <Typography.Title level={5}>{instance.name}</Typography.Title>
      <Row justify={"space-between"} align={"middle"}>
        <Typography.Text>id: {instance.uuid}</Typography.Text>
        <Button onClick={() => onClickHistory(instance.uuid)}>
          <Row align={"middle"} gutter={theme.space.small}>
            <History/>History
          </Row>
        </Button>
      </Row>
    </>,
    children: <PropertyListView
      instance={instance}
      onClickProperty={(propertyName) => onSelectProperty(instance.uuid, propertyName)}
      showNonDebuggableProperty={state.showNonDebuggableProperty}
      getNumOfEvents={(propertyName) => state.getPropertyEventCount(instance.uuid, propertyName)}
    />
  }));

  return <Layout.Container padv={theme.inlinePaddingV} padh={theme.inlinePaddingH} gap={theme.space.medium} grow={true}>
    <Layout.Horizontal gap={theme.space.medium} style={{display: "flex", alignItems: "center"}}>
      show non-debuggable properties:
      <Switch
        checked={state.showNonDebuggableProperty}
        onChange={(visible) => {
          onChangeNonDebuggablePropertyVisible(visible)
        }}
      />
      <Button onClick={onClickRefresh}>Refresh<ReloadOutlined/></Button>
    </Layout.Horizontal>
    <Layout.ScrollContainer>
      <Collapse>
        {items.map((item) => <Collapse.Panel {...item}/>)}
      </Collapse>
    </Layout.ScrollContainer>
  </Layout.Container>;
}


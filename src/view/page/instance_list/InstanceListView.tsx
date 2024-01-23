import React from "react";
import {Badge, Button, Row, Switch, Tree, TreeDataNode, Typography} from "antd";
import {DownOutlined, ReloadOutlined} from "@ant-design/icons";
import {Layout, theme} from "flipper-plugin";
import {History} from "@mui/icons-material";
import {Box} from "@mui/material";

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
  eventCount: number;
}

export interface InstanceListState {
  instances: InstanceItem[];
  showNonDebuggableProperty: boolean;
}

type InstanceListProps = {
  state: InstanceListState;
  onSelectProperty: (instanceUUID: string, propertyName: string) => void;
  onClickRefresh: () => void;
  onChangeNonDebuggablePropertyVisible: (visible: boolean) => void;
  onClickHistory: (instanceUUID: string) => void;
}

export function InstanceListView({state, onSelectProperty, onClickRefresh, onChangeNonDebuggablePropertyVisible, onClickHistory,}: InstanceListProps) {
  const treeData: TreeDataNode[] = state.instances.map((instance) => ({
    title: (
      <Row
        justify={"space-between"}
        style={{padding: theme.space.small, backgroundColor: theme.backgroundWash}}
        align={"middle"}
      >
        <Box>
          <Typography.Title level={4}>{instance.name}</Typography.Title>
          <Typography.Text type={"secondary"}>uuid: {instance.uuid}</Typography.Text>
        </Box>
        <Button
          onClick={(event) => {
            event.stopPropagation();
            onClickHistory(instance.uuid);
          }}
        >
          <Row align={"middle"} gutter={theme.space.medium}>
            <History/>History
          </Row>
        </Button>
      </Row>
    ),
    selectable: false,
    key: instance.uuid,
    children: instance.properties
      .filter((property) => state.showNonDebuggableProperty || property.debuggable)
      .map((property) => ({
        title: (
          <Row justify={"space-between"} align={"middle"} style={{padding: theme.space.small}}>
            <Typography.Text>{property.name}</Typography.Text>
            <Badge count={property.eventCount}/>
          </Row>
        ),
        key: `${instance.uuid}/${property.name}`
      }))
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
      <Tree
        treeData={treeData}
        onSelect={(selectedKeys, info) => {
          const nodeInfo = info.node.key.toString().split("/");
          nodeInfo.length == 2 && onSelectProperty(nodeInfo[0], nodeInfo[1]);
        }}
        blockNode
        showLine
        switcherIcon={<DownOutlined size={80}/>}
      />
    </Layout.ScrollContainer>
  </Layout.Container>;
}


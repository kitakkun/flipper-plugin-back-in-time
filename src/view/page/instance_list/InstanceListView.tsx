import React from "react";
import {Badge, Button, Row, Switch, Tree, TreeDataNode, Typography} from "antd";
import {DownOutlined, ReloadOutlined} from "@ant-design/icons";
import {Layout, styled, theme} from "flipper-plugin";
import {RiInstanceFill, RiInstanceLine} from "react-icons/ri";
import {History} from "@mui/icons-material";
import {Box} from "@mui/material";
import {StateHolderType} from "./StateHolderType";

export interface InstanceItem {
  name: string;
  uuid: string;
  superClassName: string;
  properties: PropertyItem[];
  superInstanceItem?: InstanceItem;
}

export interface PropertyItem {
  name: string;
  type: string;
  debuggable: boolean;
  eventCount: number;
  stateHolderInstance?: InstanceItem;
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

const StyledTree = styled(Tree)`
  .ant-tree-switcher {
    background: transparent !important;
  }
`;

export function InstanceListView({state, onSelectProperty, onClickRefresh, onChangeNonDebuggablePropertyVisible, onClickHistory,}: InstanceListProps) {
  const treeData: TreeDataNode[] = state.instances.map((instance) =>
    instanceItemToTreeDataNode(
      instance,
      instance.uuid,
      onClickHistory,
      state.showNonDebuggableProperty,
      StateHolderType.SUBCLASS,
    )
  );
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
      <StyledTree
        treeData={treeData}
        onSelect={(selectedKeys, info) => {
          const nodeInfo = info.node.key.toString().split("/");
          nodeInfo.length == 2 && onSelectProperty(nodeInfo[0], nodeInfo[1]);
        }}
        blockNode
        showLine
        switcherIcon={<DownOutlined/>}
        showIcon
      />
    </Layout.ScrollContainer>
  </Layout.Container>;
}

function instanceItemToTreeDataNode(
  instance: InstanceItem,
  key: string,
  onClickHistory: (instanceUUID: string) => void,
  showNonDebuggableProperty: boolean,
  stateHolderType: StateHolderType,
  instanceAsProperty?: PropertyItem,
): TreeDataNode {
  const title = instanceNodeTitle(instance, stateHolderType, onClickHistory, instanceAsProperty);

  const propertyNodes = instance.properties
    .filter((property) => showNonDebuggableProperty || property.debuggable)
    .map((property) => {
      if (property.stateHolderInstance) {
        return instanceItemToTreeDataNode(
          property.stateHolderInstance,
          `${key}/${property.name}`,
          onClickHistory,
          showNonDebuggableProperty,
          StateHolderType.EXTERNAL,
          property,
        );
      } else {
        return normalPropertyTreeNode(property, key);
      }
    });

  const superClassTreeDataNode = instance.superInstanceItem ? instanceItemToTreeDataNode(
    instance.superInstanceItem,
    `${key}/${instance.superClassName}`,
    onClickHistory,
    showNonDebuggableProperty,
    StateHolderType.SUPERCLASS,
  ) : undefined;

  const getStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {background: theme.backgroundWash};
    const borderStyle: React.CSSProperties = {};

    if (stateHolderType == StateHolderType.SUBCLASS) {
      borderStyle.borderTopRightRadius = theme.borderRadius;
      borderStyle.borderTopLeftRadius = theme.borderRadius;
      if (!instance.superInstanceItem) {
        borderStyle.borderBottomLeftRadius = theme.borderRadius;
        borderStyle.borderBottomRightRadius = theme.borderRadius;
      }
    } else {
      if (!instance.superInstanceItem) {
        borderStyle.borderBottomLeftRadius = theme.borderRadius;
        borderStyle.borderBottomRightRadius = theme.borderRadius;
      }
    }
    return {...baseStyle, ...borderStyle};
  }

  return {
    title: title,
    selectable: false,
    key: key,
    children: superClassTreeDataNode ? [superClassTreeDataNode, ...propertyNodes] : propertyNodes,
    style: getStyle(),
  }
}

function instanceNodeTitle(instance: InstanceItem, stateHolderType: StateHolderType, onClickHistory: (instanceUUID: string) => void, instanceAsProperty?: PropertyItem) {
  let label;
  if (stateHolderType == StateHolderType.SUBCLASS) {
    label = instance.uuid;
  } else if (stateHolderType == StateHolderType.SUPERCLASS) {
    label = "super";
  } else {
    label = `external dependency (${instance.uuid})`;
  }

  return <div style={{padding: theme.space.small}}>
    <Row align={"middle"} gutter={theme.space.small}>
      {stateHolderType == StateHolderType.SUBCLASS ? <RiInstanceFill/> : <RiInstanceLine/>}
      <Typography.Text type={"secondary"}>{label}</Typography.Text>
    </Row>
    <Row justify={"space-between"} align={"middle"}>
      <Box>
        <Typography.Title level={4}>{instance.name}</Typography.Title>
        {instanceAsProperty && <Typography.Text type={"secondary"}>as {instanceAsProperty.name}</Typography.Text>}
      </Box>
      {(stateHolderType != StateHolderType.SUPERCLASS) &&
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
      }
    </Row>
  </div>;
}

function normalPropertyTreeNode(property: PropertyItem, key: string): TreeDataNode {
  return {
    title: (
      <Row justify={"space-between"} align={"middle"} style={{padding: theme.space.small}}>
        {property.stateHolderInstance && <RiInstanceLine color={theme.warningColor}/>}
        <Typography.Text>{property.name}</Typography.Text>
        <Row align={"middle"} gutter={theme.space.medium}>
          <Typography.Text type={"secondary"}>{property.type}</Typography.Text>
          <Row style={{width: 50}} align={"middle"} justify={"center"}>
            <Badge count={property.eventCount}/>
          </Row>
        </Row>
      </Row>
    ),
    key: `${key}/${property.name}`,
  };
}
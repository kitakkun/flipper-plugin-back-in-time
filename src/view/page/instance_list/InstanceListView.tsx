import React, {useMemo} from "react";
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

interface MyTreeDataNode extends TreeDataNode {
  nodeType: "instance" | "property";
}

interface InstanceTreeDataNode extends MyTreeDataNode {
  nodeType: "instance";
  uuid: string;
  name: string;
  nameAsProperty?: string;
  stateHolderType: StateHolderType;
}

interface PropertyTreeDataNode extends MyTreeDataNode {
  nodeType: "property";
  instanceUUID: string;
  name: string;
  type: string;
  eventCount: number;
  debuggable: boolean;
}

function isInstanceTreeDataNode(node: any): node is InstanceTreeDataNode {
  return node.nodeType == "instance";
}

function isPropertyTreeDataNode(node: any): node is PropertyTreeDataNode {
  return node.nodeType == "property";
}

export function InstanceListView({state, onSelectProperty, onClickRefresh, onChangeNonDebuggablePropertyVisible, onClickHistory,}: InstanceListProps) {
  const treeData: TreeDataNode[] = useMemo(() =>
      state.instances.map((instance) => instanceItemToTreeDataNode(instance, StateHolderType.SUBCLASS, state.showNonDebuggableProperty)),
    [state.instances, state.showNonDebuggableProperty],
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
        onSelect={(_, info) => {
          const node = info.node as unknown as MyTreeDataNode;
          if (node.nodeType == "property") {
            const castedNode = node as PropertyTreeDataNode;
            onSelectProperty(castedNode.instanceUUID, castedNode.name);
          } else if (node.nodeType == "instance") {
            const castedNode = node as InstanceTreeDataNode;
            onClickHistory(castedNode.uuid);
          }
        }}
        blockNode
        showLine
        switcherIcon={<DownOutlined/>}
        showIcon
        titleRender={(node) => {
          if (isInstanceTreeDataNode(node)) {
            return instanceNodeTitle(node.name, node.uuid, node.stateHolderType, onClickHistory, node.nameAsProperty);
          } else if (isPropertyTreeDataNode(node)) {
            return PropertyNodeTitle(node.name, node.type, node.eventCount)
          }
          return <></>;
        }}
      />
    </Layout.ScrollContainer>
  </Layout.Container>;
}

function PropertyNodeTitle(name: string, type: string, eventCount: number) {
  return <Row justify={"space-between"} align={"middle"} style={{padding: theme.space.small}}>
    <Typography.Text>{name}</Typography.Text>
    <Row align={"middle"} gutter={theme.space.medium}>
      <Typography.Text type={"secondary"}>{type}</Typography.Text>
      <Row style={{width: 50}} align={"middle"} justify={"center"}>
        <Badge count={eventCount}/>
      </Row>
    </Row>
  </Row>;
}

/**
 * construct tree data node from instance item
 * example:
 * - root(subclass) node
 *   - super class node
 *   - property node(state holder)
 *   - property node(normal)
 *
 * keys:
 * - root(subclass) node: instance.uuid
 * - super class node: instance.uuid/instance.superClassName
 * - property node(state holder): instance.uuid/property.name/property.stateHolderInstance.uuid/...
 * - property node(normal): instance.uuid/property.name
 */
function instanceItemToTreeDataNode(
  instance: InstanceItem,
  stateHolderType: StateHolderType,
  showNonDebuggableProperty: boolean,
  key: string = instance.uuid,
  instanceAsProperty?: PropertyItem,
): InstanceTreeDataNode {
  const filteredProperties = instance.properties.filter((property) => showNonDebuggableProperty || property.debuggable);

  const stateHolderPropertyNodes = filteredProperties
    .filter((property) => property.stateHolderInstance)
    .map((property) =>
      instanceItemToTreeDataNode(
        property.stateHolderInstance!,
        StateHolderType.EXTERNAL,
        showNonDebuggableProperty,
        `${key}/${property.name}`,
        property,
      )
    );

  const normalPropertyNodes = filteredProperties
    .filter((property) => !property.stateHolderInstance)
    .map((property) => normalPropertyTreeNode(property, key, instance.uuid));

  const superClassTreeDataNode = instance.superInstanceItem ? instanceItemToTreeDataNode(
    instance.superInstanceItem,
    StateHolderType.SUPERCLASS,
    showNonDebuggableProperty,
    `${key}/${instance.superClassName}`,
  ) : undefined;

  const children = [...stateHolderPropertyNodes, ...normalPropertyNodes];
  if (superClassTreeDataNode) children.unshift(superClassTreeDataNode);

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
    nodeType: "instance",
    selectable: false,
    key: key,
    style: getStyle(),
    children: children,
    uuid: instance.uuid,
    name: instance.name,
    nameAsProperty: instanceAsProperty?.name,
    stateHolderType: stateHolderType,
  }
}

function instanceNodeTitle(name: string, uuid: string, stateHolderType: StateHolderType, onClickHistory: (instanceUUID: string) => void, nameAsProperty?: string) {
  const label = (stateHolderType == StateHolderType.SUBCLASS) ? uuid :
    (stateHolderType == StateHolderType.SUPERCLASS) ? "super" : `external dependency (${uuid})`;

  const showHistoryButton = stateHolderType != StateHolderType.SUPERCLASS;
  const instanceIcon = stateHolderType == StateHolderType.SUBCLASS ? <RiInstanceFill/> : <RiInstanceLine/>;

  return <div style={{padding: theme.space.small}}>
    <Row align={"middle"} gutter={theme.space.small}>
      {instanceIcon}
      <Typography.Text type={"secondary"}>{label}</Typography.Text>
    </Row>
    <Row justify={"space-between"} align={"middle"}>
      <Box>
        <Typography.Title level={4}>{name}</Typography.Title>
        {nameAsProperty && <Typography.Text type={"secondary"}>{nameAsProperty}</Typography.Text>}
      </Box>
      {showHistoryButton &&
          <Button
              onClick={(event) => {
                event.stopPropagation();
                onClickHistory(uuid);
              }}
              style={{padding: theme.space.small, display: "flex", alignItems: "center", justifyItems: "center"}}
          >
              <History fontSize={"small"}/>History
          </Button>
      }
    </Row>
  </div>;
}

function normalPropertyTreeNode(property: PropertyItem, key: string, instanceUUID: string): PropertyTreeDataNode {
  return {
    nodeType: "property",
    key: `${key}/${property.name}`,
    instanceUUID: instanceUUID,
    name: property.name,
    type: property.type,
    eventCount: property.eventCount,
    debuggable: property.debuggable,
  };
}
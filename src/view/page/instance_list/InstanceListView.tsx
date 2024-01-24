import React from "react";
import {Badge, Button, Row, Switch, Tree, TreeDataNode, Typography} from "antd";
import {DownOutlined, ReloadOutlined} from "@ant-design/icons";
import {Layout, styled, theme} from "flipper-plugin";
import {RiInstanceFill, RiInstanceLine} from "react-icons/ri";
import {History} from "@mui/icons-material";

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
    instanceItemToTreeData(
      instance,
      instance.uuid,
      onClickHistory,
      state.showNonDebuggableProperty,
      "sub",
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

function instanceItemToTreeData(
  instance: InstanceItem,
  key: string,
  onClickHistory: (instanceUUID: string) => void,
  showNonDebuggableProperty: boolean,
  nodeType: "sub" | "super",
): TreeDataNode {
  const title = (
    <div style={{padding: theme.space.small}}>
      <Row align={"middle"} gutter={theme.space.small}>
        {nodeType == "sub" ? <RiInstanceFill/> : <RiInstanceLine/>}
        <Typography.Text type={"secondary"}> {nodeType == "sub" ? instance.uuid : "super"} </Typography.Text>
      </Row>
      <Row
        justify={"space-between"}
        align={"middle"}
      >
        <Typography.Title level={4}>{instance.name}</Typography.Title>
        {nodeType == "sub" &&
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
    </div>
  );

  const properties = instance.properties
    .filter((property) => showNonDebuggableProperty || property.debuggable)
    .map((property) => ({
      title: (
        <Row justify={"space-between"} align={"middle"} style={{padding: theme.space.small}}>
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
    }));

  const superClassTreeData = instance.superInstanceItem ? instanceItemToTreeData(
    instance.superInstanceItem,
    `${key}/${instance.superClassName}`,
    onClickHistory,
    showNonDebuggableProperty,
    "super",
  ) : undefined;

  const getStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {background: theme.backgroundWash};
    const borderStyle: React.CSSProperties = {};

    if (nodeType == "sub") {
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
    children: superClassTreeData ? [superClassTreeData, ...properties] : properties,
    style: getStyle(),
  }
}
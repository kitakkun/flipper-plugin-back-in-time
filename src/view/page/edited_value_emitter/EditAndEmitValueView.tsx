import {EditAndEmitValueState} from "./EditAndEmitValueReducer";
import ReactJson from "@microlink/react-json-view";
import {Layout, theme} from "flipper-plugin";
import React from "react";
import {Typography} from "antd";

interface EditAndEmitValueViewProps {
  state: EditAndEmitValueState;
  onEdit: (edit: any) => void;
}

export function EditAndEmitValueView({state, onEdit}: EditAndEmitValueViewProps) {
  return (
    <Layout.Horizontal gap={theme.space.medium}>
      <ReactJson
        name={null}
        src={state.initialValue}
        theme={"rjv-default"}
        onEdit={(edit) => onEdit(edit.updated_src)}
        style={{width: "60%"}}
      />
      <Layout.Container>
        <Typography.Title level={5}>Property Info</Typography.Title>
        <Typography.Text>Instance UUID: {state.instanceUUID}</Typography.Text>
        <Typography.Text>Property Name: {state.propertyName}</Typography.Text>
        <Typography.Text>Value Type: {state.valueType}</Typography.Text>
      </Layout.Container>
    </Layout.Horizontal>
  );
}
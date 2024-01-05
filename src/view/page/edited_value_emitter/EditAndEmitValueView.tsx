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
        onEdit={(edit) => {
          if (typeof edit.new_value != typeof edit.existing_value) {
            return false;
          } else {
            onEdit(edit.updated_src)
            return true;
          }
        }}
        style={{width: "60%"}}
      />
      <Layout.Container>
        <Typography.Title level={5}>Property Info</Typography.Title>
        <Typography.Text>Instance UUID: {state.instanceUUID}</Typography.Text>
        <Typography.Text>Property Name: {state.propertyName}</Typography.Text>
        <Typography.Text>Value Type: {state.valueType}</Typography.Text>

        Note that the value type can not be edited.
      </Layout.Container>
    </Layout.Horizontal>
  );
}
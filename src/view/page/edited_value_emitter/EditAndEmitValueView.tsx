import {EditAndEmitValueState} from "./EditAndEmitValueReducer";
import ReactJson from "@microlink/react-json-view";
import {Layout, theme} from "flipper-plugin";
import React from "react";
import {Input, Typography} from "antd";

interface EditAndEmitValueViewProps {
  state: EditAndEmitValueState;
  onEdit: (edit: any) => void;
}

export function EditAndEmitValueView({state, onEdit}: EditAndEmitValueViewProps) {
  const valueType = typeof state.initialValue;
  // undefined に対して比較するとUIが死ぬ
  if (valueType == "undefined") return <>ERROR: undefined value detected.</>;
  return (
    <Layout.Horizontal gap={theme.space.medium}>
      {/* リテラルでJSONビュアーが表示されないFIX（もう1箇所ある）*/}
      <Layout.Container>
        {
          valueType == "object" ? <ReactJson
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
          /> : <Input defaultValue={state.initialValue} onChange={(e) => {
            onEdit(e.target.value)
          }}/>
        }
      </Layout.Container>
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
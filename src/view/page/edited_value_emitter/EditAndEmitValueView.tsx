import {EditAndEmitValueState} from "./EditAndEmitValueReducer";
import ReactJson from "@microlink/react-json-view";
import React from "react";

interface EditAndEmitValueViewProps {
  state: EditAndEmitValueState;
  onEdit: (edit: any) => void;
}

export function EditAndEmitValueView({state, onEdit}: EditAndEmitValueViewProps) {
  return (
    <ReactJson
      name={null}
      src={state.initialValue}
      theme={"rjv-default"}
      onEdit={(edit) => onEdit(edit.updated_src)}
    />
  );
}
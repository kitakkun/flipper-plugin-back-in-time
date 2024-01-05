import {useDispatch, useSelector} from "react-redux";
import {editAndEmitValueActions, editAndEmitValueStateSelector} from "./EditAndEmitValueReducer";
import {EditAndEmitValueView} from "./EditAndEmitValueView";
import React from "react";
import {flipperActions} from "../../../reducer/flipperReducer";
import {Modal} from "antd";

export function EditAndEmitValueModalPage() {
  const state = useSelector(editAndEmitValueStateSelector);
  const dispatch = useDispatch();
  return <Modal
    centered={true}
    open={state.open}
    title={"Edit and Emit Value"}
    cancelText={"Cancel"}
    okText={"Emit Edited Value"}
    onOk={() => {
      dispatch(
        flipperActions.sendForceSetPropertyValue({
          instanceUUID: state.instanceUUID,
          propertyName: state.propertyName,
          value: JSON.stringify(state.editingValue),
          valueType: state.valueType,
        })
      );
      dispatch(editAndEmitValueActions.close());
    }}
    onCancel={() => dispatch(editAndEmitValueActions.close())}
  >
    <EditAndEmitValueView
      state={state}
      onEdit={(edit) => dispatch(editAndEmitValueActions.updateEditingValue(edit))}
    />
  </Modal>;
}
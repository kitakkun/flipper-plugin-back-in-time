import {useDispatch, useSelector} from "react-redux";
import {flipperActions} from "../../../reducer/flipperReducer";
import React from "react";
import {ValueEmitView} from "./ValueEmitView";
import {valueEmitActions, valueEmitStateSelector} from "./ValueEmitReducer";
import {Modal} from "antd";
import {EditAndEmitValueModalPage} from "../edited_value_emitter/EditAndEmitValueModalPage";
import {editAndEmitValueActions} from "../edited_value_emitter/EditAndEmitValueReducer";

export function ValueEmitModalPage() {
  const state = useSelector(valueEmitStateSelector);
  const dispatch = useDispatch();

  return (
    <>
      <EditAndEmitValueModalPage/>
      <Modal
        centered={true}
        open={state.open}
        title={"Value Emitter"}
        footer={null}
        width={"80%"}
        onCancel={() => dispatch(valueEmitActions.close())}
      >
        <ValueEmitView
          state={state}
          onValueEmit={(propertyName: string, value: string) => {
            const instanceUUID = state.instanceInfo?.instanceUUID;
            const valueType = state.instanceInfo?.properties.find((property) => property.name == propertyName)?.valueType;
            if (!instanceUUID || !valueType) {
              return;
            }
            dispatch(flipperActions.sendForceSetPropertyValue({instanceUUID, propertyName, value, valueType}))
          }}
          onEditAndEmitValue={(propertyName: string, value: string) => {
            const instanceUUID = state.instanceInfo?.instanceUUID;
            const valueType = state.instanceInfo?.properties.find((property) => property.name == propertyName)?.valueType;
            if (!instanceUUID || !valueType) {
              return;
            }
            const parsedValue = JSON.parse(value);
            dispatch(
              editAndEmitValueActions.open({
                instanceUUID: instanceUUID,
                propertyName: propertyName,
                valueType: valueType,
                initialValue: parsedValue,
              })
            );
          }}
        />
      </Modal>
    </>
  );
}
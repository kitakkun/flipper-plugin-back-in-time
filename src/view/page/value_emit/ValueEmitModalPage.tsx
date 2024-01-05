import {useDispatch, useSelector} from "react-redux";
import {flipperActions} from "../../../reducer/flipperReducer";
import React from "react";
import {ValueEmitView} from "./ValueEmitView";
import {valueEmitActions, valueEmitStateSelector} from "./ValueEmitReducer";
import {Modal} from "antd";

export function ValueEmitModalPage() {
  const state = useSelector(valueEmitStateSelector);
  const dispatch = useDispatch();

  return (
    <Modal
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
      />
    </Modal>
  );
}
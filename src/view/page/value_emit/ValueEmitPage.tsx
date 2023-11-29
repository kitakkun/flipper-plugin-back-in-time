import {useDispatch, useSelector} from "react-redux";
import {
  flipperActions,
  selectMethodCalls,
  selectRegisteredInstances,
  selectValueChanges
} from "../../../reducer/flipperReducer";
import React from "react";
import {ValueEmitView} from "./ValueEmitView";

type ValueEmitPageProps = {
  onClose: () => void;
  targetMethodCallId: string;
  instanceUUID: string;
};

export function ValueEmitPage({onClose, targetMethodCallId, instanceUUID}: ValueEmitPageProps) {
  const instances = useSelector(selectRegisteredInstances);
  const methodCalls = useSelector(selectMethodCalls);
  const valueChanges = useSelector(selectValueChanges);
  const dispatch = useDispatch();

  const targetInstance = instances.find((instance) => instance.instanceUUID === instanceUUID);

  const targetMethodCall = methodCalls.find((methodCall) =>
    methodCall.methodCallUUID === targetMethodCallId && methodCall.instanceUUID === instanceUUID
  );

  const targetValueChange = valueChanges.filter((valueChange) =>
    valueChange.methodCallUUID === targetMethodCallId && valueChange.instanceUUID === instanceUUID
  );

  if (!targetInstance || !targetMethodCall) {
    return null;
  }

  return <ValueEmitView
    instance={targetInstance}
    methodCall={targetMethodCall}
    valueChanges={targetValueChange}
    onClickClose={onClose}
    onValueEmit={(instanceUUID: string, propertyName: string, value: string, valueType: string) => {
      dispatch(flipperActions.sendForceSetPropertyValue({instanceUUID, propertyName, value, valueType}))
    }}
  />;
}
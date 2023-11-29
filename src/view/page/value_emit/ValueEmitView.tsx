import MethodCallInfo from "./MethodCallInfo";
import TargetValueChangeTable from "./TargetValueChangeTable";
import React from "react";
import {NotifyMethodCall, NotifyValueChange} from "../../../events/FlipperIncomingEvents";
import {DebuggableStateHolderInfo} from "../../../data/RegisterInstance";
import {Layout, theme} from "flipper-plugin";

type ValueEmitViewProps = {
  instance: DebuggableStateHolderInfo;
  methodCall: NotifyMethodCall;
  valueChanges: NotifyValueChange[];
  onValueEmit: (instanceUUID: string, propertyName: string, value: string, valueType: string) => void;
};

export function ValueEmitView({onValueEmit, methodCall, instance, valueChanges}: ValueEmitViewProps) {
  return <Layout.Container padh={theme.inlinePaddingH} padv={theme.inlinePaddingV} gap={theme.space.medium}>
    <MethodCallInfo
      methodCallUUID={methodCall.methodCallUUID}
      instanceUUID={methodCall.instanceUUID}
      calledAt={methodCall.calledAt}
      methodName={methodCall.methodName}
    />
    <TargetValueChangeTable
      instance={instance}
      valueChanges={valueChanges}
      onClickEmitValue={onValueEmit}
    />
  </Layout.Container>;
}
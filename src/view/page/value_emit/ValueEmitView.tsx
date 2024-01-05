import MethodCallInfo from "./MethodCallInfo";
import {TargetValueChangeTable} from "./TargetValueChangeTable";
import React from "react";
import {Layout, theme} from "flipper-plugin";
import {ValueEmitState} from "./ValueEmitReducer";

type ValueEmitViewProps = {
  state: ValueEmitState,
  onValueEmit: (propertyName: string, value: string) => void;
};

export function ValueEmitView({onValueEmit, state}: ValueEmitViewProps) {
  if (!state.instanceInfo || !state.methodCallInfo) {
    return null;
  }

  return <Layout.Container padh={theme.inlinePaddingH} padv={theme.inlinePaddingV} gap={theme.space.medium}>
    <MethodCallInfo
      methodCallUUID={state.methodCallInfo?.callUUID}
      instanceUUID={state.instanceInfo.instanceUUID}
      calledAt={state.methodCallInfo.calledAt}
      methodName={state.methodCallInfo.methodName}
    />
    <TargetValueChangeTable
      instance={state.instanceInfo}
      methodCallInfo={state.methodCallInfo}
      onClickEmitValue={onValueEmit}
    />
  </Layout.Container>;
}
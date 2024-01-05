import {ChangedPropertiesView} from "./ChangedPropertiesView";
import React from "react";
import {Layout, theme} from "flipper-plugin";
import {ValueEmitState} from "./ValueEmitReducer";
import {MethodCallInfoView} from "./MethodCallInfoView";

type ValueEmitViewProps = {
  state: ValueEmitState,
  onValueEmit: (propertyName: string, value: string) => void;
  onEditAndEmitValue: (propertyName: string, value: string) => void;
};

export function ValueEmitView({state, onValueEmit, onEditAndEmitValue}: ValueEmitViewProps) {
  if (!state.instanceInfo || !state.methodCallInfo || !state.classInfo) {
    return null;
  }

  return (
    <Layout.Container padh={theme.inlinePaddingH} padv={theme.inlinePaddingV} gap={theme.space.medium} grow={true}>
      <MethodCallInfoView
        methodCallUUID={state.methodCallInfo?.callUUID}
        instanceUUID={state.instanceInfo.uuid}
        calledAt={state.methodCallInfo.calledAt}
        methodName={state.methodCallInfo.methodName}
      />
      <ChangedPropertiesView
        classInfo={state.classInfo}
        methodCallInfo={state.methodCallInfo}
        onClickEmitValue={onValueEmit}
        onClickEditAndEmitValue={onEditAndEmitValue}
      />
    </Layout.Container>
  );
}
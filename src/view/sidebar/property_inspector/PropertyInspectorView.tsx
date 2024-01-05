import React from "react";
import {InstanceInfoView} from "../InstanceInfoView";
import {PropertyInfoView} from "../PropertyInfoView";
import {PropertyValueChangesView} from "../PropertyValueChangesView";
import {Layout, theme} from "flipper-plugin";
import {MethodCallInfo} from "../../../data/MethodCallInfo";
import {InstanceInfo} from "../../../data/InstanceInfo";
import {PropertyInfo} from "../../../data/ClassInfo";

export interface PropertyInspectorState {
  instanceInfo: InstanceInfo | undefined;
  propertyInfo: PropertyInfo | undefined;
  methodCallInfoList: MethodCallInfo[];
}

type PropertyInspectorProps = {
  state: PropertyInspectorState;
  onClickValueChangeInfo: (methodCallInfo: MethodCallInfo) => void;
}

export default function PropertyInspectorView(
  {
    state,
    onClickValueChangeInfo,
  }: PropertyInspectorProps
) {
  if (!state.instanceInfo || !state.propertyInfo) {
    return null;
  }
  return (
    <>
      <Layout.Container gap={theme.space.medium} pad={theme.inlinePaddingH}>
        <InstanceInfoView instanceInfo={state.instanceInfo}/>
        <PropertyInfoView propertyInfo={state.propertyInfo}/>
        <PropertyValueChangesView
          methodCallInfoList={state.methodCallInfoList}
          selectedPropertyInfo={state.propertyInfo}
          onClickRow={(methodCallInfo) => {
            onClickValueChangeInfo(methodCallInfo)
          }}/>
      </Layout.Container>
    </>
  );
}

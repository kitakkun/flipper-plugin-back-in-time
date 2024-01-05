import React from "react";
import {DebuggableStateHolderInfo, PropertyInfo} from "../../../data/RegisterInstance";
import {InstanceInfoTable} from "../InstanceInfoTable";
import {PropertyInfoTable} from "../PropertyInfoTable";
import {PropertyValueChangeTable} from "../PropertyValueChangeTable";
import {Layout, theme} from "flipper-plugin";
import {MethodCallInfo} from "../../../data/MethodCallInfo";

type PropertyInspectorProps = {
  selectedInstance: DebuggableStateHolderInfo;
  selectedPropertyInfo: PropertyInfo;
  methodCallInfoList: MethodCallInfo[];
  onClickValueChangeInfo: (methodCallInfo: MethodCallInfo) => void;
}

export default function PropertyInspectorView(
  {
    selectedInstance,
    selectedPropertyInfo,
    methodCallInfoList,
    onClickValueChangeInfo,
  }: PropertyInspectorProps
) {
  return (
    <>
      <Layout.Container gap={theme.space.medium} pad={theme.inlinePaddingH}>
        <InstanceInfoTable instanceInfo={selectedInstance}/>
        <PropertyInfoTable propertyInfo={selectedPropertyInfo}/>
        <PropertyValueChangeTable
          methodCallInfoList={methodCallInfoList}
          selectedPropertyInfo={selectedPropertyInfo}
          onClickRow={(methodCallInfo) => {
            onClickValueChangeInfo(methodCallInfo)
          }}/>
      </Layout.Container>
    </>
  );
}

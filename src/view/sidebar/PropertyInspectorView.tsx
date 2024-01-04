import React from "react";
import {DebuggableStateHolderInfo, PropertyInfo} from "../../data/RegisterInstance";
import {NotifyValueChange} from "../../events/FlipperIncomingEvents";
import ValueEmitModal from "../page/value_emit/ValueEmitModal";
import {InstanceInfoTable} from "./InstanceInfoTable";
import {PropertyInfoTable} from "./PropertyInfoTable";
import {PropertyValueChangeTable} from "./PropertyValueChangeTable";
import {Layout, theme} from "flipper-plugin";

type PropertyInspectorProps = {
  selectedInstance: DebuggableStateHolderInfo;
  selectedPropertyInfo: PropertyInfo;
  selectedPropertyValueChangeLog: NotifyValueChange[];
}

export default function PropertyInspectorView(
  {
    selectedInstance,
    selectedPropertyInfo,
    selectedPropertyValueChangeLog,
  }: PropertyInspectorProps
) {
  const [open, setOpen] = React.useState(false);
  const [targetMethodCallId, setTargetMethodCallId] = React.useState("");

  return (
    <>
      <ValueEmitModal
        targetMethodCallId={targetMethodCallId}
        instanceUUID={selectedInstance.instanceUUID}
        open={open}
        onClose={() => setOpen(false)}
      />
      <Layout.Container gap={theme.space.medium} pad={theme.inlinePaddingH}>
        <InstanceInfoTable instanceInfo={selectedInstance}/>
        <PropertyInfoTable propertyInfo={selectedPropertyInfo}/>
        <PropertyValueChangeTable
          valueChanges={selectedPropertyValueChangeLog}
          onClickRow={(valueChange) => {
            setTargetMethodCallId(valueChange.methodCallUUID);
            setOpen(true);
          }}/>
      </Layout.Container>
    </>
  );
}

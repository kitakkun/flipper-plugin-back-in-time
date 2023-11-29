import React from "react";
import {DebuggableStateHolderInfo} from "../../data/RegisterInstance";
import {NotifyValueChange} from "../../events/FlipperIncomingEvents";
import ValueEmitModal from "../page/value_emit/ValueEmitModal";
import {InstanceInfoTable} from "./InstanceInfoTable";
import {PropertyInfoTable} from "./PropertyInfoTable";
import {PropertyValueChangeTable} from "./PropertyValueChangeTable";
import {Layout, theme} from "flipper-plugin";

type PropertyInspectorProps = {
  selectedInstance: DebuggableStateHolderInfo;
  selectedPropertyName: string;
  selectedPropertyValueChangeLog: NotifyValueChange[];
}

export default function PropertyInspector(
  {
    selectedInstance,
    selectedPropertyName,
    selectedPropertyValueChangeLog,
  }: PropertyInspectorProps
) {
  const property = selectedInstance.properties.find((property) => property.name == selectedPropertyName)
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
        {property ? <PropertyInfoTable propertyInfo={property}/> : null}
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

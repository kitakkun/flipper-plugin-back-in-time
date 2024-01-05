import React from "react";
import {DebuggableStateHolderInfo} from "../../../data/RegisterInstance";
import {Table, Typography} from "antd";
import {EmitButton} from "./EmitButton";
import {MethodCallInfo} from "../../../data/MethodCallInfo";

type TargetValueChangeTableProps = {
  instance: DebuggableStateHolderInfo;
  methodCallInfo: MethodCallInfo;
  onClickEmitValue: (propertyName: string, value: string) => void;
  onClickEditAndEmitValue: (propertyName: string, value: string) => void;
};

export function TargetValueChangeTable({instance, methodCallInfo, onClickEmitValue, onClickEditAndEmitValue}: TargetValueChangeTableProps) {
  const propertyInfo = (propertyName: string) => {
    return instance.properties.find((property) => property.name === propertyName);
  };

  const dataSource = methodCallInfo.valueChanges.map((valueChange) => {
    const property = propertyInfo(valueChange.propertyName)!;
    return {
      action: <EmitButton
        onClickEmitValue={() => onClickEmitValue(property.name, valueChange.value)}
        onClickEditValue={() => onClickEditAndEmitValue(property.name, valueChange.value)}
      />,
      name: property.name,
      type: property.propertyType,
      valueType: property.valueType,
      value: valueChange.value,
    };
  }).filter((value) => value != null);

  const columns = [
    {
      title: 'action',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'value type',
      dataIndex: 'valueType',
      key: 'valueType',
    },
    {
      title: 'value',
      dataIndex: 'value',
      key: 'value',
    },
  ]

  return (
    <>
      <Typography.Title level={5}>Value Changes</Typography.Title>
      <Table dataSource={dataSource} columns={columns} scroll={{x: true}}/>
    </>
  );
}
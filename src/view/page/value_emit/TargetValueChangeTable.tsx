import React from "react";
import {DebuggableStateHolderInfo} from "../../../data/RegisterInstance";
import {Table, Typography} from "antd";
import {EmitButton} from "./EmitButton";
import {MethodCallInfo} from "../../../data/MethodCallInfo";

type TargetValueChangeTableProps = {
  instance: DebuggableStateHolderInfo;
  methodCallInfo: MethodCallInfo;
  onClickEmitValue: (propertyName: string, value: string) => void;
};

export function TargetValueChangeTable({instance, methodCallInfo, onClickEmitValue}: TargetValueChangeTableProps) {
  const propertyInfo = (propertyName: string) => {
    return instance.properties.find((property) => property.name === propertyName);
  };

  const onClick = (propertyName: string, value: string) => {
    onClickEmitValue(propertyName, value);
  }

  const dataSource = methodCallInfo.valueChanges.map((valueChange) => {
    const property = propertyInfo(valueChange.propertyName)!;
    return {
      action: <EmitButton
        onClickEmitValue={() => onClick(property.name, valueChange.value)}
        onClickEditValue={() => {/* TODO */
        }}
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
import React from "react";
import {NotifyValueChange} from "../../../events/FlipperIncomingEvents";
import {DebuggableStateHolderInfo, PropertyInfo} from "../../../data/RegisterInstance";
import {Button, Table, Typography} from "antd";

type TargetValueChangeTableProps = {
  instance: DebuggableStateHolderInfo;
  valueChanges: NotifyValueChange[];
  onClickEmitValue: (instanceUUID: string, propertyName: string, value: string, valueType: string) => void;
};

export default ({instance, valueChanges, onClickEmitValue}: TargetValueChangeTableProps) => {
  const propertyInfo = (propertyName: string) => {
    return instance.properties.find((property) => property.name === propertyName);
  };

  const onClick = (propertyInfo: PropertyInfo, valueChangeEvent: NotifyValueChange) => {
    onClickEmitValue(instance.instanceUUID, propertyInfo.name, valueChangeEvent.value, propertyInfo.valueType);
  }

  const dataSource = valueChanges.map((valueChange) => {
    const property = propertyInfo(valueChange.propertyName)!;
    return {
      action: <Button onClick={() => onClick(property, valueChange)}>Emit Value</Button>,
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
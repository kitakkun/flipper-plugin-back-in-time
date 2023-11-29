import {Table, Typography} from "antd";
import React from "react";
import {PropertyInfo} from "../../data/RegisterInstance";

type PropertyInfoTableProps = {
  propertyInfo: PropertyInfo;
}

export function PropertyInfoTable({propertyInfo}: PropertyInfoTableProps) {
  const dataSource = [
    {
      key: '1',
      name: 'name',
      value: propertyInfo.name,
    },
    {
      key: '2',
      name: 'propertyType',
      value: propertyInfo.propertyType,
    },
    {
      key: '3',
      name: 'valueType',
      value: propertyInfo.valueType,
    },
    {
      key: '4',
      name: 'debuggable',
      value: propertyInfo.debuggable ? "true" : "false",
    },
  ];

  const columns = [
    {
      title: 'name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'value',
      dataIndex: 'value',
      key: 'value',
    },
  ];
  return <>
    <Typography.Title level={5}>Property Info</Typography.Title>
    <Table dataSource={dataSource} columns={columns} showHeader={false} size={"small"} pagination={false}/>
  </>;
}

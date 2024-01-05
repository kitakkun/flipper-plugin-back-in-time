import {Table, Typography} from "antd";
import React from "react";
import {InstanceInfo} from "../../data/InstanceInfo";

type InstanceInfoProps = {
  instanceInfo: InstanceInfo;
}

export function InstanceInfoView({instanceInfo}: InstanceInfoProps) {
  const dataSource = [
    {
      key: '1',
      name: 'id',
      value: instanceInfo.uuid,
    },
    {
      key: '2',
      name: 'type',
      value: instanceInfo.className,
    },
    {
      key: '3',
      name: 'registeredAt',
      value: instanceInfo.registeredAt,
    },
    {
      key: '4',
      name: 'alive',
      value: instanceInfo.alive ? "true" : "false",
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
    <Typography.Title level={5}>Instance Info</Typography.Title>
    <Table dataSource={dataSource} columns={columns} showHeader={false} size={"small"} pagination={false}/>
  </>
}

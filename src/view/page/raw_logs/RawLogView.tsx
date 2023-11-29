import React from "react";
import {RawEventLog} from "../../../data/RawEventLog";
import {Table} from "antd";

type RawLogPageProps = {
  rawEventLog: RawEventLog[];
}

export function RawLogView({rawEventLog}: RawLogPageProps) {
  const dataSource = rawEventLog.map((log, index) => {
    return {
      key: index,
      label: log.label,
      payload: JSON.stringify(log.payload),
    }
  });

  const columns = [
    {
      title: 'label',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: 'payload',
      dataIndex: 'payload',
      key: 'payload',
    },
  ];

  return (
    <Table dataSource={dataSource} columns={columns} scroll={{x: true}}/>
  );
}
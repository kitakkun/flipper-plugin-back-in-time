import React from "react";
import {RawEventLog} from "../../../data/RawEventLog";
import {Table} from "antd";
import {Layout, theme} from "flipper-plugin";

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
    <Layout.Container padv={theme.inlinePaddingV} padh={theme.inlinePaddingH} gap={theme.space.medium}>
      <Table dataSource={dataSource} columns={columns} scroll={{x: true}}/>
    </Layout.Container>
  );
}
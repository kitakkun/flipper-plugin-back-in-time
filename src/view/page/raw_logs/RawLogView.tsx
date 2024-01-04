import React from "react";
import {RawEventLog} from "../../../data/RawEventLog";
import {createDataSource, DataSource, DataTable, DataTableColumn, Layout, styled, theme} from "flipper-plugin";

type RawLogPageProps = {
  rawEventLog: RawEventLog[];
}

export function RawLogView({rawEventLog}: RawLogPageProps) {
  const dataSource = createDataSource(rawEventLog.map((log) => {
    return {
      label: log.label,
      payload: JSON.stringify(log.payload),
    }
  }));

  const columns: DataTableColumn[] = [
    {
      title: 'label',
      key: 'label',
      width: 100,
    },
    {
      title: 'payload',
      key: 'payload',
      width: "auto",
    },
  ];

  return (
    <Layout.Container padv={theme.inlinePaddingV} padh={theme.inlinePaddingH} gap={theme.space.medium} grow={true}>
      <DataTable columns={columns} dataSource={dataSource}/>
    </Layout.Container>
  );
}
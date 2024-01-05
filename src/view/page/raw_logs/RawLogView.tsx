import React from "react";
import {RawEventLog} from "../../../data/RawEventLog";
import {createDataSource, DataTable, DataTableColumn, Layout, theme} from "flipper-plugin";

export interface RawEventLogState {
  logs: RawEventLog[];
}

type RawLogPageProps = {
  state: RawEventLogState;
}

export function RawLogView({state}: RawLogPageProps) {
  const dataSource = createDataSource(state.logs.map((log) => {
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
import React from "react";
import {RawEventLog} from "../../../data/RawEventLog";
import {createDataSource, DataTable, DataTableColumn, Layout, theme} from "flipper-plugin";

export interface RawEventLogState {
  logs: RawEventLog[];
}

type RawLogPageProps = {
  state: RawEventLogState;
  onSelectLog: (log: RawEventLog) => void;
}

export function RawLogView({state, onSelectLog}: RawLogPageProps) {
  const dataSource = createDataSource(state.logs);
  const columns: DataTableColumn<RawEventLog>[] = [
    {
      title: 'time',
      key: 'time',
    },
    {
      title: 'label',
      key: 'label',
    },
    {
      title: 'payload',
      key: 'payload',
      onRender: log => <>{JSON.stringify(log.payload)}</>
    },
  ];


  return (
    <Layout.Container padv={theme.inlinePaddingV} padh={theme.inlinePaddingH} gap={theme.space.medium} grow={true}>
      <DataTable
        columns={columns}
        dataSource={dataSource}
        onSelect={(record, _) => {
          record && onSelectLog(record);
        }}
      />
    </Layout.Container>
  );
}
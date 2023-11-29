import {Table, Typography} from "antd";
import React from "react";
import {NotifyValueChange} from "../../events/FlipperIncomingEvents";

type PropertyValueChangeTableProps = {
  valueChanges: NotifyValueChange[];
  onClickRow: (valueChange: NotifyValueChange) => void;
}

export function PropertyValueChangeTable({valueChanges, onClickRow}: PropertyValueChangeTableProps) {
  const columns = [
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  return <>
    <Typography.Title level={5}>Value Change Log</Typography.Title>
    <Table
      dataSource={valueChanges}
      columns={columns}
      scroll={{x: true}}
      onRow={(record, rowIndex) => {
        return {
          onClick: (event) => {onClickRow(record)}
        };
      }}
    />
  </>
}

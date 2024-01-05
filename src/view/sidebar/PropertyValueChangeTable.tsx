import {Table, Typography} from "antd";
import React from "react";
import {MethodCallInfo} from "../../data/MethodCallInfo";
import {PropertyInfo} from "../../data/RegisterInstance";

type PropertyValueChangeTableProps = {
  selectedPropertyInfo: PropertyInfo;
  methodCallInfoList: MethodCallInfo[];
  onClickRow: (methodCallInfo: MethodCallInfo) => void;
}

export function PropertyValueChangeTable({selectedPropertyInfo, methodCallInfoList, onClickRow}: PropertyValueChangeTableProps) {
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

  const dataSource = methodCallInfoList.flatMap((methodCallInfo) => {
    return methodCallInfo
      .valueChanges
      .filter((valueChange) => valueChange.propertyName == selectedPropertyInfo.name)
      .flatMap((valueChange) => {
        return {
          time: methodCallInfo.calledAt,
          value: valueChange.value,
        }
      });
  });

  return <>
    <Typography.Title level={5}>Value Change Log</Typography.Title>
    <Table
      dataSource={dataSource}
      columns={columns}
      scroll={{x: true}}
      size={"small"}
      onRow={(record, _) => {
        return {
          onClick: (event) => {
            const correspondingMethodCallInfo = methodCallInfoList
              .find((methodCallInfo) => methodCallInfo.calledAt == record.time);
            if (!correspondingMethodCallInfo) return;
            onClickRow(correspondingMethodCallInfo)
          }
        };
      }}
    />
  </>
}

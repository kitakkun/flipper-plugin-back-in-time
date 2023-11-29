import React from "react";
import {Tabs, TabsProps} from "antd";
import {RegisteredInstancePage} from "../page/registered_instance/RegisteredInstancePage";
import RawLogPage from "../page/raw_logs/RawLogPage";
import {History} from "@mui/icons-material";

type TabMenuProps = {
  activeKey: string;
  onChange: (key: string) => void;
};

export function TabbedContent({activeKey, onChange}: TabMenuProps) {
  const items: TabsProps["items"] = [
    {
      key: '1',
      label: 'Registered instances',
      children: <RegisteredInstancePage/>
    },
    {
      key: '2',
      label: 'Raw event log',
      children: <RawLogPage/>
    },
  ];
  return (
    <Tabs
      activeKey={activeKey}
      defaultActiveKey={'1'}
      items={items}
      onChange={onChange}
      type={'card'}
    />
  );
}
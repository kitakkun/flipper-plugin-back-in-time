import RawLogPage from "../page/raw_logs/RawLogPage";
import React from "react";
import {RegisteredInstancePage} from "../page/registered_instance/RegisteredInstancePage";

type TabContentProps = {
  activeTabIndex: number;
};

export default ({activeTabIndex}: TabContentProps) => {
  switch (activeTabIndex) {
    case 0:
      return <RegisteredInstancePage />
    case 1:
      return <RawLogPage/>
    default:
      return null;
  }
}

import React from "react";
import {useSelector} from "react-redux";
import {selectRawEvents} from "../../../reducer/flipperReducer";
import {RawLogView} from "./RawLogView";

export default function RawLogPage() {
  const rawEventLog = useSelector(selectRawEvents);

  return <RawLogView rawEventLog={rawEventLog}/>;
}

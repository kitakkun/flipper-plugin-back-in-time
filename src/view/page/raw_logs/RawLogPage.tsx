import React from "react";
import {useSelector} from "react-redux";
import {RawLogView} from "./RawLogView";
import {rawEventLogStateSelector} from "./RawEventLogReducer";

export default function RawLogPage() {
  const state = useSelector(rawEventLogStateSelector);

  return <RawLogView state={state}/>;
}

import React from "react";
import {StepProps, Steps} from "antd";
import {BackInTimeState} from "./BackInTimeSelector";

export interface BackInTimeViewProps {
  state: BackInTimeState;
}

export function BackInTimeView({state}: BackInTimeViewProps) {
  const items: StepProps[] = state.histories.map((history, index) => ({
    title: history.title,
    subTitle: history.subtitle,
    description: history.description,
  }));

  return (
    <Steps
      progressDot
      current={state.histories.length - 1}
      direction={"vertical"}
      size={"small"}
      items={items}
    />
  );
}

import {useDispatch} from "react-redux";
import React from "react";
import PropertyInspectorView from "./PropertyInspectorView";
import {PropertyInspectorState} from "../sidebarReducer";
import {ValueEmitModalPage} from "../../page/value_emit/ValueEmitModalPage";
import {valueEmitActions} from "../../page/value_emit/ValueEmitReducer";

interface PropertyInspectorPageProps {
  state: PropertyInspectorState;
}

export function PropertyInspectorPage({state}: PropertyInspectorPageProps) {
  const dispatch = useDispatch();

  return <>
    <ValueEmitModalPage/>
    <PropertyInspectorView
      selectedInstance={state.selectedInstance}
      selectedPropertyInfo={state.selectedPropertyInfo}
      methodCallInfoList={state.selectedPropertyRelevantCalls}
      onClickValueChangeInfo={(methodCallInfo) => {
        dispatch(valueEmitActions.open({instanceInfo: state.selectedInstance, methodCallInfo: methodCallInfo}));
      }}
    />
  </>;
}
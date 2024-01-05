import {useDispatch, useSelector} from "react-redux";
import React from "react";
import PropertyInspectorView from "./PropertyInspectorView";
import {ValueEmitModalPage} from "../../page/value_emit/ValueEmitModalPage";
import {valueEmitActions} from "../../page/value_emit/ValueEmitReducer";
import {propertyInspectorStateSelector} from "./PropertyInspectorStateSelector";

export function PropertyInspectorPage() {
  const state = useSelector(propertyInspectorStateSelector);
  const dispatch = useDispatch();

  return <>
    <ValueEmitModalPage/>
    <PropertyInspectorView
      state={state}
      onClickValueChangeInfo={(methodCallInfo) => {
        if (!state.instanceInfo) return;
        dispatch(valueEmitActions.open({instanceInfo: state.instanceInfo, methodCallInfo: methodCallInfo}));
      }}
    />
  </>;
}
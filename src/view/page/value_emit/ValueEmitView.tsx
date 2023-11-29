import {Box, IconButton, Typography} from "@mui/material";
import {Layout, theme, Toolbar} from "flipper-plugin";
import {Close} from "@mui/icons-material";
import MethodCallInfo from "./MethodCallInfo";
import TargetValueChangeTable from "./TargetValueChangeTable";
import React from "react";
import {NotifyMethodCall, NotifyValueChange} from "../../../events/FlipperIncomingEvents";
import {DebuggableStateHolderInfo} from "../../../data/RegisterInstance";

type ValueEmitViewProps = {
  onClickClose: () => void;
  instance: DebuggableStateHolderInfo;
  methodCall: NotifyMethodCall;
  valueChanges: NotifyValueChange[];
  onValueEmit: (instanceUUID: string, propertyName: string, value: string, valueType: string) => void;
};

export function ValueEmitView({onClickClose, onValueEmit, methodCall, instance, valueChanges}: ValueEmitViewProps) {
  return <Box
    bgcolor={theme.backgroundDefault}
    borderRadius={theme.borderRadius}
    sx={{width: "100%"}}
  >
    <Toolbar>
      <IconButton onClick={onClickClose}>
        <Close/>
      </IconButton>
      <Typography sx={{fontSize: theme.fontSize.large}}>Value Emitter</Typography>
    </Toolbar>
    <Box padding={2}>
      <MethodCallInfo
        methodCallUUID={methodCall.methodCallUUID}
        instanceUUID={methodCall.instanceUUID}
        calledAt={methodCall.calledAt}
        methodName={methodCall.methodName}
      />
      <TargetValueChangeTable
        instance={instance}
        valueChanges={valueChanges}
        onClickEmitValue={onValueEmit}
      />
    </Box>
  </Box>;
}
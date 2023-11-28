import React from "react";
import {useSelector} from "react-redux";
import {Box, IconButton, Modal, Typography} from "@mui/material";
import {selectMethodCalls, selectRegisteredInstances, selectValueChanges} from "../../../reducer/flipperReducer";
import {Close} from "@mui/icons-material";
import MethodCallInfo from "./MethodCallInfo";
import TargetValueChangeTable from "./TargetValueChangeTable";
import {theme} from "flipper-plugin";

type ValueEmitModalProps = {
  onValueEmit: (instanceUUID: string, propertyName: string, value: string, valueType: string) => void;
  open: boolean;
  onClose: () => void;
  targetMethodCallId: string;
  instanceUUID: string;
};

export default ({open, onClose, onValueEmit, targetMethodCallId, instanceUUID}: ValueEmitModalProps) => {
  const instances = useSelector(selectRegisteredInstances);
  const methodCalls = useSelector(selectMethodCalls);
  const valueChanges = useSelector(selectValueChanges);

  const targetInstance = instances.find((instance) => instance.instanceUUID === instanceUUID);

  const targetMethodCall = methodCalls.find((methodCall) =>
    methodCall.methodCallUUID === targetMethodCallId && methodCall.instanceUUID === instanceUUID
  );

  const targetValueChange = valueChanges.filter((valueChange) =>
    valueChange.methodCallUUID === targetMethodCallId && valueChange.instanceUUID === instanceUUID
  );

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{padding: 4}}
      >
        <Box
          bgcolor={theme.backgroundDefault}
          borderRadius={4}
          padding={2}
          sx={{width: "100%"}}
        >
          <Typography sx={{fontSize: theme.fontSize.large}}>Value Emitter</Typography>
          <IconButton onClick={onClose}>
            <Close/>
          </IconButton>
          {targetMethodCall ?
            <MethodCallInfo
              methodCallUUID={targetMethodCallId}
              instanceUUID={instanceUUID}
              calledAt={targetMethodCall.calledAt}
              methodName={targetMethodCall.methodName}
            /> : null}
          {targetValueChange && targetInstance ?
            <TargetValueChangeTable
              instance={targetInstance}
              valueChanges={targetValueChange}
              onClickEmitValue={onValueEmit}
            /> : null
          }
        </Box>
      </Modal>
    </>
  )
};
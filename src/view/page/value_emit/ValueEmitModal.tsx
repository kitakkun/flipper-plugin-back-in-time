import React from "react";
import {Modal} from "@mui/material";
import {ValueEmitPage} from "./ValueEmitPage";

type ValueEmitModalProps = {
  open: boolean;
  onClose: () => void;
  targetMethodCallId: string;
  instanceUUID: string;
};

export default ({open, onClose, targetMethodCallId, instanceUUID}: ValueEmitModalProps) => {
  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{padding: 4}}
      >
        <ValueEmitPage
          targetMethodCallId={targetMethodCallId}
          instanceUUID={instanceUUID}
          onClose={onClose}
        />
      </Modal>
    </>
  )
};
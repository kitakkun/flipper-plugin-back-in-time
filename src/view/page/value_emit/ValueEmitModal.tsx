import React from "react";
import {ValueEmitPage} from "./ValueEmitPage";
import {Modal} from "antd";

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
        title={"Value Emitter"}
        open={open}
        footer={null}
        onCancel={onClose}
        width={"80%"}
      >
        <ValueEmitPage
          targetMethodCallId={targetMethodCallId}
          instanceUUID={instanceUUID}
        />
      </Modal>
    </>
  )
};
import {Modal} from "antd";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {backInTimeActions} from "./BackInTimeReducer";
import {BackInTimeView} from "./BackInTimeView";
import {backInTimeStateSelector} from "./BackInTimeSelector";

export function BackInTimeModalPage() {
  const state = useSelector(backInTimeStateSelector);
  const dispatch = useDispatch();

  return (
    <Modal
      open={state.open}
      centered={true}
      title={"History Viewer"}
      width={"80%"}
      onCancel={() => dispatch(backInTimeActions.close())}
    >
      <BackInTimeView state={state}/>
    </Modal>
  );
}
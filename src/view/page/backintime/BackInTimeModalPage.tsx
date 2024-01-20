import {Modal} from "antd";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {backInTimeActions} from "./BackInTimeReducer";
import {BackInTimeView} from "./BackInTimeView";
import {backInTimeStateSelector} from "./BackInTimeSelector";
import {MethodCallHistoryInfo} from "./HistoryInfo";
import {appActions} from "../../../reducer/appReducer";

export function BackInTimeModalPage() {
  const state = useSelector(backInTimeStateSelector);
  const dispatch = useDispatch();

  return (
    <>
      <Modal
        open={state.open}
        centered={true}
        title={"History Viewer"}
        width={"80%"}
        onCancel={() => dispatch(backInTimeActions.close())}
      >
        <BackInTimeView
          state={state}
          onSelectHistory={(index) => {
            Modal.confirm({
              content: "Are you sure to go back in time here?",
              onOk: () => {
                const methodCallHistories = state.histories.slice(0, index + 1)
                  .filter((history) => history.title == "methodCall")
                  .map((history) => history as MethodCallHistoryInfo);
                const allValueChanges = methodCallHistories.flatMap((history) => history.valueChanges);
                const propertyAndValues = distinctBy(allValueChanges, (change) => change.propertyName);
                propertyAndValues.forEach((change) => {
                  dispatch(appActions.forceSetPropertyValue(
                    {
                      instanceUUID: state.instanceUUID,
                      propertyName: change.propertyName,
                      value: change.value,
                      valueType: "", // 使われてないから大丈夫
                    }
                  ));
                });
              },
            })
          }}
        />
      </Modal>
    </>
  );
}

function distinctBy<T, K>(array: T[], keySelector: (item: T) => K): T[] {
  const seen = new Set<K>();
  return array.filter(item => {
    const key = keySelector(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
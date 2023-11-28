import {usePlugin} from "flipper-plugin";
import {plugin} from "./index";
import React from "react";
import {Provider} from "react-redux";
import BackInTimeComponent from "./BackInTimeComponent";

export default () => {
  const pluginInstance = usePlugin(plugin);
  const store = pluginInstance.store;

  return (
    <Provider store={store}>
      <BackInTimeComponent />
    </Provider>
  )
}
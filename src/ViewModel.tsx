import {DebuggableStateHolderInfo} from "./data/RegisterInstance";
import {Atom, createState} from "flipper-plugin";
import {NotifyMethodCall, NotifyValueChange, RegisterInstance} from "./events/FlipperIncomingEvents";
import {RawEventLog} from "./data/RawEventLog";

type State = {
  registeredInstances: Atom<DebuggableStateHolderInfo[]>
  valueChangeLog: Atom<Record<string, NotifyValueChange[]>>
  rawEventLog: Atom<RawEventLog[]>
};

type Actions = {
  register: (event: RegisterInstance) => void;
  notifyValueChange: (event: NotifyValueChange) => void;
  notifyMethodCall: (event: NotifyMethodCall) => void;
  updateInstanceAliveStatus: (instanceUUID: string, alive: boolean) => void;
};

type ViewModel = {
  state: State;
  actions: Actions;
}

export default function useViewModel(): ViewModel {
  const registeredInstances = createState<DebuggableStateHolderInfo[]>([], {persist: 'registrationInfo'});
  const valueChangeLog = createState<Record<string, NotifyValueChange[]>>({}, {persist: 'valueChangeLog'});
  const rawEventLog = createState<RawEventLog[]>([], {persist: 'rawEventLog'});

  const register = (event: RegisterInstance) => {
    rawEventLog.update((draft) => {
      draft.push({label: "register", payload: event});
    });
    registeredInstances.update((draft) => {
      draft.push({
        instanceUUID: event.instanceUUID,
        instanceType: event.instanceType,
        properties: event.properties,
        registeredAt: event.registeredAt,
        alive: true,
      });
    });
    valueChangeLog.update((draft) => {
      draft[event.instanceUUID] = [];
    });
  };

  const notifyValueChange = (event: NotifyValueChange) => {
    rawEventLog.update((draft) => {
      draft.push({label: "notifyValueChange", payload: event});
    });
    valueChangeLog.update((draft) => {
      if (!draft[event.instanceUUID]) draft[event.instanceUUID] = [];
      draft[event.instanceUUID].push(event);
    });
  };

  const notifyMethodCall = (event: NotifyMethodCall) => {
    rawEventLog.update((draft) => {
      draft.push({label: "notifyMethodCall", payload: event});
    });
  };

  const updateInstanceAliveStatus = (instanceUUID: string, alive: boolean) => {
    registeredInstances.update((draft) => {
      const instance = draft.find((info) => info.instanceUUID == instanceUUID);
      if (!instance) return;
      instance.alive = alive;
    });
  };

  return {
    state: {
      registeredInstances,
      valueChangeLog,
      rawEventLog,
    },
    actions: {
      register,
      notifyValueChange,
      notifyMethodCall,
      updateInstanceAliveStatus,
    }
  }
}
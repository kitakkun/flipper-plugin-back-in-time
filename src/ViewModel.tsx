import {DebuggableStateHolderInfo} from "./data/RegisterInstance";
import {Atom, createState} from "flipper-plugin";
import {NotifyMethodCall, NotifyValueChange, RegisterInstance} from "./events/FlipperIncomingEvents";
import {RawEventLog} from "./data/RawEventLog";

export type State = {
  registeredInstances: Atom<DebuggableStateHolderInfo[]>
  valueChangeLog: Atom<Record<string, NotifyValueChange[]>>
  rawEventLog: Atom<RawEventLog[]>
  // ui state
  activeTabIndex: Atom<number>,
  selectedInstance: Atom<DebuggableStateHolderInfo | null>
  selectedPropertyName: Atom<string | null>
  selectedPropertyValueChangeLog: Atom<NotifyValueChange[]>
};

export type Actions = {
  register: (event: RegisterInstance) => void;
  notifyValueChange: (event: NotifyValueChange) => void;
  notifyMethodCall: (event: NotifyMethodCall) => void;
  updateInstanceAliveStatus: (instanceUUID: string, alive: boolean) => void;

  selectProperty: (instanceUUID: string, propertyName: string) => void;
  updateActiveTabIndex: (index: number) => void;
};

type ViewModel = {
  state: State;
  actions: Actions;
}

export default function useViewModel(): ViewModel {
  const registeredInstances = createState<DebuggableStateHolderInfo[]>([], {persist: 'registrationInfo'});
  const valueChangeLog = createState<Record<string, NotifyValueChange[]>>({}, {persist: 'valueChangeLog'});
  const rawEventLog = createState<RawEventLog[]>([], {persist: 'rawEventLog'});

  const activeTabIndex = createState<number>(0);
  const selectedProperty = createState<string | null>(null);
  const selectedInstance = createState<DebuggableStateHolderInfo | null>(null);
  const selectedPropertyValueChangeLog = createState<NotifyValueChange[]>([]);

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

  const updateActiveTabIndex = (index: number) => {
    activeTabIndex.set(index);
  }

  const selectProperty = (instanceUUID: string, propertyName: string) => {
    selectedProperty.set(propertyName);
    const instance = registeredInstances.get().find((info) => info.instanceUUID == instanceUUID);
    selectedInstance.set(instance ? instance : null);
    selectedPropertyValueChangeLog.set(valueChangeLog.get()[instanceUUID].filter((event) => event.propertyName == propertyName));
  }

  return {
    state: {
      registeredInstances,
      valueChangeLog,
      rawEventLog,
      selectedPropertyName: selectedProperty,
      selectedInstance,
      selectedPropertyValueChangeLog,
      activeTabIndex,
    },
    actions: {
      register,
      notifyValueChange,
      notifyMethodCall,
      updateInstanceAliveStatus,
      selectProperty,
      updateActiveTabIndex,
    },
  }
}
export type IncomingEvents = {
  error: string;
  register: RegisterInstance;
  notifyValueChange: NotifyValueChange;
  notifyMethodCall: NotifyMethodCall;
};

/**
 * information about debug target instance
 * this object is sent after registration of the instance completed.
 * @param instanceId IdentityHashCode of the instance
 * @param propertyNames list of names of debuggable property
 * @param registeredAt
 */
export type RegisterInstance = {
  instanceUUID: string;
  instanceType: string;
  superType: string;
  properties: PropertyInfo[];
  registeredAt: number;
}

interface PropertyInfo {
  name: string;
  debuggable: boolean;
  propertyType: string;
  valueType: string;
}


export type NotifyMethodCall = {
  instanceUUID: string;
  methodName: string;
  methodCallUUID: string;
  calledAt: number;
}

export type NotifyValueChange = {
  instanceUUID: string;
  propertyName: string;
  value: string;
  methodCallUUID: string;
}
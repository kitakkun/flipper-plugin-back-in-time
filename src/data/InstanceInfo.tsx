/**
 * information about debug target instance
 * this object is sent after registration of the instance completed.
 * @param instanceId IdentityHashCode of the instance
 * @param propertyNames list of names of debuggable property
 * @param registeredAt
 */
export type InstanceInfo = {
  uuid: string;
  type: string;
  properties: PropertyInfo[];
  registeredAt: number;
}

export type PropertyInfo = {
  name: string;
  debuggable: boolean;
  type: string;
}

export type InstanceInfoWithAliveState = InstanceInfo & {
  alive: boolean;
}
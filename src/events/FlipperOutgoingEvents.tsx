/**
 * Outgoing events from desktop app
 */
export type OutgoingEvents = {
  forceSetPropertyValue(event: ForceSetPropertyValue): Promise<any>;
  refreshInstanceAliveStatus(event: CheckInstanceAlive): Promise<CheckInstanceAliveResponse>;
}

export type ForceSetPropertyValue = {
  instanceUUID: string;
  propertyName: string;
  value: string;
  valueType: string;
}

export type CheckInstanceAlive = {
  instanceUUIDs: string[];
}

export type CheckInstanceAliveResponse = {
  isAlive: Map<string, boolean>;
}
export type DebuggableStateHolderInfo = {
  instanceUUID: string;
  instanceType: string;
  properties: PropertyInfo[];
  registeredAt: number;
  alive: boolean;
}

export type PropertyInfo = {
  name: string;
  debuggable: boolean;
  type: string;
}


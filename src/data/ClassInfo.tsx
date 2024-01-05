export interface ClassInfo {
  name: string;
  properties: PropertyInfo[];
}

export interface PropertyInfo {
  name: string;
  type: string;
  valueType: string;
  debuggable: boolean;
}
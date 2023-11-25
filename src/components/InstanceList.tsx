import {List, ListSubheader, Switch} from "@mui/material";
import React from "react";
import InstanceItem from "./InstanceItem";
import {Refresh} from "@mui/icons-material";

type Property = {
  name: string;
  debuggable: boolean;
  type: string;
}

export type DebuggableStateHolderInstance = {
  uuid: string;
  type: string;
  properties: Property[];
  registeredAt: number;
}

type InstanceListProps = {
  instances: DebuggableStateHolderInstance[];
  onSelectedProperty: (instanceUUID: string, propertyName: string) => void;
  onClickRefresh: () => void;
}

const instancesForTest = [
  {
    uuid: "hogehgoe", type: "HogeViewModel", properties: [
      {name: "hoge", debuggable: true, type: "kotlin.String"},
      {name: "hoge2", debuggable: true, type: "kotlin.String"},
      {name: "hoge3", debuggable: false, type: "kotlin.Int"},
      {name: "hoge4", debuggable: false, type: "kotlin.Float"},
    ], registeredAt: 0
  },
  {uuid: "hogehgoe2", type: "HogeViewModel", properties: [], registeredAt: 0},
  {uuid: "hogehgoe3", type: "HogeViewModel", properties: [], registeredAt: 0},
  {uuid: "hogehgoe4", type: "HogeViewModel", properties: [], registeredAt: 0},
  {uuid: "hogehgoe5", type: "HogeViewModel", properties: [], registeredAt: 0},
]

export default function InstanceList({instances, onSelectedProperty, onClickRefresh}: InstanceListProps) {
  return (
    <List
      sx={{width: '100%', bgcolor: 'background.paper'}}
      component="div"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader
          id="nested-list-subheader"
          component="div"
          sx={{width: "100%", display: "flex", justifyContent: "space-between", alignItems: "middle"}}
        >
          Registered Instances
          <Refresh onClick={onClickRefresh}/>
        </ListSubheader>
      }
    >
      {instances.map((instance) => (
        <InstanceItem
          instance={instance}
          onSelectedProperty={onSelectedProperty}
        />
      ))}
    </List>
  );
}

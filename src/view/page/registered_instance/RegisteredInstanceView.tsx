import {List, ListSubheader} from "@mui/material";
import React from "react";
import InstanceItem from "./InstanceItem";
import {Refresh} from "@mui/icons-material";

import {NotifyValueChange} from "../../../events/FlipperIncomingEvents";
import {DebuggableStateHolderInfo} from "../../../data/RegisterInstance";

type InstanceListProps = {
  instances: DebuggableStateHolderInfo[];
  onSelectProperty: (instanceUUID: string, propertyName: string) => void;
  onClickRefresh: () => void;
  valueChangedEvents: NotifyValueChange[];
}

export default function RegisteredInstanceView({instances, onSelectProperty, onClickRefresh, valueChangedEvents}: InstanceListProps) {
  const eventsByInstance = (instanceUUID: string) => {
    const events = valueChangedEvents.filter((event) => event.instanceUUID == instanceUUID);
    if (!events) return [];
    return events;
  }

  return (
    <List
      sx={{width: '100%', bgcolor: 'background.paper'}}
      component="div"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader
          id="nested-list-subheader"
          component="div"
          sx={{width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center"}}
        >
          Registered Instances
          <Refresh onClick={onClickRefresh}/>
        </ListSubheader>
      }
    >
      {instances.map((instance) => (
        <InstanceItem
          instance={instance}
          onSelectProperty={onSelectProperty}
          valueChangedEvents={eventsByInstance(instance.instanceUUID)}
        />
      ))}
    </List>
  );
}

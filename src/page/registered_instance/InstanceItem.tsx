import {Collapse, List, ListItemButton, ListItemText} from "@mui/material";
import React from "react";
import {theme} from "flipper-plugin";
import {ExpandLess, ExpandMore} from "@mui/icons-material";

import {NotifyValueChange} from "../../events/FlipperIncomingEvents";
import {DebuggableStateHolderInfo} from "../../data/RegisterInstance";
import PropertyItem from "./PropertyItem";

type InstanceItemProps = {
  instance: DebuggableStateHolderInfo;
  onSelectProperty: (instanceUUID: string, propertyName: string) => void;
  valueChangedEvents: NotifyValueChange[];
}

export default function InstanceItem({instance, onSelectProperty, valueChangedEvents}: InstanceItemProps) {
  const [showProperties, setShowProperties] = React.useState(true);

  const toggleShowProperties = () => {
    setShowProperties(!showProperties);
  }
  const getNumOfEvents = (propertyName: string) => valueChangedEvents.filter((event) => event.propertyName == propertyName).length;

  const handleOnSelectProperty = (propertyName: string) => {
    onSelectProperty(instance.instanceUUID, propertyName);
  }

  return (
    <>
      <ListItemButton
        onClick={() => {
          toggleShowProperties();
        }}
        disabled={instance.properties.length == 0}
      >
        <ListItemText
          primary={instance.instanceType}
          primaryTypographyProps={{style: {fontSize: theme.fontSize.default}}}
          secondary={instance.instanceUUID}
          secondaryTypographyProps={{style: {fontSize: theme.fontSize.small}}}
        />
        {instance.properties.length > 0 ? showProperties ? <ExpandLess/> : <ExpandMore/> : null}
      </ListItemButton>
      <Collapse in={showProperties} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {instance.properties.map((property) => (
            <PropertyItem
              property={property}
              numOfEvents={getNumOfEvents(property.name)}
              onSelectProperty={handleOnSelectProperty}
            />
          ))}
        </List>
      </Collapse>
    </>
  )
    ;
}
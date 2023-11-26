import {Badge, Collapse, List, ListItem, ListItemButton, ListItemText} from "@mui/material";
import React from "react";
import {theme} from "flipper-plugin";
import {ExpandLess, ExpandMore} from "@mui/icons-material";

import {NotifyValueChange} from "../events/FlipperIncomingEvents";
import {DebuggableStateHolderInfo} from "../data/RegisterInstance";

type InstanceItemProps = {
  instance: DebuggableStateHolderInfo;
  onSelectedProperty: (instanceUUID: string, propertyName: string) => void;
  valueChangedEvents: NotifyValueChange[];
}

export default function InstanceItem({instance, onSelectedProperty, valueChangedEvents}: InstanceItemProps) {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  }

  const filterEvents = (propertyName: string) => valueChangedEvents.filter((event) => event.instanceUUID == instance.instanceUUID && event.propertyName == propertyName);
  const eventLength = (propertyName: string) => filterEvents(propertyName).length;

  return (
    <>
      <ListItemButton
        onClick={() => {
          handleClick();
        }}
        disabled={instance.properties.length == 0}
      >
        <ListItemText
          primary={instance.instanceType}
          primaryTypographyProps={{style: {fontSize: theme.fontSize.default}}}
          secondary={instance.instanceUUID}
          secondaryTypographyProps={{style: {fontSize: theme.fontSize.small}}}
        />
        {instance.properties.length > 0 ? open ? <ExpandLess/> : <ExpandMore/> : null}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {instance.properties.map((property) => (
            <ListItem key={property.name}>
              <ListItemButton disabled={!property.debuggable} style={{display: "flex"}} onClick={() =>
                onSelectedProperty(instance.instanceUUID, property.name)
              }>
                {property.debuggable ?
                  <ListItemText
                    primary={property.name}
                    primaryTypographyProps={{style: {fontSize: theme.fontSize.small}}}
                    secondary={property.type}
                    secondaryTypographyProps={{style: {fontSize: theme.fontSize.smaller}}}
                  />
                  :
                  <ListItemText
                    primary={property.name}
                    primaryTypographyProps={{style: {fontSize: theme.fontSize.small}}}
                    secondary={property.type}
                    secondaryTypographyProps={{style: {fontSize: theme.fontSize.smaller}}}
                  />
                }
                {/*{!property.debuggable ?*/}
                {/*  <span style={{color: "red", fontSize: theme.fontSize.small}}>Not Debuggable</span> : null}*/}
                {
                  eventLength(property.name) > 0 ?
                    <Badge badgeContent={eventLength(property.name)} color="primary" sx={{marginLeft: "auto"}}/> : null
                }
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Collapse>
    </>
  )
    ;
}
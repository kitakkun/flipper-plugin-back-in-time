import {Accordion, AccordionDetails, AccordionSummary, List, ListItemText} from "@mui/material";
import React from "react";
import {theme} from "flipper-plugin";
import {ExpandMore} from "@mui/icons-material";

import {NotifyValueChange} from "../../../events/FlipperIncomingEvents";
import {DebuggableStateHolderInfo} from "../../../data/RegisterInstance";
import PropertyItem from "./PropertyItem";

type InstanceItemProps = {
  instance: DebuggableStateHolderInfo;
  onSelectProperty: (instanceUUID: string, propertyName: string) => void;
  valueChangedEvents: NotifyValueChange[];
}

export default function InstanceItem({instance, onSelectProperty, valueChangedEvents}: InstanceItemProps) {
  const [showProperties, setShowProperties] = React.useState(true);

  const getNumOfEvents = (propertyName: string) => valueChangedEvents.filter((event) => event.propertyName == propertyName).length;

  const handleOnSelectProperty = (propertyName: string) => {
    onSelectProperty(instance.instanceUUID, propertyName);
  }

  return (
    <Accordion
      disableGutters={true}
      expanded={showProperties}
      disabled={instance.properties.length == 0}
      sx={{border: "none"}}
      onChange={(_, expanded) => setShowProperties(expanded)}
    >
      <AccordionSummary expandIcon={<ExpandMore/>}>
        <ListItemText
          primary={instance.instanceType}
          primaryTypographyProps={{style: {fontSize: theme.fontSize.default}}}
          secondary={instance.instanceUUID}
          secondaryTypographyProps={{style: {fontSize: theme.fontSize.small}}}
        />
      </AccordionSummary>
      <AccordionDetails>
        <List component="div" disablePadding>
          {instance.properties.map((property) => (
            <PropertyItem
              property={property}
              numOfEvents={getNumOfEvents(property.name)}
              onSelectProperty={handleOnSelectProperty}
            />
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
}
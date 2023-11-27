import {Badge, ListItem, ListItemButton, ListItemText} from "@mui/material";
import {theme} from "flipper-plugin";
import React from "react";
import {PropertyInfo} from "../../data/RegisterInstance";

type PropertyItemProps = {
  property: PropertyInfo;
  numOfEvents: number;
  onSelectProperty: (propertyName: string) => void;
}

export default function PropertyItem({property, onSelectProperty, numOfEvents}: PropertyItemProps) {
  return (
    <ListItem key={property.name}>
      <ListItemButton disabled={!property.debuggable} style={{display: "flex"}} onClick={() =>
        onSelectProperty(property.name)
      }>
        <ListItemText
          primary={property.name}
          primaryTypographyProps={{style: {fontSize: theme.fontSize.small}}}
          secondary={property.propertyType}
          secondaryTypographyProps={{style: {fontSize: theme.fontSize.smaller}}}
        />
        {!property.debuggable ?
          <span style={{color: "red", fontSize: theme.fontSize.small}}>Not Debuggable</span> : null
        }
        {
          numOfEvents > 0 ?
            <Badge badgeContent={numOfEvents} color="primary" sx={{marginLeft: "auto"}}/> : null
        }
      </ListItemButton>
    </ListItem>
  );
}
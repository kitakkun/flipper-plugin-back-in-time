import {Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import React from "react";
import {InstanceInfoWithAliveState, PropertyInfo} from "../data/InstanceInfo";
import {SelectedProperty, ValueChangedEvent} from "../index";

type PropertyInspectorProps = {
  selectedInstance: InstanceInfoWithAliveState;
  selectedProperty: SelectedProperty;
  selectedPropertyValueChangeLog: ValueChangedEvent[];
}

export default function PropertyInspector(
  {
    selectedInstance,
    selectedProperty,
    selectedPropertyValueChangeLog
  }: PropertyInspectorProps
) {
  const property = selectedInstance.properties.find((property) => property.name == selectedProperty.propertyName)
  return (
    <Box padding={2}>
      <Typography variant="subtitle1">
        Parent Instance Info
      </Typography>
      <TableContainer>
        <Table size={"small"}>
          <TableBody>
            <TableRow key={"uuid"}>
              <TableCell component={"th"} scope={"row"} style={{width: "10ch"}}>id</TableCell>
              <TableCell>{selectedInstance.uuid}</TableCell>
            </TableRow>
            <TableRow key={"type"}>
              <TableCell component={"th"} scope={"row"} style={{width: "10ch"}}>type</TableCell>
              <TableCell>{selectedInstance.type}</TableCell>
            </TableRow>
            <TableRow key={"registeredAt"}>
              <TableCell component={"th"} scope={"row"} style={{width: "10ch"}}>registeredAt</TableCell>
              <TableCell>{selectedInstance.registeredAt}</TableCell>
            </TableRow>
            <TableRow key={"alive"}>
              <TableCell component={"th"} scope={"row"} style={{width: "10ch"}}>alive</TableCell>
              <TableCell>{selectedInstance.alive ? "true" : "false"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="subtitle1">
        Property Info
      </Typography>
      {property ?
        <TableContainer>
          <Table size={"small"}>
            <TableBody>
              <TableRow key={"name"}>
                <TableCell component={"th"} scope={"row"} style={{width: "10ch"}}>name</TableCell>
                <TableCell>{property.name}</TableCell>
              </TableRow>
              <TableRow key={"type"}>
                <TableCell component={"th"} scope={"row"} style={{width: "10ch"}}>type</TableCell>
                <TableCell>{property.type}</TableCell>
              </TableRow>
              <TableRow key={"debuggable"}>
                <TableCell component={"th"} scope={"row"} style={{width: "10ch"}}>debuggable</TableCell>
                <TableCell>{property.debuggable}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        : null}
      <Typography variant="subtitle1">
        Property Value Change Log
      </Typography>
      <TableContainer>
        <Table size={"small"}>
          <TableHead>
            <TableRow>
              <TableCell style={{width: "10ch"}}>Time</TableCell>
              <TableCell style={{width: "100%"}}>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedPropertyValueChangeLog.map((event) => (
              <TableRow>
                <TableCell>{"TO BE FIXED SOON"}</TableCell>
                <TableCell>{event.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
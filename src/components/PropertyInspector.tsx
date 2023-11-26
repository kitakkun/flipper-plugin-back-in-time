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
        <Table>
          <TableBody>
            <TableRow key={"uuid"}>
              <TableCell component={"th"} scope={"row"}>id</TableCell>
              <TableCell>{selectedInstance.uuid}</TableCell>
            </TableRow>
            <TableRow key={"type"}>
              <TableCell component={"th"} scope={"row"}>type</TableCell>
              <TableCell>{selectedInstance.type}</TableCell>
            </TableRow>
            <TableRow key={"registeredAt"}>
              <TableCell component={"th"} scope={"row"}>registeredAt</TableCell>
              <TableCell>{selectedInstance.registeredAt}</TableCell>
            </TableRow>
            <TableRow key={"alive"}>
              <TableCell component={"th"} scope={"row"}>alive</TableCell>
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
          <Table>
            <TableBody>
              <TableRow key={"name"}>
                <TableCell component={"th"} scope={"row"}>name</TableCell>
                <TableCell>{property.name}</TableCell>
              </TableRow>
              <TableRow key={"type"}>
                <TableCell component={"th"} scope={"row"}>type</TableCell>
                <TableCell>{property.type}</TableCell>
              </TableRow>
              <TableRow key={"debuggable"}>
                <TableCell component={"th"} scope={"row"}>debuggable</TableCell>
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
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Value</TableCell>
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
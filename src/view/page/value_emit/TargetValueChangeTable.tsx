import {Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import React from "react";
import {NotifyValueChange} from "../../../events/FlipperIncomingEvents";
import {DebuggableStateHolderInfo, PropertyInfo} from "../../../data/RegisterInstance";
import {theme} from "flipper-plugin";

type TargetValueChangeTableProps = {
  instance: DebuggableStateHolderInfo;
  valueChanges: NotifyValueChange[];
  onClickEmitValue: (instanceUUID: string, propertyName: string, value: string, valueType: string) => void;
};

export default ({instance, valueChanges, onClickEmitValue}: TargetValueChangeTableProps) => {
  const propertyInfo = (propertyName: string) => {
    return instance.properties.find((property) => property.name === propertyName);
  };

  const onClick = (propertyInfo: PropertyInfo, valueChangeEvent: NotifyValueChange) => {
    onClickEmitValue(instance.instanceUUID, propertyInfo.name, valueChangeEvent.value, propertyInfo.valueType);
  }
  return (
    <>
      <Typography sx={{fontSize: theme.fontSize.default}}>Updated Properties</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>action</TableCell>
              <TableCell>name</TableCell>
              <TableCell>type</TableCell>
              <TableCell>value type</TableCell>
              <TableCell>value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              valueChanges.map((valueChange) => {
                const property = propertyInfo(valueChange.propertyName);
                if (!property) return null;
                return (
                  <TableRow>
                    <TableCell>
                      <Button variant={"contained"} onClick={() => {
                        onClick(property, valueChange)
                      }}>
                        Emit Value
                      </Button>
                    </TableCell>
                    <TableCell>{valueChange.propertyName}</TableCell>
                    <TableCell>{property.propertyType}</TableCell>
                    <TableCell>{property.valueType}</TableCell>
                    <TableCell>{valueChange.value}</TableCell>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
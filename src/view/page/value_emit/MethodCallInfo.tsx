import {Table, TableBody, TableCell, TableContainer, TableRow, Typography} from "@mui/material";
import React from "react";
import {theme} from "flipper-plugin";

type MethodCallInfoProps = {
  instanceUUID: string;
  methodName: string;
  methodCallUUID: string;
  calledAt: number;
}

export default function ({instanceUUID, methodName, methodCallUUID, calledAt}: MethodCallInfoProps) {
  return (
    <>
      <Typography sx={{fontSize: theme.fontSize.default}}>Method Call Info</Typography>
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>instanceUUID</TableCell>
              <TableCell>{instanceUUID}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>methodName</TableCell>
              <TableCell>{methodName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>methodCallUUID</TableCell>
              <TableCell>{methodCallUUID}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>calledAt</TableCell>
              <TableCell>{calledAt}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
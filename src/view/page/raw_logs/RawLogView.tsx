import {Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import React from "react";
import {RawEventLog} from "../../../data/RawEventLog";

type RawLogPageProps = {
  rawEventLog: RawEventLog[];
}

export function RawLogView({rawEventLog}: RawLogPageProps) {
  return (
    <Box padding={2}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableCell>label</TableCell>
            <TableCell>payload</TableCell>
          </TableHead>
          <TableBody>
            {rawEventLog.map((log, index) =>
              <TableRow key={index}>
                <TableCell>{log.label}</TableCell>
                <TableCell>{JSON.stringify(log.payload)}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <ul>
      </ul>
    </Box>
  );
}
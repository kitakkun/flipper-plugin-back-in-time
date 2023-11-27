import {Box} from "@mui/material";
import React from "react";

type RawLogPageProps = {
  rawEventLog: string[];
}

export default function RawLogPage({rawEventLog}: RawLogPageProps) {
  return (
    <Box padding={2}>
      <ul>
        {rawEventLog.map((log, index) => <li key={index}>{log}</li>)}
      </ul>
    </Box>
  );
}

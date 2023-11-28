import {Box, Tab, Tabs} from "@mui/material";
import React from "react";

type TabMenuProps = {
  activeTabIndex: number;
  onTabChange: (index: number) => void;
};

export default ({activeTabIndex, onTabChange}: TabMenuProps) => {
  return (
    <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
      <Tabs value={activeTabIndex} onChange={(_, index) => onTabChange(index)}
            aria-label="basic tabs example">
        <Tab label="Registered instances"/>
        <Tab label="Raw event log"/>
      </Tabs>
    </Box>
  );
}
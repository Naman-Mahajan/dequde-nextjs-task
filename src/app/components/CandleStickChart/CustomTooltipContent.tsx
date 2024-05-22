import React from 'react';
import useStyles from './CandlestickChart.styles';
import { CustomTooltip } from "../../types/interfaces/IOhclChart";
import { Box, Paper } from '@mui/material';


const CustomTooltipContent: React.FC<{ content: CustomTooltip, color: string }> = ({ content, color }) => {
  const classes = useStyles();

  return (
    <Box>
      <Box className={classes.customTooltipContainer}>
        <Paper elevation={3} style={{ color }}>Open: {content.open}</Paper>
        <Paper elevation={3} style={{ color }}>High: {content.high}</Paper>
        <Paper elevation={3} style={{ color }}>Low: {content.low}</Paper>
        <Paper elevation={3} style={{ color }}>Close: {content.close}</Paper>
        <Paper elevation={3} style={{ color }}>{content.valueSign}{content.difference}</Paper>
        <Paper elevation={3} style={{ color }}>({content.profitOrLossText})</Paper>
      </Box>
    </Box>
  );
};

export default CustomTooltipContent;


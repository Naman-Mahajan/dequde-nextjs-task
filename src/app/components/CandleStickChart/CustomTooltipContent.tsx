import React from 'react';
import { CustomTooltipContainer } from './CandlestickChart.styles';
import { CustomTooltip } from "../../types/interfaces/IOhclChart";


const CustomTooltipContent: React.FC<{content: CustomTooltip, color: string}> = ({ content, color }) => {

  return (
    <CustomTooltipContainer>
      <div style={{ color }}>Open: {content.open}</div>
      <div style={{ color }}>High: {content.high}</div>
      <div style={{ color }}>Low: {content.low}</div>
      <div style={{ color }}>Close: {content.close}</div>
      <div style={{ color }}>{content.valueSign}{content.difference}</div>
      <div style={{ color }}>({content.profitOrLossText})</div>
    </CustomTooltipContainer>
  );
};

export default CustomTooltipContent;

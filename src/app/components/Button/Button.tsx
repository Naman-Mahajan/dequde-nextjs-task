import React from "react";
import styled from 'styled-components';

const TransparentButton = styled.button`
background-color: rgba(0, 0, 0, 0.3);
border: none;
color: black;
font-size: 14px;
padding: 8px 16px;
cursor: pointer;
transition: background-color 0.3s, color 0.3s;

&:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

&.default {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
}

`;

interface TimeframeButtonProps {
  timeframe: string;
  setTimeframe: (timeframe: string) => void;
  label: string;
}

const TimeframeButton :React.FC<TimeframeButtonProps>= ({ timeframe, setTimeframe, label }) => {
  const handleClick = () => {
    setTimeframe(timeframe);
  };

  return (
    <TransparentButton
      onClick={handleClick}
      className={timeframe === '1W' ? 'default' : ''}
    >
      {label}
    </TransparentButton>
  );
};

export default TimeframeButton;
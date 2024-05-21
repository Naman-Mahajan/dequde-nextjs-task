import React from "react";
import styled from 'styled-components';
interface TransparentButtonProps {
  selected: boolean;
}

const TransparentButton = styled.button<TransparentButtonProps>`
background-color: ${({ selected }) => selected ? 'blue' : 'transparent'};
  border: none;
  color: ${({ selected }) => selected ? 'white' : 'black'};
  font-size: 14px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
`;

interface TimeframeButtonProps {
  timeframe: string;
  setTimeframe: (timeframe: string) => void;
  label: string;
  selected: boolean;
}

const TimeframeButton :React.FC<TimeframeButtonProps>= ({ timeframe, setTimeframe, label, selected }) => {
  const handleClick = () => {
    setTimeframe(timeframe);
  };

  return (
    <TransparentButton
      onClick={handleClick}
      selected={selected}
    >
      {label}
    </TransparentButton>
  );
};

export default TimeframeButton;
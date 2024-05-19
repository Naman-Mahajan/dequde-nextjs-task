import React from "react";
import { Button } from "@mui/material";
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
    <Button
      variant="contained"
      size="small"
      color="primary"
      onClick={handleClick}
    >
      {label}
    </Button>
  );
};

export default TimeframeButton;
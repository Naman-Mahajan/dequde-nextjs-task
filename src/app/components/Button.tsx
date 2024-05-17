import React from "react";
import { Button } from "@mui/material";

const TimeframeButton = ({ timeframe, setTimeframe, label }) => {
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
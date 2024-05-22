import React from "react";
import { makeStyles } from "@mui/styles";
import { Button } from "@mui/material";

interface TimeframeButtonProps {
  timeframe: string;
  setTimeframe: (timeframe: string) => void;
  label: string;
  selected: boolean;
}

const useStyles = makeStyles({
  transparentButton: (props: { selected: boolean }) => ({
    backgroundColor: props.selected ? "blue" : "transparent",
    color: props.selected ? "white" : "black",
    fontSize: 14,
    padding: "8px 16px",
    "&:hover": {
      backgroundColor: props.selected ? "blue" : "lightblue",
    },
  }),
});

const TimeframeButton: React.FC<TimeframeButtonProps> = ({
  timeframe,
  setTimeframe,
  label,
  selected,
}) => {
  const classes = useStyles({ selected });
  const handleClick = () => {
    setTimeframe(timeframe);
  };

  return (
    <Button className={classes.transparentButton} onClick={handleClick}>
      {label}
    </Button>
  );
};

export default TimeframeButton;

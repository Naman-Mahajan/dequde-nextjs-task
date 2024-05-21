import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  chartContainer: {
    width: "100%",
    height: "600px",
  },
  customTooltipContainer: {
    display: "flex",
    position: "relative",
    zIndex: 1,
    gap: "2em",
    top: "-37em",
    left: "2em",
  },
  spacer: {
    width: "4px",
    display: "inline-block",
  },
});

export default useStyles;

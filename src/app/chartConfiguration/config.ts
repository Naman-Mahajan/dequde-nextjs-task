import { CrosshairMode } from "lightweight-charts";
import { TimeFrameOption } from "../types/interfaces/ITimeFrame"


const timeFrame : TimeFrameOption[] = [
  { value: "1W", label: "3y" },
  { value: "1D", label: "1y" },
  { value: "12h", label: "3m" },
  { value: "6h", label: "1m" },
  { value: "1h", label: "7d" },
  { value: "30m", label: "3d" },
  { value: "15m", label: "1d" },
  { value: "5m", label: "6h" },
  { value: "1m", label: "1h" },
];

const chartConfig = {overlayPriceScales: {
    ticksVisible: true,
    minimumWidth: 20,
  },

  layout: {
    background: {
      color: "#253248",
    },
    textColor: "rgba(255, 255, 255, 0.9)",
  },
  grid: {
    vertLines: {
      color: "#334158",
    },
    horzLines: {
      color: "#334158",
    },
  },

  crosshair: {
    mode: CrosshairMode.Normal,
  },
  rightPriceScale: {
    borderColor: "#485c7b",
  },
  timeScale: {
    borderColor: "#485c7b",
  }}

  export { chartConfig, timeFrame };


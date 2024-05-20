import { CrosshairMode } from "lightweight-charts";
import { TimeFrameOption } from "../types/interfaces/IOhclChart"
import { TimeframeEnum } from "./enum"

const timeFrame : TimeFrameOption[] = [
  { value: TimeframeEnum.ONE_WEEK, label: "3y"  },
  { value: TimeframeEnum.ONE_DAY, label: "1y" },
  { value: TimeframeEnum.TWELVE_HOUR, label: "3m" },
  { value: TimeframeEnum.SIX_HOUR, label: "1m" },
  { value: TimeframeEnum.ONE_HOUR, label: "7d" },
  { value: TimeframeEnum.THIRTY_MIN, label: "3d" },
  { value: TimeframeEnum.FIFTEEN_MIN, label: "1d" },
  { value: TimeframeEnum.FIVE_MIN, label: "6h" },
  { value: TimeframeEnum.ONE_MIN, label: "1h" },
];

const SUBSCRIBE_KEY = "subscribe";

const CHANNEL_KEY = "candles";

const chartConfig = {overlayPriceScales: {
    ticksVisible: true,
    minimumWidth: 20,
  },
  interval:"1D",
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

  export { chartConfig, timeFrame , SUBSCRIBE_KEY, CHANNEL_KEY};


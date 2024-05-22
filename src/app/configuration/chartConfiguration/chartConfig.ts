import { CrosshairMode } from "lightweight-charts";
import { TimeFrameOption } from "../../types/interfaces/IOhclChart";
import { Timeframe } from "./enum";

const timeFrameOptions: TimeFrameOption[] = [
  { value: Timeframe.ONE_WEEK, label: "3y" },
  { value: Timeframe.ONE_DAY, label: "1y" },
  { value: Timeframe.TWELVE_HOUR, label: "3m" },
  { value: Timeframe.SIX_HOUR, label: "1m" },
  { value: Timeframe.ONE_HOUR, label: "7d" },
  { value: Timeframe.THIRTY_MIN, label: "3d" },
  { value: Timeframe.FIFTEEN_MIN, label: "1d" },
  { value: Timeframe.FIVE_MIN, label: "6h" },
  { value: Timeframe.ONE_MIN, label: "1h" },
];

const SUBSCRIBE_KEY = "subscribe";
const CHANNEL_KEY = "candles";
const chartConfig = {
  overlayPriceScales: {
    ticksVisible: true,
    minimumWidth: 20,
  },
  interval: "1D",
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
  },
};

export { chartConfig, timeFrameOptions, SUBSCRIBE_KEY, CHANNEL_KEY };

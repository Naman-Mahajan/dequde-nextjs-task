import { Timeframe } from "@/app/configuration/chartConfiguration/enum";
import { Candlestick, CustomTooltip } from "@/app/types/interfaces/IOhclChart";
import { CandlestickData } from "lightweight-charts";
import ReactDOMServer from "react-dom/server";
import CustomTooltipContent from "./CustomTooltipContent";

export const getLogicalRange = (
   timeframe: string,
   candleData: Candlestick[]
) => {
   let logicalRange = { from: 0, to: candleData.length - 1 };
   let startIndex: number = Number();

   if (timeframe === Timeframe.ONE_MIN) {
      startIndex = Math.max(0, candleData.length - 60);
   } else if (timeframe === Timeframe.FIVE_MIN) {
      startIndex = Math.max(0, candleData.length - (6 * 60) / 5);
   } else if (timeframe === Timeframe.FIFTEEN_MIN) {
      startIndex = Math.max(0, candleData.length - (24 * 60) / 15);
   } else if (timeframe === Timeframe.THIRTY_MIN) {
      startIndex = Math.max(0, candleData.length - (3 * 24 * 60) / 30);
   } else if (timeframe === Timeframe.ONE_HOUR) {
      startIndex = Math.max(0, candleData.length - 7 * 24);
   } else if (timeframe === Timeframe.SIX_HOUR) {
      const numberOfDataPoints = (30 * 24) / 6;
      startIndex = Math.max(0, candleData.length - numberOfDataPoints);
   } else if (timeframe === Timeframe.TWELVE_HOUR) {
      const numberOfDataPoints = (3 * 30 * 24) / 12;
      startIndex = Math.max(0, candleData.length - numberOfDataPoints);
   } else if (timeframe === Timeframe.ONE_DAY) {
      const numberOfDataPoints = 365;
      startIndex = Math.max(0, candleData.length - numberOfDataPoints);
   } else if (timeframe === Timeframe.ONE_WEEK) {
      const numberOfDataPoints = 3 * 52;
      startIndex = Math.max(0, candleData.length - numberOfDataPoints);
      if (startIndex !== 0) {
         logicalRange = { from: startIndex - 1, to: candleData.length - 1 };
      }
   }

   if (timeframe !== Timeframe.ONE_WEEK) {
      logicalRange = { from: startIndex, to: candleData.length - 1 };
   }
   return logicalRange;
};

export const handleTooltipContent = (
   price: CandlestickData,
   tooltipColor: string
) => {
   const profitOrLoss = ((price.close - price.open) / price.open) * 100;
   const valueDifference = price.close - price.open;
   const valueSign = valueDifference >= 0 ? "+" : "-";
   const profitOrLossText =
      profitOrLoss >= 0
         ? `+${profitOrLoss.toFixed(2)}%`
         : `${profitOrLoss.toFixed(2)}%`;
   const content: CustomTooltip = {
      open: price.open.toFixed(2),
      high: price.high.toFixed(2),
      low: price.low.toFixed(2),
      close: price.close.toFixed(2),
      difference: Math.abs(valueDifference).toFixed(),
      percentage: profitOrLoss.toFixed(2),
      valueSign: valueSign,
      profitOrLossText: profitOrLossText,
   };

   return ReactDOMServer.renderToString(
      <CustomTooltipContent content={content} color={tooltipColor} />
   );
};

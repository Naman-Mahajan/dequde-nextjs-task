import { Timeframe } from "@/app/configuration/chartConfiguration/enum";
import { CandlestickData } from "lightweight-charts";
import { Candlestick } from "@/app/types/interfaces/IOhclChart";

const getTimeframeRange = (timeframe: string, candleDataLength: number) => {
    const timeframeMap: { [key: string]: number } = {
        [Timeframe.ONE_MIN]: 60,
        [Timeframe.FIVE_MIN]: (6 * 60) / 5,
        [Timeframe.FIFTEEN_MIN]: (24 * 60) / 15,
        [Timeframe.THIRTY_MIN]: (3 * 24 * 60) / 30,
        [Timeframe.ONE_HOUR]: 7 * 24,
        [Timeframe.SIX_HOUR]: (30 * 24) / 6,
        [Timeframe.TWELVE_HOUR]: (3 * 30 * 24) / 12,
        [Timeframe.ONE_DAY]: 365,
        [Timeframe.ONE_WEEK]: 3 * 52,
    };
    const numberOfDataPoints = timeframeMap[timeframe] || 0;
    const startIndex = Math.max(0, candleDataLength - numberOfDataPoints);
    return timeframe === Timeframe.ONE_WEEK
        ? { from: startIndex - 1, to: candleDataLength - 1 }
        : { from: startIndex , to: candleDataLength - 1 };
};

export const getLogicalRange = (timeframe: string, candleData: Candlestick[]) => {
    const { length } = candleData;
    const { from, to } = getTimeframeRange(timeframe, length);
    return { from, to };
};

export const handleTooltipContent = (price: CandlestickData) => {
    const { open, high, low, close } = price;
    const valueDifference = close - open;
    const profitOrLoss = ((close - open) / open) * 100;
    const valueSign = valueDifference >= 0 ? "+" : "-";
    const profitOrLossText = profitOrLoss >= 0 ? `+${profitOrLoss.toFixed(2)}%` : `${profitOrLoss.toFixed(2)}%`;
    const content = {
        open: open.toFixed(),
        high: high.toFixed(),
        low: low.toFixed(),
        close: close.toFixed(),
        difference: Math.abs(valueDifference).toFixed(),
        percentage: profitOrLoss.toFixed(2),
        valueSign,
        profitOrLossText,
    };
    return content;
};

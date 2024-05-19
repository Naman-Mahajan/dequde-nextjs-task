"use client";

import React, {
  useState,
  useEffect,
  useRef,

} from "react";
import { CandlestickData, IChartApi, createChart } from "lightweight-charts";
import TimeframeButton from "../Button/Button";
import { chartConfig } from "../../chartConfiguration/ChartConfig";
import { CandleOptions } from "../../types/interfaces/IOhclChart";
import { TimeFrameOption } from "../../types/interfaces/ITimeFrame";
import { connectWebSocket, closeWebSocket } from "../../utils/chartWebsocket";
import { timeFrame } from "@/app/chartConfiguration/ChartConfig";
import { TimeframeEnum } from "@/app/chartConfiguration/enum";
import { ChartContainer, CustomTooltip, Spacer } from "./CandlestickChart.styles";
import ReactDOMServer from 'react-dom/server';

const CandlestickChart = () => {
  let [candleData, setCandleData] = useState<CandleOptions[]>([]);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [isChartLoaded, setIsChartLoaded] = useState<boolean>(false);
  const [timeframe, setTimeframe] = useState<string>(TimeframeEnum.ONE_WEEK);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    const wss = connectWebSocket(timeframe, setCandleData);
    return () => {
      closeWebSocket(wss);
    };
  }, [timeframe]);
  useEffect(() => {
    if (chartContainerRef.current && candleData.length > 0) {
      setIsChartLoaded(true);
      if (chartInstance.current) {
        chartInstance.current.remove();
      }

      chartInstance.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        ...chartConfig,
      });
      const timeScaleOptions = {
        timeVisible: true,
        secondsVisible: true,
      };
      chartInstance?.current?.applyOptions({
        timeScale: timeScaleOptions,
      });
      const candlestickSeries = chartInstance?.current?.addCandlestickSeries();
      
      const mappedData = candleData.map((candle: any) => ({
        time: candle[0] / 1000,
        open: candle[1],
        close: candle[2],
        high: candle[3],
        low: candle[4],
      }));

      mappedData.sort((a, b) => a.time - b.time);

      candlestickSeries?.setData(mappedData);
      const tooltipElement = document.createElement("div");
      tooltipElement.classList.add("custom-tooltip");
      chartContainerRef.current.appendChild(tooltipElement);
      const handleTooltipContent = (
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
    
            return ReactDOMServer.renderToString(
              <CustomTooltip>
                <div style={{ color: tooltipColor }}>Open: {price.open}</div>
                <div style={{ color: tooltipColor }}>High: {price.high}</div>
                <div style={{ color: tooltipColor }}>Low: {price.low}</div>
                <div style={{ color: tooltipColor }}>Close: {price.close}</div>
                <div style={{ color: tooltipColor }}>{valueSign}{Math.abs(valueDifference)}</div>
                <div style={{ color: tooltipColor }}>({profitOrLossText})</div>
              </CustomTooltip>
            );
      };

      chartInstance.current.subscribeCrosshairMove((param:  {
        time?: number;
        point?: { x: number; y: number };
        seriesData?: Map<CandlestickData, CandlestickData>;
      }) => {
        if (!param.time || !param.point) return;

        const price = param?.seriesData?.get(candlestickSeries);
        if (!price) return;
        const tooltipColor: string =
          price.close > price.open ? "#4bffb5" : "#ff4976";

        const chartRect = chartContainerRef?.current?.getBoundingClientRect();
        const chartLeft = chartRect?.left ?? 0 + window.scrollX;
        const chartTop = chartRect?.top ?? 0 + window.scrollY;

        const tooltipX = param.point.x - chartLeft + 10;
        const tooltipY =
          param.point.y - chartTop - tooltipElement.offsetHeight - 10;
        tooltipElement.style.left = `${tooltipX}px`;
        tooltipElement.style.top = `${tooltipY}px`;
        tooltipElement.innerHTML = handleTooltipContent(price, tooltipColor);
        tooltipElement.style.display = "block";
      });
      return () => {
        if (tooltipElement && tooltipElement.parentNode) {
          tooltipElement.parentNode.removeChild(tooltipElement);
        }
      };
    }
  }, [candleData, isChartLoaded]);

  return (
    <div>
      <ChartContainer ref={chartContainerRef} />
      {isChartLoaded && (
        timeFrame.map((option: TimeFrameOption, index) => (
          <React.Fragment key={option.value}>
          <TimeframeButton
            
            timeframe={option.value}
            setTimeframe={setTimeframe}
            label={option.label}
          />
          {index < timeFrame.length - 1 && <Spacer />}
          </React.Fragment>
        ))
      )}
      
    </div>
  );
};

export default CandlestickChart;

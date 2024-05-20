"use client";

import React, {
  useState,
  useEffect,
  useRef,

} from "react";
import { CandlestickData, IChartApi, Time, createChart } from "lightweight-charts";
import TimeframeButton from "../Button/Button";
import { chartConfig } from "../../chartConfiguration/chartConfig";
import { SubscribeData, TimeFrameOption, CustomTooltip } from "../../types/interfaces/IOhclChart";
import { connectWebSocket, closeWebSocket } from "../../utils/chartWebsocket";
import { timeFrame, SUBSCRIBE_KEY, CHANNEL_KEY } from "@/app/chartConfiguration/chartConfig";
import { TimeframeEnum } from "@/app/chartConfiguration/enum";
import { ChartContainer, Spacer } from "./CandlestickChart.styles";
import ReactDOMServer from 'react-dom/server';
import CustomTooltipContent from './CustomTooltipContent'

const CandlestickChart: React.FC = () => {

  let [candleData, setCandleData] = useState<CandlestickData<Time>[]>([]);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [isChartLoaded, setIsChartLoaded] = useState<boolean>(false);
  const [timeframe, setTimeframe] = useState<string>(TimeframeEnum.ONE_WEEK);
  let [chartApi, setChartApi] = useState<IChartApi>() ;
  
  const defaultWebSocketURL = 'wss://api-pub.bitfinex.com/ws/2';
 
  const subscribeData: SubscribeData = {
    event: SUBSCRIBE_KEY,
    channel: CHANNEL_KEY,
    key: `trade:${timeframe}:tBTCUSD`,
  };

  useEffect(() => {
    const wss = connectWebSocket(process.env.WEBSOCKET_API_URL || defaultWebSocketURL, subscribeData, setCandleData);
    return () => {
      closeWebSocket(wss);
    };
  }, [timeframe]);

  useEffect(() => {
    if (chartContainerRef.current && candleData.length > 0) {
      setIsChartLoaded(true);
      if (chartApi) {
        chartApi.remove();
      }

      chartApi = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        ...chartConfig,
      });
      const timeScaleOptions = {
        timeVisible: true,
      };
      chartApi?.applyOptions({
        timeScale: timeScaleOptions,
      });

      setChartApi(chartApi);

      const candlestickSeries = chartApi?.addCandlestickSeries();
      candlestickSeries?.setData(candleData);

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
            const content: CustomTooltip = {
              open: price.open,
              high: price.high,
              low: price.low,
              close: price.close,
              difference: Math.abs(valueDifference),
              percentage: profitOrLoss,
              valueSign: valueSign,
              profitOrLossText: profitOrLossText
            };

           return ReactDOMServer.renderToString(
                <CustomTooltipContent content={content} color={tooltipColor} />
            );
      };

      
      chartApi.subscribeCrosshairMove((param) => {
        if (!param.time || !param.point) return;
        
        const price= param?.seriesData?.get(candlestickSeries) as CandlestickData<Time>;
        if (!price) return;

        const tooltipColor: string = price.close > price.open ? "#4bffb5" : "#ff4976";

        const chartRect = chartContainerRef?.current?.getBoundingClientRect();
        const chartLeft = chartRect?.left ?? 0 + window.scrollX;
        const chartTop = chartRect?.top ?? 0 + window.scrollY;

        const tooltipX = param.point.x - chartLeft + 10;
        const tooltipY = param.point.y - chartTop - tooltipElement.offsetHeight - 10;

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

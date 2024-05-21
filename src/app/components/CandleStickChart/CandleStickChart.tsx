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
  import { timeFrameOptions, SUBSCRIBE_KEY, CHANNEL_KEY } from "@/app/chartConfiguration/chartConfig";
  import { Timeframe } from "@/app/chartConfiguration/enum";
  import { ChartContainer, Spacer } from "./CandlestickChart.styles";
  import { getLogicalRange } from "./CandleStickChartCalculation";
  import { handleTooltipContent } from "./CandleStickChartCalculation";
  const CandlestickChart: React.FC = () => {

    const [candleData, setCandleData] = useState<CandlestickData<Time>[]>([]);
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const [isChartLoaded, setIsChartLoaded] = useState<boolean>(false);
    const [timeframe, setTimeframe] = useState<string>(Timeframe.ONE_WEEK);
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
          barSpacing: 15
        };
        chartApi?.applyOptions({
          timeScale: timeScaleOptions,
        });
        chartApi.timeScale().applyOptions({
          timeVisible: true,
        
        })

        setChartApi(chartApi);

        const candlestickSeries = chartApi?.addCandlestickSeries();
      
        candlestickSeries?.setData(candleData);

        let logicalRange = getLogicalRange(timeframe, candleData)
    
        chartApi.timeScale().setVisibleLogicalRange(logicalRange);

        const tooltipElement = document.createElement("div");
        tooltipElement.classList.add("custom-tooltip");
        chartContainerRef.current.appendChild(tooltipElement);
      
        
        chartApi.subscribeCrosshairMove((param) => {
          if (!param.time || !param.point) return;
          
          const price = param?.seriesData?.get(candlestickSeries) as CandlestickData<Time>;
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
    }, [candleData, isChartLoaded, timeframe]);
   
    
    return (
      <div>
        <ChartContainer ref={chartContainerRef} />
        {isChartLoaded && (
          timeFrameOptions.map((option: TimeFrameOption, index) => (
            <React.Fragment key={option.value}>
            <TimeframeButton
              
              timeframe={option.value}
              setTimeframe={setTimeframe}
              label={option.label}
              selected={timeframe===option.value}
            />
            {index < timeFrameOptions.length - 1 && <Spacer />}
            </React.Fragment>
          ))
        )}
      </div>
    );
  };

  export default CandlestickChart;
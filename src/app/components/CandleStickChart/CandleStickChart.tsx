"use client";

import React, { useState, useEffect, useRef } from "react";
import { CandleOptions } from "@/app/types/interfaces/IOhclChart";
import { TimeFrameOption } from "@/app/types/interfaces/ITimeFrame";
import { TimeframeEnum } from "@/app/chartConfiguration/enum";
import { chartConfig, timeFrame } from "@/app/chartConfiguration/ChartConfig";
import TimeframeButton from "@/app/components/Button/Button";
import { CandlestickWebSocket } from "./CandleStickWebSocket";
import { CandlestickData, IChartApi, createChart } from "lightweight-charts";

const CandlestickChart = () => {
  const [candleData, setCandleData] = useState<CandleOptions[]>([]);
  const [timeframe, setTimeframe] = useState<string>(TimeframeEnum.ONE_WEEK);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<IChartApi | any>(null);

  useEffect(() => {
    setTimeout(()=>{
      setCandleData([]);
    },0)
  }, [timeframe]);

  useEffect(() => {
    if (chartContainerRef.current && candleData.length > 0) {
        if (chartInstance.current && chartInstance.current.removeSeries) {
          chartInstance.current.remove();
        }
       
        setCandleData(candleData)
      
          chartInstance.current = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            ...chartConfig
          });
          const timeScaleOptions = {
            timeVisible: true,
            secondsVisible: true,
          };
          chartInstance.current.applyOptions({
            timeScale: timeScaleOptions,
          });
        
        const candlestickSeries = chartInstance.current.addCandlestickSeries();
        
        const mappedData = candleData.map((candle: any) => ({
          time:  candle[0] / 1000,
          open:  candle[1],
          close: candle[2],
          high:  candle[3],
          low:   candle[4],
        }));
        console.log(mappedData.length)
        candlestickSeries.setData([])
        setCandleData([])
        mappedData.sort((a, b) => a.time - b.time);
          if(candlestickSeries){
            candlestickSeries?.setData(mappedData);
  
            const tooltipElement = document.createElement("div");
            tooltipElement.classList.add("custom-tooltip");
            chartContainerRef.current.appendChild(tooltipElement);
            const handleTooltipContent = (
              price: CandlestickData,
              tooltipColor : string
            ) => {
              const profitOrLoss = ((price.close - price.open) / price.open) * 100;
              const valueDifference = price.close - price.open;
              const valueSign = valueDifference >= 0 ? "+" : "-";
              const profitOrLossText =
                profitOrLoss >= 0
                  ? `+${profitOrLoss.toFixed(2)}%`
                  : `${profitOrLoss.toFixed(2)}%`;
              return `
                <div style="display: flex; position: relative; z-index: 1; gap: 2em; top: -37em; left:2em">
                  <div style="color: ${tooltipColor};">Open: ${price.open}</div>
                  <div style="color: ${tooltipColor};">High: ${price.high}</div>
                  <div style="color: ${tooltipColor};">Low: ${price.low}</div>
                  <div style="color: ${tooltipColor};">Close: ${price.close}</div>
                  <div style="color: ${tooltipColor};"> ${valueSign}${Math.abs(valueDifference)}</div>
                  <div style="color: ${tooltipColor};">(${profitOrLossText})</div>
                </div>`;
            };
      
            chartInstance.current.subscribeCrosshairMove((param: any) => {
              if (!param.time || !param.point) return;
      
              const price = param.seriesData.get(candlestickSeries);
              if (!price) return;
              const tooltipColor : string = price.close > price.open ? "#4bffb5" : "#ff4976";
      
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
             
              // if (chartInstance.current) chartInstance?.current?.remove();
              if (tooltipElement && tooltipElement.parentNode) {
                tooltipElement.parentNode.removeChild(tooltipElement);
              }
            };
          }
       
      }
  }, [candleData]);

  return (
    <div>
      <div ref={chartContainerRef} style={{ width: "100%", height: "600px" }} />
      {timeFrame.map((option: TimeFrameOption)=>(
        <TimeframeButton   
          key={option.value}    
          timeframe={option.value} 
          setTimeframe={setTimeframe} 
          label={option.label}/>
      ))}
      <CandlestickWebSocket
        candleData={candleData}
        setCandleData={setCandleData}
        timeframe={timeframe}
      />
    </div>
  );
};

export default CandlestickChart;

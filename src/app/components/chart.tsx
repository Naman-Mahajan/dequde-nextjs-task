"use client";

import React, { useState, useEffect } from "react";
import { CandlestickData, createChart } from "lightweight-charts";
import TimeframeButton from "../components/Button/Button";
import { chartConfig, timeFrame } from "../chartConfiguration/ChartConfig"
import { TimeFrameOption } from "../types/interfaces/ITimeFrame"
import { CandleOptions } from "../types/interfaces/IOhclChart";


const CandlestickChart = () => {

  const [candleData, setCandleData] = useState<CandleOptions[]>([]);
  const [timeframe, setTimeframe] = useState("1W");
  const chartContainerRef = React.useRef<HTMLDivElement>(null);
  const chartInstance = React.useRef<any>(null);
  const wss = React.useRef<WebSocket | null>(null);
  
  useEffect(() => {
    return setCandleData([]);
  }, [timeframe]);

  useEffect(() => {
    wss.current = new WebSocket("wss://api-pub.bitfinex.com/ws/2");
    wss.current.onopen = () => {
      setCandleData([]);
      const msg = JSON.stringify({
        event: "subscribe",
        channel: "candles",
        key: `trade:${timeframe}:tBTCUSD`,
      });
      wss.current?.send(msg);
    };

    wss.current.onmessage = (event) => {
      const candleStickData = JSON.parse(event.data);
      if (Array.isArray(candleStickData) && Array.isArray(candleStickData[1])) {
        if (candleStickData[1][0] instanceof Array) {
          setCandleData(candleStickData[1].sort((a: number[], b: number[]) => a[0] - b[0]));
        } else {
          setCandleData((prevData) => {
            const newData :any= [...prevData];
            const newCandle : any= candleStickData[1];
            const existingCandleIndex : number= newData.findIndex(
              (candle: any) => candle[0] === newCandle[0]
            );
            // newData.push(newCandle);
            if (existingCandleIndex !== -1) {
              newData[existingCandleIndex] = newCandle
            } else {
              newData.push(newCandle);
            }
            return newData.sort((a: any, b: any) => a.time - b.time);
          });
        }
      }
    };

    return () => {
      wss.current?.close();
    };
  }, [timeframe]);

  useEffect(() => {
    if (chartContainerRef.current && candleData.length > 0) {
      // if (!chartInstance.current) {
        if (chartInstance.current && chartInstance.current.removeSeries) {
          chartInstance.current.remove();
        }
        
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
      // }
      const candlestickSeries = chartInstance.current.addCandlestickSeries();

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
            <div style="color: ${tooltipColor};">Value Difference: ${valueSign}${Math.abs(valueDifference)}</div>
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
    </div>
  );
};

export default CandlestickChart;


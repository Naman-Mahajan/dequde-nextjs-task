"use client"

import {CandleOptions} from "@/app/types/interfaces/IOhclChart"
import { CandlestickData, Time } from "lightweight-charts";
export const connectWebSocket = (timeframe: string, setCandleData: React.Dispatch<React.SetStateAction<CandlestickData<Time>[]>>) => {
    const wss = new WebSocket("wss://api-pub.bitfinex.com/ws/2");
    wss.onopen = () => {
      setCandleData([]);
      const msg = JSON.stringify({
        event: "subscribe",
        channel: "candles",
        key: `trade:${timeframe}:tBTCUSD`,
      });
      wss.send(msg);
    };
  
    wss.onmessage = (event: MessageEvent) => {
      const candleStickData = JSON.parse(event.data);
      if (Array.isArray(candleStickData) && Array.isArray(candleStickData[1])) {
        if (candleStickData[1][0] instanceof Array) {
          let sortedData = candleStickData[1].sort((a: number[], b: number[]) => a[0] - b[0])
          candleStickData[1] = sortedData.map((candle)=>{
            return {
              time: (candle[0]/1000) as Time ,
              open: candle[1],
              close: candle[2],
              high: candle[3],
              low: candle[4],
            }
          })
          setCandleData(candleStickData[1])
        } else {
          setCandleData((prevData) => {
            const newData:CandlestickData<Time>[] = [...prevData];
            const newCandle = candleStickData[1];
            const existingCandleIndex : number = newData.findIndex(
              (candle) => candle.time === (newCandle[0] /1000)
            );
            if (existingCandleIndex !== -1) {
              newData[existingCandleIndex] = {
                time: (newCandle[0] / 1000) as Time,
                open: newCandle[1],
                close: newCandle[2],
                high: newCandle[3],
                low: newCandle[4],
              }
            } else {
              newData.push({
              time: (newCandle[0] /1000) as Time,
              open: newCandle[1],
              close: newCandle[2],
              high: newCandle[3],
              low: newCandle[4],});
            }
            return newData.sort((a, b) => Number(a.time)  - Number(b.time));

            // return newData;
          });
        }
      }
    };
  
    return wss;
  };
  
  export const closeWebSocket = (wss: WebSocket) => {
    wss.close();
  };
  
"use client"

import {CandleOptions} from "@/app/types/interfaces/IOhclChart"
export const connectWebSocket = (timeframe: string, setCandleData: React.Dispatch<React.SetStateAction<CandleOptions[]>>) => {
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
          setCandleData(candleStickData[1].sort((a: number[], b: number[]) => a[0] - b[0]));
        } else {
          
          type CandleData = [number, CandleOptions];
          setCandleData((prevData) => {
            const newData = [...prevData];
            const newCandle = candleStickData[1];
            const existingCandleIndex : number= newData.findIndex(
              (candle: any) => candle[0] === newCandle[0]
            );
            if (existingCandleIndex !== -1) {
              newData[existingCandleIndex] = newCandle
            } else {
              newData.push(newCandle);
            }
            return newData.sort((a, b) => a.time - b.time);
          });
        }
      }
    };
  
    return wss;
  };
  
  export const closeWebSocket = (wss: WebSocket) => {
    wss.close();
  };
  
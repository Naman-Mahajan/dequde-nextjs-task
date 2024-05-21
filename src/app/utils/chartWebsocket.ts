"use client"

import { CandlestickData, Time } from "lightweight-charts";
import { SubscribeData } from "../types/interfaces/IOhclChart";

export const connectWebSocket = (
   url: string,
   subscribeData: SubscribeData,
   setCandleData: React.Dispatch<React.SetStateAction<CandlestickData<Time>[]>>) => {

  const wss = new WebSocket(url);

  
  wss.onopen = () => {
    setCandleData([]);
    const msg = JSON.stringify(subscribeData);
    wss.send(msg);
  };

  wss.onmessage = (event: MessageEvent) => {
    const candleStickData = JSON.parse(event.data);
    if (Array.isArray(candleStickData) && Array.isArray(candleStickData[1])) {
      const candleArray = candleStickData[1]
      if (Array.isArray(candleArray[0])) {
        let sortedCandleData = candleStickData[1].sort((a: number[], b: number[]) => a[0] - b[0])
        candleStickData[1] = sortedCandleData.map((candle) => {
          return {
            time: (candle[0] / 1000) as Time,
            open: candle[1],
            close: candle[2],
            high: candle[3],
            low: candle[4],
          }
        })
        setCandleData(candleStickData[1])
      } else {
        setCandleData((prevData) => {
          const newData: CandlestickData<Time>[] = [...prevData];
          const newCandle = candleStickData[1];
          const existingCandleIndex: number = newData.findIndex(
            (candle) => candle.time === (newCandle[0] / 1000)
          );
          let candleObj = {
            time: (newCandle[0] / 1000) as Time,
            open: newCandle[1],
            close: newCandle[2],
            high: newCandle[3],
            low: newCandle[4],
          }
          if (existingCandleIndex !== -1) {
            newData[existingCandleIndex] = candleObj
          } else {
            newData.push(candleObj);
          }
          return newData.sort((a, b) => Number(a.time) - Number(b.time));
        });
      }
    }
  };

  return wss;
};

export const closeWebSocket = (wss: WebSocket) => {
  wss.close();
};
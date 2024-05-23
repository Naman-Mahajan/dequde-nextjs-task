"use client";

import { CandlestickData, Time } from "lightweight-charts";
import { SubscribeData } from "../types/interfaces/IOhclChart";
import { CandleIndexs } from "../configuration/chartConfiguration/enum";

export const connectWebSocket = (
  url: string,
  subscribeData: SubscribeData,
  setCandleDataCallback:(newCandleData: any) => void
) => {
  const wss = new WebSocket(url);

  wss.onopen = () => {
    const msg = JSON.stringify(subscribeData);
    wss.send(msg);
  };

  wss.onmessage = (event: MessageEvent) => {
    const candleStickData = JSON.parse(event.data);
    if (Array.isArray(candleStickData) && Array.isArray(candleStickData[1])) {
      const candleArray = candleStickData[1];
      if (Array.isArray(candleArray[0])) {
        const sortedCandleData = candleStickData[1].sort(
          (a: number[], b: number[]) => a[0] - b[0]
        );
        const finalCandleData = sortedCandleData.map((candle) => {
          return {
            time: (candle[CandleIndexs.TIME_INDEX] / 1000) as Time,
            open: candle[CandleIndexs.OPEN_INDEX],
            close: candle[CandleIndexs.CLOSE_INDEX],
            high: candle[CandleIndexs.HIGH_INDEX],
            low: candle[CandleIndexs.LOW_INDEX],
          };
        });
        setCandleDataCallback(finalCandleData);
      } else  {
        const newCandle = candleStickData[1];
        const candleObj = {
          time: (newCandle[CandleIndexs.TIME_INDEX] / 1000) as Time,
          open: newCandle[CandleIndexs.OPEN_INDEX],
          close: newCandle[CandleIndexs.CLOSE_INDEX],
          high: newCandle[CandleIndexs.HIGH_INDEX],
          low: newCandle[CandleIndexs.LOW_INDEX],
        };
        setCandleDataCallback((prevData: CandlestickData<Time>[]) => {
          const newData: CandlestickData<Time>[] = [...prevData];
          const existingCandleIndex: number = newData.findIndex(
            (candle) => candle.time === candleObj.time
          );
          if (existingCandleIndex !== -1) {
            newData[existingCandleIndex] = candleObj;
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
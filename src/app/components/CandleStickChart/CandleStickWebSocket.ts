// CandlestickWebSocket.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { CandleOptions } from "@/app/types/interfaces/IOhclChart";
import { TimeframeEnum } from "@/app/chartConfiguration/enum";

interface CandlestickWebSocketProps {
  candleData: CandleOptions[];
  setCandleData: React.Dispatch<React.SetStateAction<CandleOptions[]>>;
  timeframe: string;
}

export const CandlestickWebSocket: React.FC<CandlestickWebSocketProps> = ({
  candleData,
  setCandleData,
  timeframe,
}) => {
  const wss = useRef<WebSocket | null>(null);

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
      const responseData = JSON.parse(event.data);
      if (Array.isArray(responseData) && Array.isArray(responseData[1])) {
        const candles = responseData[1];
        if (Array.isArray(candles[0])) {
          setCandleData([])
          setCandleData(candles.sort((a: number[], b: number[]) => a[0] - b[0]));
        } else {
          setCandleData([])
          setCandleData((prevData) => {
            const newData = [...prevData];
            const lastCandle = candles[candles.length - 1]; 
            let newCandle;
            if (Array.isArray(lastCandle)) {
              newCandle = [...lastCandle];
            } else {
              newCandle = { ...lastCandle }; // Create a shallow copy of the last candle object
            }
            const existingCandleIndex = newData.findIndex(
              (candle: any) => candle[0] === newCandle[0]
            );
            if (existingCandleIndex !== -1) {
              newData[existingCandleIndex] = {
                time: newCandle[0],
                open: newCandle[1],
                close: newCandle[2],
                high: newCandle[3],
                low: newCandle[4],
              };
            } else {
              newData.push({
                time: newCandle[0],
                open: newCandle[1],
                close: newCandle[2],
                high: newCandle[3],
                low: newCandle[4],
              });
            }
            return newData.sort((a, b) => a.time - b.time);
          });
        }
      }
    };

    return () => {
      wss.current?.close();
    };
  }, [timeframe]);

  return null; // WebSocket logic doesn't render anything
};

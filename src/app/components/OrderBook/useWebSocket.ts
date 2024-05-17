"use client"

import { useEffect, useState } from 'react';
import { OrderBookState } from '@/app/types/interfaces/IOhclChart';
import { Order } from '@/app/types/interfaces/IOhclChart';
const useWebSocket = (url: string) => {
  const [orderBook, setOrderBook] = useState<OrderBookState>({ bids: [], asks: [] });
  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      ws.send(JSON.stringify({
        event: 'subscribe',
        channel: 'book',
        symbol: 'tBTCUSD',
        prec: 'P0', 
        freq: 'F0',
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (Array.isArray(data) && data.length > 1) {
        const [, info] = data;
        if (info && info.length > 2 && info[1] !== 'hb') {
          const [price, count, amount] = info;
          const newOrder: Order = { price, count, amount , total: price * Math.abs(amount)};
          if (count > 0) {  
            if (amount > 0) {
              setOrderBook((prevOrderBook) => ({
                ...prevOrderBook,
                bids: [...prevOrderBook.bids.filter((order) => order.price !== price), newOrder]
              }));
            } else {
              setOrderBook((prevOrderBook) => ({
                ...prevOrderBook,
                asks: [...prevOrderBook.asks.filter((order) => order.price !== price), newOrder]
              }));
            }
          } else {
            if (amount === 1) {
              setOrderBook((prevOrderBook)=> ({
                ...prevOrderBook,
                bids: prevOrderBook.bids.filter((order) => order.price !== price)
              }));
            } else if (amount === -1) {
              setOrderBook((prevOrderBook)=> ({
                ...prevOrderBook,
                asks: prevOrderBook.asks.filter((order) => order.price !== price)
              }));
            }
          }
        }
      }
    };

    return () => {
      ws.close();
    };
  }, [url]);
  return orderBook;
};

export default useWebSocket;

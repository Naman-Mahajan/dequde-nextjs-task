"use client";

import { useEffect, useState } from "react";
import { OrderBookState } from "@/app/types/interfaces/IOhclChart";
import { Order } from "@/app/types/interfaces/IOhclChart";
import { SubscribeData } from "@/app/types/interfaces/IOrderBook";

const useWebSocket = (subscribeData: SubscribeData, url: string) => {
  const [orderBook, setOrderBook] = useState<OrderBookState>({
    bids: [],
    asks: [],
  });
  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      ws.send(JSON.stringify(subscribeData));
    };

    ws.onmessage = (event) => {
      const orderBookData = JSON.parse(event.data);
      if (Array.isArray(orderBookData) && orderBookData.length > 1) {
        const [, bookInfo] = orderBookData;

        if (bookInfo && bookInfo.length > 2 && bookInfo[1] !== "hb") {
          const [price, count, amount] = bookInfo;
          const newOrder: Order = {
            price,
            count,
            amount: Math.abs(amount),
            total: parseFloat((price * Math.abs(amount)).toFixed(2)),
          };
          if (count > 0) {
            if (amount > 0) {
              setOrderBook((prevOrderBook) => ({
                ...prevOrderBook,
                bids: [
                  ...prevOrderBook.bids.filter(
                    (order) => order.price !== price
                  ),
                  newOrder,
                ],
              }));
            } else {
              setOrderBook((prevOrderBook) => ({
                ...prevOrderBook,
                asks: [
                  ...prevOrderBook.asks.filter(
                    (order) => order.price !== price
                  ),
                  newOrder,
                ],
              }));
            }
          } else {
            if (amount === 1) {
              setOrderBook((prevOrderBook) => ({
                ...prevOrderBook,
                bids: prevOrderBook.bids.filter(
                  (order) => order.price !== price
                ),
              }));
            } else if (amount === -1) {
              setOrderBook((prevOrderBook) => ({
                ...prevOrderBook,
                asks: prevOrderBook.asks.filter(
                  (order) => order.price !== price
                ),
              }));
            }
          }
        }
      }
    };

    return () => {
      ws.close();
    };
  }, [subscribeData]);
  return orderBook;
};

export default useWebSocket;

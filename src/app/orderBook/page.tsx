import OrderBook from "@/app/components/OrderBook/OrderBook";
import {
  PRECISION_KEY,
  CHANNEL_KEY,
  EVENT_KEY,
  FREQUENCY_KEY,
  SYMBOL_KEY,
} from "../configuration/orderBookCOnfiguration/orderBookConfig";

const OrderBookPage = () => {
  return (
    <OrderBook
      subscribeData={{
        event: EVENT_KEY,
        channel: CHANNEL_KEY,
        symbol: SYMBOL_KEY,
        prec: PRECISION_KEY,
        freq: FREQUENCY_KEY,
      }}
    />
  );
};

export default OrderBookPage;

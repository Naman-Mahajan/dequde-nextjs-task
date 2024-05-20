import OrderBook from "@/app/components/OrderBook/OrderBook";

export default function Home() {
    return (
      <div>
      <OrderBook 
        subscribeData={{
          event: 'subscribe',
          channel: 'book',
          symbol: 'tBTCUSD',
          prec: 'P0',
          freq: 'F0',
        }}
      />
    </div>
    );
  }
  
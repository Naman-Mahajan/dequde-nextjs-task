export interface CandleOptions {
    time: number;
    open: number;
    close: number;
    high: number;
    low: number;
  }
  

  export interface Order {
    price: number;
    count: number;
    amount: number;
    total: number;
  }
  
  export interface OrderBookState {
    bids: Order[];
    asks: Order[];
  }
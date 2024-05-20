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

  export interface TimeFrameOption {
    value: string;
    label: string;
  }

  export interface SubscribeData {
    event: string;
    channel: string;
    key: string;
  }

  export interface CustomTooltip {
    open: number;
    high: number;
    low: number;
    close: number;
    difference: number;
    percentage: number;
    valueSign: string,
    profitOrLossText: string;
  }
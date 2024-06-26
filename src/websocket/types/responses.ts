import { CANDLES, HEARTBEATS, LEVEL2, MARKET_TRADES, STATUS, TICKER, TICKER_BATCH, USER } from "../../config/constants";

export interface WSMessage {
    type: string;
    product_ids?: string[];
    channels?: string[];
    success?: boolean;
    error?: string;
  }
  
  export interface HeartbeatsMessage extends WSMessage {
    type: typeof HEARTBEATS;
  }
  
  export interface CandlesMessage extends WSMessage {
    type: typeof CANDLES;
  }
  
  export interface MarketTradesMessage extends WSMessage {
    type: typeof MARKET_TRADES;
  }
  
  export interface StatusMessage extends WSMessage {
    type: typeof STATUS;
  }
  
  export interface TickerMessage extends WSMessage {
    type: typeof TICKER;
  }
  
  export interface TickerBatchMessage extends WSMessage {
    type: typeof TICKER_BATCH;
  }
  
  export interface Level2Message extends WSMessage {
    type: typeof LEVEL2;
  }
  
  export interface UserMessage extends WSMessage {
    type: typeof USER;
  }
  
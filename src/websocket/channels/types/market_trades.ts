import { BaseMessage } from "./BaseMessage";

export interface MarketTradesRequest extends BaseMessage {
    jwt?: string;
  }
  
  export interface MarketTradesMessage {
    channel: string;
    client_id: string;
    timestamp: string;
    sequence_num: number;
    events: Array<{
      type: string;
      trades: Array<{
        trade_id: string;
        product_id: string;
        price: string;
        size: string;
        side: string;
        time: string;
      }>;
    }>;
  }
  
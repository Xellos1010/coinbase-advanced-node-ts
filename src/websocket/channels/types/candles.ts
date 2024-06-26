import { BaseMessage } from "./BaseMessage";

export interface CandlesRequest extends BaseMessage {
    jwt?: string;
  }
  
  export interface CandlesMessage {
    channel: string;
    client_id: string;
    timestamp: string;
    sequence_num: number;
    events: Array<{
      type: string;
      candles: Array<{
        start: string;
        high: string;
        low: string;
        open: string;
        close: string;
        volume: string;
        product_id: string;
      }>;
    }>;
  }
  
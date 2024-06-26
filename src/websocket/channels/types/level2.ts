import { BaseMessage } from "./BaseMessage";

export interface Level2Request extends BaseMessage {
    jwt?: string;
  }
  
  export interface Level2Message {
    channel: string;
    client_id: string;
    timestamp: string;
    sequence_num: number;
    events: Array<{
      type: string;
      product_id: string;
      updates: Array<{
        side: string;
        event_time: string;
        price_level: string;
        new_quantity: string;
      }>;
    }>;
  }
  
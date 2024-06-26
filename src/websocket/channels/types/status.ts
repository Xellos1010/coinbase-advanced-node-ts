import { BaseMessage } from "./BaseMessage";

export interface StatusRequest extends BaseMessage {
    jwt?: string;
  }
  
  export interface StatusMessage {
    channel: string;
    client_id: string;
    timestamp: string;
    sequence_num: number;
    events: Array<{
      type: string;
      products: Array<{
        product_type: string;
        id: string;
        base_currency: string;
        quote_currency: string;
        base_increment: string;
        quote_increment: string;
        display_name: string;
        status: string;
        status_message: string;
        min_market_funds: string;
      }>;
    }>;
  }
  
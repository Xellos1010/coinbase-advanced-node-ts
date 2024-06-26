import { BaseMessage } from "./BaseMessage";

export interface HeartbeatsRequest extends BaseMessage {
    jwt?: string;
  }
  export interface HeartbeatsMessage {
    channel: string;
    client_id: string;
    timestamp: string;
    sequence_num: number;
    events: Array<{
      current_time: string;
      heartbeat_counter: string;
    }>;
  }
  
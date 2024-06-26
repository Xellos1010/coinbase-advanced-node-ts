import { AuthenticatedMessage } from './AuthenticatedMessage';

export interface UserRequest extends AuthenticatedMessage {}
  
  export interface UserMessage {
    channel: string;
    client_id: string;
    timestamp: string;
    sequence_num: number;
    events: Array<{
      type: string;
      orders: Array<{
        avg_price: string;
        cancel_reason: string;
        client_order_id: string;
        completion_percentage: string;
        contract_expiry_type: string;
        cumulative_quantity: string;
        filled_value: string;
        leaves_quantity: string;
        limit_price: string;
        number_of_fills: string;
        order_id: string;
        order_side: string;
        order_type: string;
        outstanding_hold_amount: string;
        post_only: string;
        product_id: string;
        product_type: string;
        reject_reason: string;
        risk_managed_by: string;
        status: string;
        stop_price: string;
        time_in_force: string;
        total_fees: string;
        total_value_after_fees: string;
        trigger_status: string;
        creation_time: string;
        end_time: string;
        start_time: string;
      }>;
    }>;
  }
  
import { BaseMessage } from "./BaseMessage";
import {
    UNSUBSCRIBE_MESSAGE_TYPE
} from "../../../config/constants";

export type UnsubscribeMessage<T extends BaseMessage> = T & { type: typeof UNSUBSCRIBE_MESSAGE_TYPE };

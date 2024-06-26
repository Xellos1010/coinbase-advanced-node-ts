import { BaseMessage } from "./BaseMessage";
import {
    SUBSCRIBE_MESSAGE_TYPE
} from "../../../config/constants";

export type SubscribeMessage<T extends BaseMessage> = T & { type: typeof SUBSCRIBE_MESSAGE_TYPE };

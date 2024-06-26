import { BaseMessage } from "./BaseMessage";

export interface AuthenticatedMessage extends BaseMessage {
    jwt: string;
  }
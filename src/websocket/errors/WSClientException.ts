export class WSClientException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WSClientException";
  }
}

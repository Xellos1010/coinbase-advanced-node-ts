export class WSClientConnectionClosedException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WSClientConnectionClosedException";
  }
}

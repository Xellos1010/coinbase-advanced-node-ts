import WebSocket from 'ws';
import WebSocketServer from 'ws';

class MockWebSocketServer {
    private server: WebSocketServer;
    private clients: Set<WebSocket>;
  
    constructor(private url: string) {
      this.server = new WebSocketServer(url);
      this.clients = new Set();
  
      this.server.on('connection', (ws: WebSocket) => {
        this.clients.add(ws);
        ws.on('message', (message: string) => {
          ws.send(message); // Echo the message back to the client
        });
        ws.on('close', () => {
          this.clients.delete(ws);
        });
      });
    }
  
    public close(): void {
      this.server.close();
      this.clients.forEach(client => client.close());
    }
  
    public async triggerConnectionClosedError(): Promise<void> {
      for (const client of this.clients) {
        client.close(4000, 'Abnormal closure');
      }
    }
  
    public async restartWithError(): Promise<void> {
      await this.triggerConnectionClosedError();
      this.close();
      await new Promise(res => setTimeout(res, 1000)); // Short delay to ensure the port is freed up
      this.server = new WebSocketServer(this.url);
      this.clients.clear();
    }
  }
  
  export default MockWebSocketServer;
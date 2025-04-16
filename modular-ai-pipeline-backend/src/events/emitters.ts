import { clients } from "./wsServer";

export function emitStatusUpdate(nodeId, status, payload) {
  for (const [_, ws] of clients) {
    ws.send(JSON.stringify({ nodeId, status, payload }));
  }
}

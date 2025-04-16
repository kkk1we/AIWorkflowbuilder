import { WebSocketServer } from "ws";
export const wss = new WebSocketServer({ port: 8081 });

export const clients = new Map();

wss.on("connection", (ws, req) => {
  const id = req.url?.split("/").pop();
  if (id) clients.set(id, ws);

  ws.on("close", () => {
    if (id) clients.delete(id);
  });
});
import ws from "ws";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { appRouter } from "app/server/api/root";
import { createTRPCContext } from "app/server/api/trpc";

const wss = new ws.Server({
  port: 3001,
});

const handler = applyWSSHandler({
  wss: wss,
  router: appRouter,
  createContext: createTRPCContext,
});

wss.on("connection", () => {
  //   console.log(`Got a c donnection ${wss.clients.size}`);
  wss.once("close", () => {
    // console.log(`Closed connection ${wss.clients.size}`);
  });
});

console.log(`wss server start at ws://localhost:3001`);

process.on("SIGTERM", () => {
  console.log("Got SIGTERM");
  handler.broadcastReconnectNotification();
  wss.close();
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const ws_2 = require("@trpc/server/adapters/ws");
const root_1 = require("app/server/api/root");
const trpc_1 = require("app/server/api/trpc");
const wss = new ws_1.default.Server({
    port: 3001,
});
const handler = (0, ws_2.applyWSSHandler)({
    wss: wss,
    router: root_1.appRouter,
    createContext: trpc_1.createTRPCContext,
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

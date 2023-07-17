"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const example_1 = require("app/server/api/routers/example");
const trpc_1 = require("app/server/api/trpc");
const posts_1 = require("./routers/posts");
const room_1 = require("./routers/room");
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
exports.appRouter = (0, trpc_1.createTRPCRouter)({
    example: example_1.exampleRouter,
    posts: posts_1.postsRouter,
    room: room_1.roomRouter,
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exampleRouter = void 0;
const zod_1 = require("zod");
const trpc_1 = require("app/server/api/trpc");
exports.exampleRouter = (0, trpc_1.createTRPCRouter)({
    hello: trpc_1.publicProcedure
        .input(zod_1.z.object({ text: zod_1.z.string() }))
        .query(({ input }) => {
        return {
            greeting: `Hello ${input.text}`,
        };
    }),
    getAll: trpc_1.publicProcedure.query(({ ctx }) => {
        return ctx.prisma.example.findMany();
    }),
    getSecretMessage: trpc_1.protectedProcedure.query(() => {
        return "you can now see this secret message!";
    }),
});

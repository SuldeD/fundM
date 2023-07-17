"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomRouter = void 0;
const schemas_1 = require("app/contants/schemas");
const trpc_1 = require("../trpc");
const events_1 = require("app/contants/events");
const crypto_1 = require("crypto");
const observable_1 = require("@trpc/server/observable");
exports.roomRouter = (0, trpc_1.createTRPCRouter)({
    sendMessage: trpc_1.publicProcedure
        .input(schemas_1.sendMessageSchema)
        .mutation(({ ctx, input }) => {
        var _a, _b;
        const message = {
            id: (0, crypto_1.randomUUID)(),
            ...input,
            sendAt: new Date(),
            sender: {
                name: (_b = (_a = ctx.session) === null || _a === void 0 ? void 0 : _a.user.name) !== null && _b !== void 0 ? _b : "Unknown",
            },
        };
        console.log("ee", ctx.ee);
        ctx.ee.emit(events_1.Events.SEND_MESSAGE, message);
        return true;
    }),
    onSendMessage: trpc_1.publicProcedure
        .input(schemas_1.messageSubSchema)
        .subscription(({ ctx, input }) => {
        return (0, observable_1.observable)((emit) => {
            const onMessage = (data) => {
                if (data.roomId === input.roomId) {
                    emit.next(data);
                }
            };
            ctx.ee.on(events_1.Events.SEND_MESSAGE, onMessage);
            return () => {
                ctx.ee.off(events_1.Events.SEND_MESSAGE, onMessage);
            };
        });
    }),
});

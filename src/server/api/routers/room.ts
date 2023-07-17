import {
  Message,
  messageSubSchema,
  sendMessageSchema,
} from "app/contants/schemas";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { Events } from "app/contants/events";
import { randomUUID } from "crypto";
import { observable } from "@trpc/server/observable";

export const roomRouter = createTRPCRouter({
  sendMessage: publicProcedure
    .input(sendMessageSchema)
    .mutation(({ ctx, input }) => {
      const message: Message = {
        id: randomUUID(),
        ...input,
        sendAt: new Date(),
        sender: {
          name: ctx.session?.user.name ?? "Unknown",
        },
      };
      console.log("ee", ctx.ee);
      ctx.ee.emit(Events.SEND_MESSAGE, message);
      return true;
    }),
  onSendMessage: publicProcedure
    .input(messageSubSchema)
    .subscription(({ ctx, input }) => {
      return observable<Message>((emit) => {
        const onMessage = (data: Message) => {
          if (data.roomId === input.roomId) {
            emit.next(data);
          }
        };
        ctx.ee.on(Events.SEND_MESSAGE, onMessage);

        return () => {
          ctx.ee.off(Events.SEND_MESSAGE, onMessage);
        };
      });
    }),
});

import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";
import { loanServiceHeaders } from "app/contants";
import { decrypt, encrypt } from "app/utils/aes.helper";
import { getAccountToken } from "./account";

export const otherRouter = createTRPCRouter({
  notificationChange: protectedProcedure
    .input(
      z.object({
        notification_count: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const token = await getAccountToken(ctx);
      const { notification_count } = input;

      const body = encrypt(
        JSON.stringify({
          notification_count,
          mass_push_count: "0",
        })
      );
      const res2 = await fetch(
        `${process.env.BACKEND_URL}/account/notification/change`,
        {
          method: "POST",
          credentials: "same-origin",
          body: body,
          headers: {
            ...loanServiceHeaders,
            Cookie: token!.id_token!,
            "Session-Token": token!.access_token!,
          },
        }
      );
      const raw2 = await res2.json();
      const accountStatus = decrypt(raw2);
      return accountStatus;
    }),

  notficationSearch: protectedProcedure
    .input(
      z.object({
        order: z.string(),
        order_up: z.string(),
        page: z.string(),
        page_size: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const token = await getAccountToken(ctx);
      const { order, order_up, page, page_size } = input;

      const body = encrypt(
        JSON.stringify({
          order,
          order_up,
          page,
          page_size,
        })
      );
      const res2 = await fetch(`${process.env.BACKEND_URL}/activity/search`, {
        method: "POST",
        credentials: "same-origin",
        body: body,
        headers: {
          ...loanServiceHeaders,
          Cookie: token!.id_token!,
          "Session-Token": token!.access_token!,
        },
      });
      const raw2 = await res2.json();
      const accountStatus = decrypt(raw2);
      console.log(accountStatus);
      return accountStatus;
    }),
});

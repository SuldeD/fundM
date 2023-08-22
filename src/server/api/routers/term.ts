import { createTRPCRouter, protectedProcedure } from "app/server/api/trpc";
import { loanServiceHeaders } from "app/contants";
import { decrypt, encrypt } from "app/utils/aes.helper";
import { getAccountToken } from "./account";
import z from "zod";

export const termRouter = createTRPCRouter({
  termOfServiceConfirm: protectedProcedure.query(async ({ ctx }) => {
    const token = await getAccountToken(ctx);
    const res2 = await fetch(
      `${process.env.BACKEND_URL}/account/term/of/service/confirm`,
      {
        method: "GET",
        credentials: "same-origin",
        headers: {
          ...loanServiceHeaders,
          Cookie: token!.id_token!,
          "Session-Token": token!.access_token!,
        },
      }
    );
    const raw2 = await res2.json();
    const accountStatus = decrypt(raw2);
    console.log(accountStatus);

    return accountStatus;
  }),
  getContent: protectedProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ ctx, input }) => {
      const token = await getAccountToken(ctx);
      const { code } = input;
      const body = encrypt(
        JSON.stringify({
          code,
        })
      );
      const res2 = await fetch(`${process.env.BACKEND_URL}/help/get/content`, {
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
      return accountStatus;
    }),
});

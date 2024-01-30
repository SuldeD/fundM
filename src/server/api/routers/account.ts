import { Session } from "next-auth";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { Prisma, PrismaClient } from "@prisma/client";
import { loanServiceHeaders } from "app/contants";
import { decrypt, encrypt } from "app/utils/aes.helper";
import z from "zod";

export const accountRouter = createTRPCRouter({
  accountStatus: protectedProcedure.query(async ({ ctx }) => {
    const token = await getAccountToken(ctx);
    const res2 = await fetch(`${process.env.BACKEND_URL}/account/status`, {
      method: "GET",
      credentials: "same-origin",
      headers: {
        ...loanServiceHeaders,
        Cookie: token!.id_token!,
        "Session-Token": token!.access_token!,
        "Device-Id": ctx?.deviceId,
      },
    });
    const raw2 = await res2.json();
    const accountStatus = decrypt(raw2);
    return accountStatus;
  }),

  accountStatusDan: protectedProcedure.query(async ({ ctx }) => {
    const token = await getAccountToken(ctx);
    const res2 = await fetch(`${process.env.BACKEND_URL}/sso/request/user`, {
      method: "GET",
      credentials: "same-origin",
      headers: {
        ...loanServiceHeaders,
        Cookie: token!.id_token!,
        "Session-Token": token!.access_token!,
        "Device-Id": ctx?.deviceId,
      },
    });
    const raw2 = await res2.json();
    const accountStatus = decrypt(raw2);
    return accountStatus;
  }),

  accountInfo: protectedProcedure.query(async ({ ctx }) => {
    console.log("accountInfo");
    const token = await getAccountToken(ctx);
    const res2 = await fetch(`${process.env.BACKEND_URL}/account/get/info`, {
      method: "GET",
      credentials: "same-origin",
      headers: {
        ...loanServiceHeaders,
        Cookie: token!.id_token!,
        "Session-Token": token!.access_token!,
        "Device-Id": ctx?.deviceId,
      },
    });
    const raw2 = await res2.json();
    const accountStatus = decrypt(raw2);
    return accountStatus;
  }),

  accountSignature: protectedProcedure
    .input(
      z.object({
        photo: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const token = await getAccountToken(ctx);
      const { photo, password } = input;

      const body = encrypt(
        JSON.stringify({
          photo,
          password,
        })
      );
      const res2 = await fetch(
        `${process.env.BACKEND_URL}/account/signature/add/image`,
        {
          method: "POST",
          credentials: "same-origin",
          body: body,
          headers: {
            ...loanServiceHeaders,
            Cookie: token!.id_token!,
            "Session-Token": token!.access_token!,
            "Device-Id": ctx?.deviceId,
          },
        }
      );
      const raw2 = await res2.json();
      const accountStatus = decrypt(raw2);
      console.log(accountStatus);
      return accountStatus;
    }),
});

export const getAccountToken = async (ctx: {
  session: Session | null;
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
}) => {
  return (ctx?.session as any).token;
};

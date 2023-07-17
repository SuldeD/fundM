import { Prisma, PrismaClient } from "@prisma/client";
import { loanServiceHeaders } from "app/contants";
import { createTRPCRouter, publicProcedure } from "app/server/api/trpc";
import { decrypt } from "app/utils/aes.helper";
import { Session } from "next-auth";

export const loanRouter = createTRPCRouter({
  accountStatus: publicProcedure.query(async ({ ctx }) => {
    const token = await getAccountToken(ctx);
    const res2 = await fetch("http://is.fundme.com/account/get/status", {
      method: "GET",
      credentials: "same-origin",
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
  accountInfo: publicProcedure.query(async ({ ctx }) => {
    const token = await getAccountToken(ctx);
    const res2 = await fetch("http://is.fundme.com/account/get/info", {
      method: "GET",
      credentials: "same-origin",
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

const getAccountToken = async (ctx: {
  session: Session | null;
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
}) => {
  const token = await ctx.prisma.account.findFirst({
    where: {
      userId: ctx.session?.user.id,
    },
  });
  return token;
};

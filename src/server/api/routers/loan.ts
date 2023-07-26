import { Prisma, PrismaClient } from "@prisma/client";
import { loanServiceHeaders } from "app/contants";
import { createTRPCRouter, publicProcedure } from "app/server/api/trpc";
import { decrypt, encrypt } from "app/utils/aes.helper";
import { Session } from "next-auth";
import z from "zod";

export const loanRouter = createTRPCRouter({
  accountStatus: publicProcedure.query(async ({ ctx }) => {
    const token = await getAccountToken(ctx);
    const res2 = await fetch("http://is.fundme.com/account/status", {
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

    return accountStatus;
  }),

  accountStatusDan: publicProcedure.query(async ({ ctx }) => {
    const token = await getAccountToken(ctx);
    const res2 = await fetch("http://is.fundme.com/sso/request/user", {
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
    return accountStatus;
  }),

  accountInfo: publicProcedure.query(async ({ ctx }) => {
    console.log("accountInfo");
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
    return accountStatus;
  }),

  phoneSignUp: publicProcedure
    .input(z.object({ phone: z.string() }))
    .mutation(async ({ input }) => {
      const { phone } = input;
      const body = encrypt(
        JSON.stringify({
          phone,
        })
      );
      const res2 = await fetch("http://is.fundme.com/account/signup", {
        method: "POST",
        credentials: "same-origin",
        body: body,
        headers: {
          ...loanServiceHeaders,
        },
      });
      const raw2 = await res2.json();
      const accountStatus = decrypt(raw2);
      return accountStatus;
    }),

  phoneSignUpVerify: publicProcedure
    .input(
      z.object({
        phone: z.string(),
        tmp_user_id: z.string(),
        pin_code: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { phone, pin_code, tmp_user_id } = input;

      const body = encrypt(
        JSON.stringify({
          phone,
          pin_code,
          tmp_user_id,
        })
      );
      const res2 = await fetch("http://is.fundme.com/account/verify/phone", {
        method: "POST",
        credentials: "same-origin",
        body: body,
        headers: {
          ...loanServiceHeaders,
        },
      });
      const raw2 = await res2.json();
      const accountStatus = decrypt(raw2);
      return accountStatus;
    }),

  SignUp: publicProcedure
    .input(
      z.object({
        phone: z.string(),
        username: z.string(),
        tmp_user_id: z.string(),
        password: z.string(),
        pin_code: z.string(),
        security_question_id: z.string(),
        question: z.string(),
        answer: z.string(),
        transaction_password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const {
        phone,
        username,
        tmp_user_id,
        password,
        pin_code,
        security_question_id,
        question,
        answer,
        transaction_password,
      } = input;

      const body = encrypt(
        JSON.stringify({
          phone,
          username,
          tmp_user_id,
          password,
          pin_code,
          security_question_id,
          question,
          answer,
          transaction_password,
        })
      );
      const res2 = await fetch("http://is.fundme.com/account/new/user", {
        method: "POST",
        credentials: "same-origin",
        body: body,
        headers: {
          ...loanServiceHeaders,
        },
      });
      const raw2 = await res2.json();
      const accountStatus = decrypt(raw2);
      return accountStatus;
    }),

  helpQuestion: publicProcedure.query(async ({}) => {
    const res2 = await fetch(
      "http://is.fundme.com/help/security/question/list",
      {
        method: "GET",
        credentials: "same-origin",
        headers: {
          ...loanServiceHeaders,
        },
      }
    );
    const raw2 = await res2.json();
    const accountStatus = decrypt(raw2);
    return accountStatus;
  }),

  helpBankList: publicProcedure.query(async ({ ctx }) => {
    const token = await getAccountToken(ctx);
    const res2 = await fetch("http://is.fundme.com/help/bank/list", {
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
    return accountStatus;
  }),

  reguestSearch: publicProcedure
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
      const res2 = await fetch("http://is.fundme.com/request/search", {
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

  loanSearch: publicProcedure
    .input(
      z.object({
        order: z.string(),
        order_up: z.string(),
        page: z.string(),
        page_size: z.string(),
        filter_type: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const token = await getAccountToken(ctx);
      const { order, order_up, page, page_size, filter_type } = input;

      const body = encrypt(
        JSON.stringify({
          order,
          order_up,
          page,
          page_size,
          filter_type,
        })
      );
      const res2 = await fetch("http://is.fundme.com/loan/search", {
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

  loanRequest: publicProcedure
    .input(
      z.object({
        loan_amount: z.string(),
        repayment_amount: z.string(),
        loan_month: z.string(),
        product_id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const token = await getAccountToken(ctx);
      const { product_id, loan_amount, repayment_amount, loan_month } = input;

      const body = encrypt(
        JSON.stringify({
          product_id,
          loan_amount,
          repayment_amount,
          loan_month,
        })
      );
      const res2 = await fetch("http://is.fundme.com/loan/request", {
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

  loanRequestConfirm: publicProcedure
    .input(
      z.object({
        request_id: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const token = await getAccountToken(ctx);
      const { request_id, password } = input;
      const form_data: any = [];

      const body = encrypt(
        JSON.stringify({
          request_id,
          form_data,
          password,
        })
      );
      const res2 = await fetch("http://is.fundme.com/loan/request/confirm", {
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

  addBank: publicProcedure
    .input(
      z.object({
        account_num: z.string(),
        bank_id: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const token = await getAccountToken(ctx);
      const { bank_id, password, account_num } = input;

      const body = encrypt(
        JSON.stringify({
          bank_id,
          account_num,
          password,
        })
      );
      const res2 = await fetch(
        "http://is.fundme.com/account/add/bank/account",
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
      console.log(accountStatus);
      return accountStatus;
    }),

  addBankVerify: publicProcedure
    .input(
      z.object({
        photo: z.string(),
        confirm_code: z.string(),
        password: z.string(),
        request_id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const token = await getAccountToken(ctx);
      const { photo, password, confirm_code, request_id } = input;

      const body = encrypt(
        JSON.stringify({
          photo,
          confirm_code,
          request_id,
          password,
        })
      );
      const res2 = await fetch(
        "http://is.fundme.com/loan/bank/account/verify",
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
      console.log(accountStatus);
      return accountStatus;
    }),

  loanList: publicProcedure.query(async ({ ctx }) => {
    const token = await getAccountToken(ctx);
    const res2 = await fetch("http://is.fundme.com/product/list", {
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
  // console.log("getAccountToken", ctx?.session);
  return (ctx?.session as any).token;
};

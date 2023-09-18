import { loanServiceHeaders } from "app/contants";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "app/server/api/trpc";
import { decrypt, encrypt } from "app/utils/aes.helper";
import z from "zod";
import { getAccountToken } from "./account";
import { TRPCError } from "@trpc/server";
import { Modal } from "antd";
const { error } = Modal;

export const loanRouter = createTRPCRouter({
  loanContract: protectedProcedure.query(async ({ ctx }) => {
    const token = await getAccountToken(ctx);
    const res2 = await fetch(`${process.env.BACKEND_URL}/help/loan/contract`, {
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

  loanList: protectedProcedure.query(async ({ ctx }) => {
    const token = await getAccountToken(ctx);
    const res2 = await fetch(`${process.env.BACKEND_URL}/product/list`, {
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

  helpBankList: protectedProcedure.query(async ({ ctx }) => {
    const token = await getAccountToken(ctx);
    const res2 = await fetch(`${process.env.BACKEND_URL}/help/bank/list`, {
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

  reguestSearch: protectedProcedure
    .input(
      z.object({
        order: z.string(),
        order_up: z.string(),
        page: z.string(),
        page_size: z.string(),
        filter_type: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
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
      const res2 = await fetch(`${process.env.BACKEND_URL}/request/search`, {
        method: "POST",
        credentials: "same-origin",
        body: body,
        headers: {
          ...loanServiceHeaders,
          Cookie: token!.id_token!,
          "Session-Token": token!.access_token!,
        },
      });

      console.log(res2, "res2");
      const raw2 = await res2.json();
      const accountStatus = decrypt(raw2);
      console.log(accountStatus);

      if (!accountStatus) {
        throw new TRPCError(accountStatus.message);
      }
      return accountStatus;
    }),

  loanSearch: protectedProcedure
    .input(
      z.object({
        order: z.string(),
        order_up: z.string(),
        page: z.string(),
        page_size: z.string(),
        filter_type: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
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
      const res2 = await fetch(`${process.env.BACKEND_URL}/loan/search`, {
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

  loanRequestConfirm: protectedProcedure
    .input(
      z.object({
        request_id: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const token = await getAccountToken(ctx);
      const { request_id, password } = input;

      const body = encrypt(
        JSON.stringify({
          request_id,
          password,
          form_data: [],
        })
      );
      const res2 = await fetch(
        `${process.env.BACKEND_URL}/loan/request/confirm`,
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

  loanRequest: protectedProcedure
    .input(
      z.object({
        product_id: z.string(),
        loan_amount: z.string(),
        repayment_amount: z.string(),
        loan_month: z.string(),
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
      const res2 = await fetch(`${process.env.BACKEND_URL}/loan/request`, {
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

  walletToBank: protectedProcedure
    .input(
      z.object({
        account_num: z.string(),
        bank_id: z.string(),
        account_name: z.string(),
        amount: z.string(),
        description: z.string(),
        loan_duration_day: z.string(),
        loan_duration_month: z.string(),
        pay_day: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const token = await getAccountToken(ctx);
      const {
        account_name,
        bank_id,
        account_num,
        amount,
        description,
        loan_duration_day,
        loan_duration_month,
        pay_day,
      } = input;

      const body = encrypt(
        JSON.stringify({
          account_name,
          bank_id,
          account_num,
          amount,
          description,
          loan_duration_day,
          loan_duration_month,
          pay_day,
        })
      );
      const res2 = await fetch(
        `${process.env.BACKEND_URL}/wallet/to/bank/account`,
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

  walletToBankConfirm: protectedProcedure
    .input(
      z.object({
        transaction_id: z.string(),
        pin_code: z.string(),
        form_token: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const token = await getAccountToken(ctx);
      const { transaction_id, pin_code, form_token, password } = input;

      const body = encrypt(
        JSON.stringify({
          transaction_id,
          pin_code,
          form_token,
          password,
        })
      );
      const res2 = await fetch(
        `${process.env.BACKEND_URL}/wallet/to/bank/account/confirm`,
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

  repayment: protectedProcedure
    .input(
      z.object({
        request_id: z.string(),
        password: z.string(),
        pay_type:z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const token = await getAccountToken(ctx);
      const { request_id, password, pay_type } = input;

      const body = encrypt(
        JSON.stringify({
          request_id,
          password,
          pay_type,
        })
      );
      const res2 = await fetch(
        `${process.env.BACKEND_URL}/loan/repayment/info`,
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


    downloadPdf: protectedProcedure
    .input(
      z.object({
        request_id: z.string(),
        password: z.string(),
        contract_type: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const token = await getAccountToken(ctx);
      const { request_id, password, contract_type} = input;

      const body = encrypt(
        JSON.stringify({
          request_id,
          password,
          contract_type,
        })
      );
      const res2 = await fetch(
        `${process.env.BACKEND_URL}/loan/contract/photo`,
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


    
});

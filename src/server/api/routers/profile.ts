import { loanServiceHeaders } from "../../../contants";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../../server/api/trpc";
import { decrypt, encrypt } from "../../../utils/aes.helper";
import z from "zod";
import { getAccountToken } from "./account";

export const profileRouter = createTRPCRouter({
  addBank: protectedProcedure
    .input(
      z.object({
        account_num: z.string(),
        bank_id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const token = await getAccountToken(ctx);
      const { account_num, bank_id } = input;

      const body = encrypt(
        JSON.stringify({
          account_num,
          bank_id,
        })
      );
      const res2 = await fetch(
        `${process.env.BACKEND_URL}/account/add/bank/account`,
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

  addBankVerify: protectedProcedure
    .input(
      z.object({
        confirm_code: z.string(),
        photo: z.string(),
        request_id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const token = await getAccountToken(ctx);
      const { confirm_code, photo, request_id } = input;

      const body = encrypt(
        JSON.stringify({
          confirm_code,
          photo,
          request_id,
        })
      );

      const res2 = await fetch(
        `${process.env.BACKEND_URL}/loan/bank/account/verify`,
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
      console.log("res2", res2);
      const raw2 = await res2.json();
      const accountStatus = decrypt(raw2);
      console.log(accountStatus);
      return accountStatus;
    }),

  addEmail: protectedProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const token = await getAccountToken(ctx);
      const { email, password } = input;

      const body = encrypt(
        JSON.stringify({
          email,
          password,
        })
      );
      const res2 = await fetch(`${process.env.BACKEND_URL}/account/add/email`, {
        method: "POST",
        credentials: "same-origin",
        body: body,
        headers: {
          ...loanServiceHeaders,
          Cookie: token!.id_token!,
          "Session-Token": token!.access_token!,
          "Device-Id": ctx?.deviceId,
        },
      });
      const raw2 = await res2.json();
      const accountStatus = decrypt(raw2);
      console.log(accountStatus);
      return accountStatus;
    }),

  changePhone: protectedProcedure
    .input(
      z.object({
        phone: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const token = await getAccountToken(ctx);
      const { phone, password } = input;

      const body = encrypt(
        JSON.stringify({
          phone,
          password,
        })
      );
      const res2 = await fetch(
        `${process.env.BACKEND_URL}/account/change/phone/request`,
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

  changePhoneConfirm: protectedProcedure
    .input(
      z.object({
        form_token: z.string(),
        change_phone_id: z.string(),
        pin_code: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const token = await getAccountToken(ctx);
      const { form_token, change_phone_id, pin_code } = input;

      const body = encrypt(
        JSON.stringify({
          form_token,
          change_phone_id,
          pin_code,
        })
      );
      const res2 = await fetch(
        `${process.env.BACKEND_URL}/account/change/phone/confirm`,
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

  forgotPass: publicProcedure
    .input(
      z.object({
        phone: z.string(),
        username: z.string(),
        register: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { phone, username, register } = input;

      const body = encrypt(
        JSON.stringify({
          phone,
          username,
          register,
          security_question_id: "1",
          question: "Хүүхэд байх дуртай хоол чинь юу вэ?",
          answer: "mantuun buuz",
        })
      );
      const res2 = await fetch(
        `${process.env.BACKEND_URL}/account/forgot/password`,
        {
          method: "POST",
          credentials: "same-origin",
          body: body,
          headers: {
            ...loanServiceHeaders,
            "Device-Id": ctx?.deviceId,
          },
        }
      );
      const raw2 = await res2.json();
      const accountStatus = decrypt(raw2);
      console.log(accountStatus);
      return accountStatus;
    }),

  forgotPassConfirm: publicProcedure
    .input(
      z.object({
        pin_code: z.string(),
        username: z.string(),
        register: z.string(),
        forgot_id: z.string(),
        new_password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { pin_code, username, register, new_password, forgot_id } = input;

      const body = encrypt(
        JSON.stringify({
          pin_code,
          username,
          security_question_id: "1",
          answer: "mantuun buuz",
          register,
          new_password,
          forgot_id,
        })
      );
      const res2 = await fetch(
        `${process.env.BACKEND_URL}/account/forgot/password/confirm`,
        {
          method: "POST",
          credentials: "same-origin",
          body: body,
          headers: {
            ...loanServiceHeaders,
            "Device-Id": ctx?.deviceId,
          },
        }
      );
      const raw2 = await res2.json();
      const accountStatus = decrypt(raw2);
      console.log(accountStatus);
      return accountStatus;
    }),

  changePass: protectedProcedure
    .input(
      z.object({
        old_password: z.string(),
        new_password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const token = await getAccountToken(ctx);
      const { old_password, new_password } = input;

      const body = encrypt(
        JSON.stringify({
          old_password,
          new_password,
        })
      );
      const res2 = await fetch(
        `${process.env.BACKEND_URL}/account/change/password`,
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

  changePassFund: protectedProcedure
    .input(
      z.object({
        old_password: z.string(),
        new_password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const token = await getAccountToken(ctx);
      const { old_password, new_password } = input;

      const body = encrypt(
        JSON.stringify({
          old_password,
          new_password,
        })
      );
      const res2 = await fetch(
        `${process.env.BACKEND_URL}/account/change/trans/password`,
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

  forgotTransPass: protectedProcedure
    .input(
      z.object({
        username: z.string(),
        register: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const token = await getAccountToken(ctx);
      const { username, register } = input;

      const body = encrypt(
        JSON.stringify({
          security_question_id: "1",
          answer: "mantuun buuz",
          username,
          register,
        })
      );
      const res2 = await fetch(
        `${process.env.BACKEND_URL}/account/forgot/trans/password`,
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

  forgotTransPassConfirm: protectedProcedure
    .input(
      z.object({
        username: z.string(),
        register: z.string(),
        forgot_id: z.string(),
        new_password: z.string(),
        pin_code: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const token = await getAccountToken(ctx);
      const { username, register, forgot_id, new_password, pin_code } = input;

      const body = encrypt(
        JSON.stringify({
          security_question_id: "1",
          answer: "mantuun buuz",
          username,
          register,
          forgot_id,
          new_password,
          pin_code,
        })
      );
      const res2 = await fetch(
        `${process.env.BACKEND_URL}/account/forgot/trans/password/confirm`,
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

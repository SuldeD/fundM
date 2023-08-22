import { loanServiceHeaders } from "app/contants";
import { createTRPCRouter, publicProcedure } from "app/server/api/trpc";
import { decrypt, encrypt } from "app/utils/aes.helper";
import z from "zod";

export const registerRouter = createTRPCRouter({
  phoneSignUp: publicProcedure
    .input(z.object({ phone: z.string() }))
    .mutation(async ({ input }) => {
      const { phone } = input;
      const body = encrypt(
        JSON.stringify({
          phone,
        })
      );
      const res2 = await fetch(`${process.env.BACKEND_URL}/account/signup`, {
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
      const res2 = await fetch(
        `${process.env.BACKEND_URL}/account/verify/phone`,
        {
          method: "POST",
          credentials: "same-origin",
          body: body,
          headers: {
            ...loanServiceHeaders,
          },
        }
      );
      const raw2 = await res2.json();
      const accountStatus = decrypt(raw2);
      return accountStatus;
    }),

  signUp: publicProcedure
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
        register: z.string(),
        first_name: z.string(),
        last_name: z.string(),
        transaction_password: z.string(),
        email: z.string(),
        user_type: z.string(),
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
        register,
        first_name,
        last_name,
        email,
        user_type,
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
          register,
          first_name,
          last_name,
          email,
          user_type,
        })
      );
      const res2 = await fetch(`${process.env.BACKEND_URL}/account/new/user`, {
        method: "POST",
        credentials: "same-origin",
        body: body,
        headers: {
          ...loanServiceHeaders,
        },
      });
      console.log(res2, "res2");
      const raw2 = await res2.json();
      const accountStatus = decrypt(raw2);
      return accountStatus;
    }),

  signUpOrg: publicProcedure
    .input(
      z.object({
        phone: z.string(),
        username: z.string(),
        tmp_user_id: z.string(),
        password: z.string(),
        pin_code: z.string(),
        first_name: z.string(),
        last_name: z.string(),
        transaction_password: z.string(),
        org_register: z.string(),
        user_type: z.string(),
        email: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const {
        phone,
        username,
        tmp_user_id,
        password,
        pin_code,
        transaction_password,
        first_name,
        last_name,
        org_register,
        user_type,
        email,
      } = input;

      const body = encrypt(
        JSON.stringify({
          phone,
          username,
          tmp_user_id,
          password,
          pin_code,
          org_register,
          transaction_password,
          first_name,
          last_name,
          user_type,
          email,
        })
      );
      const res2 = await fetch(`${process.env.BACKEND_URL}/account/new/user`, {
        method: "POST",
        credentials: "same-origin",
        body: body,
        headers: {
          ...loanServiceHeaders,
        },
      });
      console.log(res2, "res2");
      const raw2 = await res2.json();
      const accountStatus = decrypt(raw2);
      return accountStatus;
    }),

  helpQuestion: publicProcedure.query(async ({}) => {
    const res2 = await fetch(
      `${process.env.BACKEND_URL}/help/security/question/list`,
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

  orgSignUpVerify: publicProcedure
    .input(
      z.object({
        phone: z.string(),
        tmp_user_id: z.string(),
        pin_code: z.string(),
        user_type: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { phone, pin_code, tmp_user_id, user_type } = input;

      const body = encrypt(
        JSON.stringify({
          phone,
          pin_code,
          tmp_user_id,
          user_type,
        })
      );
      const res2 = await fetch(
        `${process.env.BACKEND_URL}/account/verify/phone`,
        {
          method: "POST",
          credentials: "same-origin",
          body: body,
          headers: {
            ...loanServiceHeaders,
          },
        }
      );
      const raw2 = await res2.json();
      const accountStatus = decrypt(raw2);
      return accountStatus;
    }),
});

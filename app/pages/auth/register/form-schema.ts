import { message } from "antd";
import { z } from "zod";
import { passwordRegex } from "../../../../src/contants";

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Имэйл хаяг оруулна уу!" })
    .email({ message: "Имэйл хаяг биш байна!" }),

  lastName: z
    .string()
    .min(1, { message: "Байгууллагын нэрээ оруулна уу!" })
    .regex(/^[а-яёөүА-ЯЁӨҮ\s]+$/, { message: "Зөвхөн крилл үсэг оруулна уу!" }),
  firstName: z
    .string()
    .min(1, { message: "Удирдлагын нэрээ оруулна уу!" })
    .regex(/^[а-яёөүА-ЯЁӨҮ\s]+$/, { message: "Зөвхөн крилл үсэг оруулна уу!" }),

  register: z.string().min(6, "Зөв регистрийн дугаар оруулна уу! /Тоо"),

  checked: z.boolean().default(false).optional(),
});

export const phoneSchema = z.object({
  phone: z.string().min(8, "Гар утасны дугаараа оруулна уу!"),
});

export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Шинэ нууц үг дор хаяж 8 тэмдэгтээс бүрдэнэ" })
      .regex(passwordRegex, {
        message:
          "1 том, жижиг, тусгай тэмдэгт (^ $ * . [ ] { } ( ) ? - “ ! @ # % & / , > < ’ : ; | _ ~ `) агуулсан байх ёстой.",
      }),
    confirmPassword: z
      .string()
      .min(8, { message: "Шинэ нууц үг дор хаяж 8 тэмдэгтээс бүрдэнэ" })
      .regex(passwordRegex, {
        message:
          "1 том, жижиг, тусгай тэмдэгт (^ $ * . [ ] { } ( ) ? - “ ! @ # % & / , > < ’ : ; | _ ~ `) агуулсан байх ёстой.",
      }),
  })
  .required()
  .superRefine((data, ctx) => {
    if (!(data.password === data.confirmPassword)) {
      ctx.addIssue({
        message: "Нууц үгтэй таарахгүй байна!",
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
      });
    }
  });

export const transPasswordSchema = z
  .object({
    transPassword: z
      .string()
      .min(4, { message: "Гүйлгээний нууц үг 4 оронтой тооноос бүрдэнэ" })
      .max(4, { message: "Гүйлгээний нууц үг 4 оронтой тооноос бүрдэнэ" }),

    transConfirmPassword: z
      .string()
      .min(4, { message: "Гүйлгээний нууц үг 4 оронтой тооноос бүрдэнэ" })
      .max(4, { message: "Гүйлгээний нууц үг 4 оронтой тооноос бүрдэнэ" }),
  })
  .required()
  .superRefine((data, ctx) => {
    if (!(data.transPassword === data.transConfirmPassword)) {
      ctx.addIssue({
        message: "Нууц үгтэй таарахгүй байна!",
        code: z.ZodIssueCode.custom,
        path: ["transConfirmPassword"],
      });
    }
  });

export type LoginFormDataType = z.infer<typeof registerSchema>;

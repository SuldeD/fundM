import { z } from "zod";
import { passwordRegex } from "../../../../src/contants";

export const forgotSchema = z
  .object({
    username: z.string().min(1, "Гар утасны дугаараа оруулна уу!"),
    register: z.string().min(1, "Зөв регистрийн дугаар оруулна уу! /Тоо/"),
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

export type LoginFormDataType = z.infer<typeof forgotSchema>;

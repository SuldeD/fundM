import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Гар утасны дугаараа оруулна уу!"),
  password: z.string().min(1, { message: "Нууц үгээ оруулна уу!" }),
});

// export const registerSchema = z
//   .object({
//     email: z
//       .string()
//       .min(1, { message: "Имэйл хаяг оруулна уу!" })
//       .email({ message: "Имэйл хаяг биш байна!" }),
//     password: z
//       .string()
//       .min(8, { message: "Шинэ нууц үг дор хаяж 8 тэмдэгтээс бүрдэнэ" })
//       .regex(passwordRegex, {
//         message:
//           "1 том, жижиг, тусгай тэмдэгт (^ $ * . [ ] { } ( ) ? - “ ! @ # % & / , > < ’ : ; | _ ~ `) агуулсан байх ёстой.",
//       }),
//     confirmPassword: z
//       .string()
//       .min(8, { message: "Шинэ нууц үг дор хаяж 8 тэмдэгтээс бүрдэнэ" })
//       .regex(passwordRegex, {
//         message:
//           "1 том, жижиг, тусгай тэмдэгт (^ $ * . [ ] { } ( ) ? - “ ! @ # % & / , > < ’ : ; | _ ~ `) агуулсан байх ёстой.",
//       }),
//     lastName: z.string().min(1, { message: "Шаардлагатай" }),
//     firstName: z.string().min(1, { message: "Шаардлагатай" }),
//     agree: z.boolean(),
//     phoneNumber: z.string().min(8, { message: "Утасны дугаар шаардлагатай" }),
//   })
//   .required()
//   .superRefine((data, ctx) => {
//     if (!(data.password === data.confirmPassword)) {
//       ctx.addIssue({
//         message: "Нууц үгтэй таарахгүй байна!",
//         code: z.ZodIssueCode.custom,
//         path: ["confirmPassword"],
//       });
//     }
//   });

export type LoginFormDataType = z.infer<typeof loginSchema>;

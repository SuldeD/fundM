import Link from "next/link";
import { UserForgotForm } from "./user-forgot";
import React from "react";
import Logo from "../../../../src/components/logo";
import { Toggle } from "../../../ui/toggle";
import { cn } from "../../../../lib/utils";

export default function ForgotPage() {
  return (
    <>
      <div className="container relative grid h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="absolute left-4 top-4 flex md:right-8 md:top-8 lg:hidden">
          <Logo />
        </div>
        <Link
          href="login"
          className={cn("absolute right-4 top-4 md:right-8 md:top-8")}
        >
          <Toggle>Нэвтрэх</Toggle>
        </Link>

        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Logo customTheme={"light"} />
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Богино хугацааны эх үүсвэртээ өгөөж хүртэн, санхүүгийн
                эрэлт хэрэгцээгээ хангах боломжтой.&rdquo;
              </p>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-3xl font-semibold tracking-tight">
                Нууц үг шинээр үүсгэх
              </h1>
              <p className="text-sm text-mutedForeground">
                Өөрийн бүртгэлтэй регистрийн дугаар оруулна уу.
              </p>
            </div>
            <UserForgotForm />
          </div>
        </div>
      </div>
    </>
  );
}

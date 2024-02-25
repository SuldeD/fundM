import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { Icons } from "../../../ui/icons";
import { cn } from "../../../../lib/utils";

import Link from "next/link";
import { LoginFormDataType, loginSchema } from "./form-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../ui/form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import React from "react";

function UserAuthForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const router = useRouter();
  const { error } = router.query;

  const form = useForm<LoginFormDataType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(data: LoginFormDataType) {
    setIsLoading(true);

    setTimeout(() => {
      signIn("credentials", {
        ...data,
        redirect: true,
      });
    }, 2000);
  }

  return (
    <div className={cn("grid gap-6")}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            {error && <p className="text-red-500">{error}</p>}
            <div className="grid gap-1">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Гар утасны дугаар оруулах</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Утасны дугаар"
                        type="number"
                        autoCapitalize="none"
                        autoComplete="phone"
                        autoCorrect="off"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-1">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Нууц үг оруулах</FormLabel>
                    <FormControl>
                      <div className="relative ">
                        <Input
                          placeholder="Нууц үг"
                          type={show ? "text" : "password"}
                          className="pr-8"
                          autoCapitalize="none"
                          autoComplete="password"
                          autoCorrect="off"
                          disabled={isLoading}
                          {...field}
                        />
                        {show ? (
                          <EyeOpenIcon
                            className="absolute right-3 top-1/3 cursor-pointer"
                            onClick={() => {
                              setShow(false);
                            }}
                          />
                        ) : (
                          <EyeNoneIcon
                            className="absolute right-3 top-1/3 cursor-pointer"
                            onClick={() => {
                              setShow(true);
                            }}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Link
              href="forgot"
              className="text-end text-sm text-primary dark:text-white"
            >
              Нууц үгээ мартсан уу ?
            </Link>
            <Button disabled={isLoading} variant="primary">
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Нэвтрэх
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default UserAuthForm;

import React from "react";

import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { Icons } from "../../../ui/icons";
import { cn } from "../../../../lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../ui/form";

import { passwordSchema } from "./form-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { motion } from "framer-motion";
import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useRegisterStore } from "../../../../lib/store";

function UserPasswordForm() {
  const setAddSecondStep = useRegisterStore((state) => state.setAddSecondStep);
  const setAddThirdStep = useRegisterStore((state) => state.setAddThirdStep);
  const setAddFinishStep = useRegisterStore((state) => state.setAddFinishStep);

  const setAddPassword = useRegisterStore((state) => state.setAddPassword);
  const registerValues = useRegisterStore((state) => state);

  const [show, setShow] = useState<boolean>(false);
  const [show2, setShow2] = useState<boolean>(false);

  const form = useForm<{ password: string; confirmPassword: string }>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: registerValues.password,
      confirmPassword: registerValues.password,
    },
  });

  function onSubmit(formdata: { password: string; confirmPassword: string }) {
    setAddPassword(formdata.confirmPassword);

    setAddThirdStep(false);
    setAddFinishStep(true);
  }

  return (
    <div className={cn("grid gap-4")}>
      <motion.div
        animate={{ x: "0", opacity: 1, scale: 1 }}
        initial={{ x: "10%", opacity: 0, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-1">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Нэвтрэх нууц үг үүсгэх</FormLabel>
                      <FormControl>
                        <div className="relative ">
                          <Input
                            placeholder="Нэвтрэх нууц үг"
                            type={show ? "text" : "password"}
                            className="pr-8"
                            autoCapitalize="none"
                            autoComplete="password"
                            autoCorrect="off"
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
              <div className="grid gap-1">
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Нэвтрэх нууц үг давтан оруулах</FormLabel>
                      <FormControl>
                        <div className="relative ">
                          <Input
                            placeholder="Нэвтрэх нууц үг давтах"
                            type={show2 ? "text" : "password"}
                            className="pr-8"
                            autoCapitalize="none"
                            autoComplete="password"
                            autoCorrect="off"
                            {...field}
                          />
                          {show2 ? (
                            <EyeOpenIcon
                              className="absolute right-3 top-1/3 cursor-pointer"
                              onClick={() => {
                                setShow2(false);
                              }}
                            />
                          ) : (
                            <EyeNoneIcon
                              className="absolute right-3 top-1/3 cursor-pointer"
                              onClick={() => {
                                setShow2(true);
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

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setAddThirdStep(false);
                    setAddSecondStep(true);
                  }}
                >
                  <Icons.back
                    width="24"
                    height="24"
                    className="flex cursor-pointer items-center justify-center text-gray-500"
                  />
                </Button>
                <Button variant="primary" className="mt-4 w-full">
                  Үргэлжлүүлэх
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}

export default UserPasswordForm;

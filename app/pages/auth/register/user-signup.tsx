import React from "react";

import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { cn } from "../../../../lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../ui/form";

import { transPasswordSchema } from "./form-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { useRegisterStore } from "../../../../lib/store";
import { api } from "../../../../src/utils/api";
import { Icons } from "../../../ui/icons";

function UserFinishForm() {
  const setAddThirdStep = useRegisterStore((state) => state.setAddThirdStep);
  const setAddFinishStep = useRegisterStore((state) => state.setAddFinishStep);

  const setFinishValues = useRegisterStore((state) => state.setFinishValues);

  const registerValues = useRegisterStore((state) => state);

  const mutationSignUpOrg = api.register.signUpOrg.useMutation();
  const router = useRouter();

  const form = useForm<{ transPassword: string; transConfirmPassword: string }>(
    {
      resolver: zodResolver(transPasswordSchema),
      defaultValues: {
        transPassword: "",
        transConfirmPassword: "",
      },
    }
  );

  function onSubmit(formdata: {
    transPassword: string;
    transConfirmPassword: string;
  }) {
    toast.success(
      `${registerValues.phone}. Цаашид та бүртгүүлсэн гар утасны дугаар(${registerValues?.phone}) нэвтрэх болно.`
    );
    setFinishValues();
    router.push("/login");

    // mutationSignUpOrg.mutate(
    //   {
    //     first_name: registerValues.firstName,
    //     last_name: registerValues.lastName,
    //     org_register: registerValues.register,
    //     password: registerValues.password,
    //     phone: registerValues.phone,
    //     pin_code: registerValues.pin_code,
    //     tmp_user_id: registerValues.tmp_user_id,
    //     transaction_password: formdata.transConfirmPassword,
    //     user_type: "org",
    //     username: registerValues.phone,
    //     email: registerValues.email,
    //   },
    //   {
    //     onSuccess: (data) => {
    //       if (data.success) {
    //         toast.success(
    //           `${data.description}. Цаашид та бүртгүүлсэн гар утасны дугаар(${registerValues?.phone}) нэвтрэх болно.`
    //         );
    //         router.push("/login");
    //       } else {
    //         toast.error(data?.description || null);
    //       }
    //     },
    //   }
    // );
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
              <FormField
                control={form.control}
                name="transPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Гүйлгээний FundMe код үүсгэх</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Гүйлгээний FundMe код"
                        type="number"
                        autoCapitalize="none"
                        autoComplete="transPass"
                        autoCorrect="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-1">
                <FormField
                  control={form.control}
                  name="transConfirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Гүйлгээний FundMe код давтан оруулах
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Гүйлгээний FundMe код давтах"
                          type="number"
                          autoCapitalize="none"
                          autoComplete="transPass"
                          autoCorrect="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <p className="text-sm text-mutedForeground">
                Энэхүү кодыг та мэдээлэл өөрчлөх болон хүсэлтээ
                баталгаажуулахдаа хэрэглэнэ.
              </p>

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setAddFinishStep(false);
                    setAddThirdStep(true);
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

export default UserFinishForm;

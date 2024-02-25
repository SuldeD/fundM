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
import { TimeDialog } from "../../../ui/timeDialog";

import { phoneSchema } from "./form-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { api } from "../../../../src/utils/api";
import { useRegisterStore } from "../../../../lib/store";

function UserPhoneForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { mutate } = api.register.phoneSignUp.useMutation();
  const setAddFirstStep = useRegisterStore((state) => state.setAddFirstStep);
  const setAddSecondStep = useRegisterStore((state) => state.setAddSecondStep);
  const setAddThirdStep = useRegisterStore((state) => state.setAddThirdStep);
  const setAddPinCode = useRegisterStore((state) => state.setAddPinCode);

  const setSecondValues = useRegisterStore((state) => state.setSecondValues);
  const registerValues = useRegisterStore((state) => state);
  const orgSignUpVerify = api.register.orgSignUpVerify.useMutation();

  const [timeDialog, setTimeDialog] = useState<boolean>(false);
  const [dataPass, setDataPass] = useState<{
    username: string;
    register: string;
    forgot_id: string;
    new_password: string;
  }>({
    username: "",
    register: "",
    forgot_id: "",
    new_password: "",
  });

  const registerConfirm = (formdata: { pin_code: string }) => {
    // orgSignUpVerify.mutate(
    //   {
    //     phone: registerValues.phone,
    //     pin_code: formdata.pin_code,
    //     tmp_user_id: registerValues.tmp_user_id,
    //     user_type: "org",
    //   },
    //   {
    //     onSuccess: (data: { success: any; description: any }) => {
    //       if (data.success) {
    //         console.log(data, "data");
    //         setAddPinCode(formdata.pin_code);
    //         setAddSecondStep(false);
    //         setAddThirdStep(true);
    //       } else {
    //         toast.error(data?.description || null);
    //         setIsLoading(false);
    //       }
    //     },
    //   }
    // );
    setAddSecondStep(false);
    setAddThirdStep(true);
  };

  const form = useForm<{ phone: string }>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: registerValues.phone,
    },
  });

  function onSubmit(formdata: { phone: string }) {
    setIsLoading(true);

    // mutate(
    //   { phone: formdata.phone },
    //   {
    //     onSuccess: (data) => {
    //       if (data.success) {
    //         toast.success(
    //           `Таны ${formdata.phone} дугаар руу баталгаажуулах код амжилттай илгээгдлээ.`
    //         );
    //         localStorage.setItem("targetDate", `${Date.now() + 300 * 1000}`);
    //         setSecondValues({
    //           phone: formdata.phone,
    //           tmp_user_id: data?.tmp_user_id,
    //         });
    //         setAddSecondStep(false);
    //         setAddThirdStep(true);
    //         setIsLoading(false);
    //       } else {
    //         toast.error(data?.description || null);
    //         setIsLoading(false);
    //       }
    //     },
    //   }
    // );

    toast.success(
      `Таны ${formdata.phone} дугаар руу баталгаажуулах код амжилттай илгээгдлээ.`
    );
    localStorage.setItem("targetDate", `${Date.now() + 300 * 1000}`);
    setSecondValues({
      phone: formdata.phone,
      tmp_user_id: "tmp",
    });
    setTimeDialog(true);

    setIsLoading(false);
  }

  return (
    <div className={cn("grid gap-4")}>
      <motion.div
        animate={{ x: "0", opacity: 1, scale: 1 }}
        initial={{ x: "10%", opacity: 0, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <TimeDialog
          show={timeDialog}
          setShow={setTimeDialog}
          onSubmit={registerConfirm}
          dataPass={dataPass}
          setDataPass={setDataPass}
          type="register"
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-1">
                <FormField
                  control={form.control}
                  name="phone"
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

              <div className="flex items-center gap-4">
                <Button
                  disabled={isLoading}
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setAddFirstStep(true);
                    setAddSecondStep(false);
                  }}
                >
                  <Icons.back
                    width="24"
                    height="24"
                    className="flex cursor-pointer items-center justify-center text-gray-500"
                  />
                </Button>
                <Button
                  disabled={isLoading}
                  variant="primary"
                  className="mt-4 w-full"
                >
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Нэг удаагийн код авах
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </motion.div>
    </div>
  );
}

export default UserPhoneForm;

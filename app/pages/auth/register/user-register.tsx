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
import { useToast } from "../../../ui/use-toast";
import { AlertDialogM } from "../../../ui/alertDialog";
import { Checkbox } from "../../../ui/checkbox";

import { LoginFormDataType, registerSchema } from "./form-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useState } from "react";

import { useRegisterStore } from "../../../../lib/store";

function UserRegister() {
  const [show, setShow] = useState<boolean>(false);
  const [dialogType, setAlertDialogType] = useState<string>("false");

  const { toast } = useToast();

  const setValues = useRegisterStore((state) => state.setAddValues);
  const registerValues = useRegisterStore((state) => state);

  const form = useForm<LoginFormDataType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: registerValues.email,
      lastName: registerValues.lastName,
      firstName: registerValues.firstName,
      register: registerValues.register,
      checked: false,
    },
  });

  function onOkDialog() {
    const { email, lastName, firstName, register } = form.getValues();
    setValues({
      email,
      lastName,
      firstName,
      register,
      firstStep: false,
      secondStep: true,
    });
  }

  function onSubmit(data: LoginFormDataType) {
    if (data.checked) {
      setShow(true);
      setAlertDialogType("error");
    } else {
      setShow(true);
      setAlertDialogType("warning");
    }
  }

  return (
    <div className={cn("grid gap-6")}>
      <AlertDialogM
        setShow={setShow}
        show={show}
        title={dialogType === "error" ? "Анхааруулга" : "Байгууллагын нэр"}
        type={dialogType}
        desc={
          dialogType === "error"
            ? "Уучилаарай Мөнгө угаах, терроризмыг санхүүжүүлэх (МУТС) тухай хуулийн дагуу таныг бүртгэх боломжгүй болно."
            : "Та өөрийн байгууллагын БАНКИН ДЭЭРХ БҮРТГЭЛТЭЙ ДАНСНЫ НЭРЭЭ шалгаад оруулна уу. /Жич: зарим тохиолдолд банкны бүртгэл дээр байгууллагын улсын бүртгэл дээр байгаа ХХК, ҮЦК гэх мэт товчлол байхгүй байдгийг анхаарна уу!!!"
        }
        onOk={onOkDialog}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid gap-1">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Удирдлагын нэр оруулах</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Удирдлагын нэр"
                        type="text"
                        autoCapitalize="none"
                        autoComplete="owner"
                        autoCorrect="off"
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
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Байгууллагын нэр оруулах</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Байгууллагын нэр"
                          className="pr-8"
                          autoCapitalize="none"
                          autoComplete="comp-owner"
                          autoCorrect="off"
                          {...field}
                        />
                        <InfoCircledIcon
                          width={18}
                          height={18}
                          onClick={() => {
                            toast({
                              description:
                                "Та өөрийн байгууллагын БАНКИН ДЭЭРХ БҮРТГЭЛТЭЙ ДАНСНЫ НЭРЭЭ шалгаад оруулна уу. /Жич: зарим тохиолдолд банкны бүртгэл дээр байгууллагын улсын бүртгэл дээр байгаа ХХК, ҮЦК гэх мэт товчлол байхгүй байдгийг анхаарна уу!!!",
                              title: "Байгууллагын нэр",
                            });
                          }}
                          className="absolute right-2 top-1/4 cursor-pointer text-gray-600"
                        />
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
                name="register"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Регистрийн дугаар оруулах</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Регистрийн дугаар"
                        autoCapitalize="none"
                        autoComplete="register"
                        autoCorrect="off"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Имэйл хаяг оруулах</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Имэйл хаяг"
                        type="text"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
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
                name="checked"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          color="primary"
                        />
                        <label htmlFor="terms" className="text-sm font-medium">
                          Та улс төрийн нөлөө бүхий этгээд тэдгээртэй
                          хамараалтай эсэх
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button variant="primary" className="mt-4">
              Үргэлжлүүлэх
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default UserRegister;

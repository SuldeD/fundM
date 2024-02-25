import * as React from "react";
import { Input } from "../../../ui/input";
import { TimeDialog } from "../../../ui/timeDialog";
import { Button } from "../../../ui/button";
import { Icons } from "../../../ui/icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../ui/form";
import { api } from "../../../../src/utils/api";
import { cn } from "../../../../lib/utils";

import { forgotSchema, LoginFormDataType } from "./form-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeNoneIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserForgotForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [timeDialog, setTimeDialog] = React.useState<boolean>(false);
  const [dataPass, setDataPass] = React.useState<{
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

  const [show, setShow] = React.useState<boolean>(false);
  const [show2, setShow2] = React.useState<boolean>(false);

  const mutationForgot = api.profile.forgotPass.useMutation();
  const mutationForgotCon = api.profile.forgotPassConfirm.useMutation();

  const form = useForm<LoginFormDataType>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      username: "",
      register: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(registerdata: LoginFormDataType) {
    setIsLoading(true);

    mutationForgot.mutate(
      {
        phone: registerdata.username,
        username: registerdata.username,
        register: registerdata.register,
      },
      {
        onSuccess: (data: any) => {
          if (data?.success) {
            toast.success(data.description);
            setDataPass({
              username: registerdata.username,
              register: registerdata.register,
              forgot_id: data.forgot_id,
              new_password: registerdata.password,
            });
            localStorage.setItem("targetDate", `${Date.now() + 300 * 1000}`);
            setTimeDialog(true);
            setIsLoading(false);
          } else {
            toast.error(data?.description || null);
            setIsLoading(false);
          }
        },
      }
    );
  }

  const signupConfirm = (data: { pin_code: string }) => {
    mutationForgotCon.mutate(
      {
        pin_code: data.pin_code,
        username: dataPass.username,
        register: dataPass.register,
        forgot_id: dataPass.forgot_id,
        new_password: dataPass.new_password,
      },
      {
        onSuccess: (data: any) => {
          if (data.success) {
            toast.success(data.description);
            router.push("/login");
          } else {
            toast.error(data?.description || null);
          }
        },
      }
    );
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
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
                name="register"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Регистрийн дугаар оруулах</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Регистрийн дугаар"
                        autoCapitalize="none"
                        autoComplete="register"
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
            <div className="grid gap-1">
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Нууц үг давтах</FormLabel>
                    <FormControl>
                      <div className="relative ">
                        <Input
                          placeholder="Нууц үг давтах"
                          type={show2 ? "text" : "password"}
                          className="pr-8"
                          autoCapitalize="none"
                          autoComplete="password"
                          autoCorrect="off"
                          disabled={isLoading}
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

            <TimeDialog
              show={timeDialog}
              setShow={setTimeDialog}
              onSubmit={signupConfirm}
              dataPass={dataPass}
              setDataPass={setDataPass}
              type="forgot"
            />
            <Button
              disabled={isLoading}
              variant="primary"
              type="submit"
              className="mt-4"
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin " />
              )}
              Нэг удаагийн код авах
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

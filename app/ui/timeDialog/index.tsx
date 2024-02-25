import { Statistic } from "antd";
import { useEffect, useRef, useState } from "react";
import { Button } from "../button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../dialog";
import { Icons } from "../icons";
import { api } from "../../../src/utils/api";
import { useRegisterStore } from "../../../lib/store";
import React from "react";

interface DialogType {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: { pin_code: string }) => void;
  type: "register" | "forgot";
  dataPass: {
    username: string;
    register: string;
    forgot_id: string;
    new_password: string;
  };
  setDataPass: React.Dispatch<
    React.SetStateAction<{
      username: string;
      register: string;
      forgot_id: string;
      new_password: string;
    }>
  >;
}

export function TimeDialog({
  show,
  setShow,
  onSubmit,
  dataPass,
  setDataPass,
  type,
}: DialogType) {
  const { Countdown } = Statistic;

  const mutationForgot = api.profile.forgotPass.useMutation();
  const mutationRegister = api.register.phoneSignUp.useMutation();

  const input = useRef<any>([]);
  const length = 4;
  const [code, setCode] = useState<any>([...Array(length)].map(() => ""));
  const [reDate, setReDate] = useState<boolean>(false);
  const [reDateTime, setReDateTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const setSecondValues = useRegisterStore((state) => state.setSecondValues);

  //functions
  const processInput = (e: React.ChangeEvent<HTMLInputElement>, slot: any) => {
    const num = e.target.value;
    if (/[^0-9]/.test(num)) return;
    const newCode = [...code];
    newCode[slot] = num;
    setCode(newCode);
    if (slot !== length - 1) {
      input.current[slot + 1]?.focus();
    }
  };

  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>, slot: any) => {
    if (e.keyCode === 8 && !code[slot] && slot !== 0) {
      const newCode = [...code];
      newCode[slot - 1] = "";
      setCode(newCode);
      input.current[slot - 1] && input.current[slot - 1].focus();
    }
  };

  const reCode = () => {
    if (reDate) {
      if (type === "register") {
        mutationRegister.mutate(
          { phone: dataPass.username },
          {
            onSuccess: (data) => {
              if (data.success) {
                toast.success(
                  `Таны ${data.username} дугаар руу баталгаажуулах код амжилттай илгээгдлээ.`
                );
                localStorage.setItem(
                  "targetDate",
                  `${Date.now() + 300 * 1000}`
                );

                setSecondValues({
                  phone: dataPass.username,
                  tmp_user_id: "tmp",
                });

                setReDate(false);
              } else {
                toast.error(data?.description || null);
              }
            },
          }
        );
      } else {
        mutationForgot.mutate(
          {
            phone: dataPass.username,
            username: dataPass.username,
            register: dataPass.register,
          },
          {
            onSuccess: (data: any) => {
              if (data?.success) {
                toast.success(data.description);
                setReDate(false);
                setDataPass((prevData: any) => ({
                  ...prevData,
                  forgot_id: (data?.forgot_id).toString(),
                }));
                localStorage.setItem(
                  "targetDate",
                  `${Date.now() + 300 * 1000}`
                );
              } else {
                toast.error(data?.description || null);
              }
            },
          }
        );
      }
    }
  };

  useEffect(() => {
    const time = localStorage.getItem("targetDate");
    time && setReDateTime(Number(localStorage.getItem("targetDate")));

    if (!show) {
      setCode([...Array(length)].map(() => ""));
      setReDate(false);
    } else {
      input.current = [];
    }
  }, [show, reDate]);

  return (
    <Dialog open={show} onOpenChange={(e) => setShow(e)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Баталгаажуулах код оруулах</DialogTitle>
          <DialogDescription className="pt-2">
            Бид таны бүртгэлтэй гар утасны дугаарт нэг удаагийн баталгаажуулах
            код илгээлээ.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            {code?.map(
              (
                num: string | number | readonly string[] | undefined,
                idx: React.Key | null | undefined
              ) => {
                return (
                  <input
                    key={idx}
                    type="text"
                    inputMode="numeric"
                    className="rounded-md border border-[#1375ED] p-2 text-center"
                    maxLength={1}
                    value={num}
                    autoFocus={!code[0].length && idx === 0}
                    onChange={(e) => processInput(e, idx)}
                    onKeyUp={(e) => onKeyUp(e, idx)}
                    ref={(ref) => input.current.push(ref)}
                  />
                );
              }
            )}
          </div>
          <div className="color-white">
            <Countdown
              value={reDateTime}
              format="mm:ss"
              onFinish={() => {
                setReDate(true);
              }}
              className="h-2 py-0 text-start dark:text-white"
              valueStyle={{
                fontSize: "18px",
                color: reDate ? "#FF0000" : "currentcolor",
              }}
            />
          </div>
        </div>

        <DialogFooter>
          <div className="flex w-full justify-between gap-4">
            <Button
              variant="outline"
              className="w-full"
              disabled={!reDate}
              onClick={reCode}
            >
              Дахин код авах
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="w-full"
              onClick={() => {
                if (code.join("").length >= 4) {
                  setIsLoading(true);
                  setDataPass((prevData: any) => ({
                    ...prevData,
                    pin_code: code.join(""),
                  }));
                  onSubmit({ pin_code: code.join("") });
                  setTimeout(() => {
                    setIsLoading(false);
                  }, 3000);
                }
              }}
              disabled={reDate || isLoading}
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin " />
              )}
              Баталгаажуулах
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

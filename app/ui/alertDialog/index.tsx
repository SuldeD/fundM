// import { cn } from "lib/utils";
import React from "react";
import { Dispatch, SetStateAction } from "react";
import { cn } from "../../../lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../alert-dialog";
import { Icons } from "../icons";

export function AlertDialogM({
  show,
  setShow,
  title,
  desc,
  onOk,
  type,
}: {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  title: string;
  desc: string;
  onOk: any;
  type: string;
}) {
  return (
    <AlertDialog open={show} onOpenChange={(e) => setShow(e)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex gap-2">
            <div className="mt-[1px]">
              {type === "error" ? (
                <Icons.error width="24" height="24" className="text-red-600" />
              ) : (
                <Icons.info width="24" height="24" className="text-blue-600" />
              )}
            </div>
            <div>
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription
                className={cn("mt-4", type === "error" && "text-red-400")}
              >
                {desc}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-2">
          <AlertDialogCancel>Хаах</AlertDialogCancel>
          {type !== "error" && (
            <AlertDialogAction onClick={onOk}>Үргэлжлүүлэх</AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

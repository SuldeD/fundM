import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "../../app/ui/sheet";
import {
  HamburgerMenuIcon,
  Link2Icon,
  MobileIcon,
  EnvelopeClosedIcon,
} from "@radix-ui/react-icons";
import Logo from "./logo";
import { navigationMenu } from "../contants";
import React from "react";
import { useRouter } from "next/navigation";
import { cn } from "lib/utils";
import { Separator } from "../../app/ui/separator";

export const customStyle =
  "group mb-4 flex h-9 w-full items-center justify-start rounded-md border bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:bg-zinc-100 focus:text-zinc-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-zinc-100/50 data-[state=open]:bg-zinc-100/50 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus:bg-zinc-800 dark:focus:text-zinc-50 dark:data-[active]:bg-zinc-800/50 dark:data-[state=open]:bg-zinc-800/50 gap-2";

function MobileDrawer() {
  const router = useRouter();
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger className="h-9 rounded-md bg-transparent px-3 text-sm font-medium hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-50">
          <HamburgerMenuIcon width={24} height={24} />
        </SheetTrigger>
        <SheetContent className="w-full">
          <SheetHeader>
            <SheetTitle>
              <Logo disabled={true} width={140} />
            </SheetTitle>

            <div className="pt-6">
              {navigationMenu.map((item, key) => {
                return (
                  <SheetClose
                    key={key + item.key}
                    onClick={() => {
                      router.push(item.link);
                    }}
                    className={cn(customStyle)}
                  >
                    <Link2Icon width={18} height={18} />
                    <p>{item.label}</p>
                  </SheetClose>
                );
              })}
            </div>
            <Separator />

            <div className="w-full pb-6 pt-4">
              <SheetClose
                onClick={() => {
                  router.push("/signup");
                }}
                className={cn(customStyle)}
              >
                Бүртгүүлэх
              </SheetClose>

              <SheetClose
                onClick={() => {
                  router.push("/login");
                }}
                className={cn(
                  "focus-visible:ring-ring ring-offset-background inline-flex h-10 w-full items-center justify-start rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-hoverPrimary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                )}
              >
                Нэвтрэх
              </SheetClose>
            </div>

            <Separator />
            <div className="flex w-full justify-between ">
              <div className="flex  items-center gap-2 text-primary dark:text-white">
                <EnvelopeClosedIcon />
                info@fundme.mn
              </div>
              <div className="flex  items-center gap-1 text-primary dark:text-white">
                <MobileIcon />
                +976 72229911
              </div>
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileDrawer;

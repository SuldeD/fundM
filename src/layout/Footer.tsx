import Logo from "../components/logo";
import { Separator } from "../../app/ui/separator";
import { navigationMenu } from "../contants";
import Link from "next/link";
import React from "react";

export const FooterComponent = () => {
  return (
    <div className="px-8 pb-2 ">
      <Separator className="mb-6" />
      <div className="block justify-between md:flex">
        <div className="w-full border-zinc-200 p-4 dark:border-zinc-800 md:w-1/3 md:border-r">
          <Logo disabled={true} />
          <div className="my-6 md:ml-6">
            {navigationMenu.map((item, key) => {
              return (
                <div className="mb-2" key={key}>
                  <Link href={item.link} legacyBehavior passHref>
                    <div className="w-full cursor-pointer font-thin md:w-1/2">
                      - {item.label}
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
        <Separator className="flex md:hidden" />
        <div className="flex w-full border-zinc-200 p-4 dark:border-zinc-800 md:w-1/3 md:justify-center md:border-r">
          <div>
            <p>Холбоо барих</p>
            <div className="mt-4 inline-grid gap-2">
              <div className="text-sm text-mutedForeground">Даваа-Баасан :</div>
              <div className="text-sm text-mutedForeground">
                Өглөө 9:30 - Орой 17:30
              </div>
              <div className="text-sm text-mutedForeground">
                Бямба-Ням : Амарна
              </div>
              <div className="text-sm ">info@fundme.mn</div>
              <div className="text-sm ">72229911</div>
            </div>
          </div>
        </div>
        <Separator className="flex md:hidden" />
        <div className="flex w-full p-4 md:w-1/3 md:justify-center">
          <div>
            <p>Байрлал</p>
            <div className="mt-4 inline-grid gap-1">
              <div className="text-sm text-mutedForeground">
                Улаанбаатар хот, Сүхбаатар дүүрэг,
              </div>
              <div className="text-sm text-mutedForeground">
                8-р хороо Бага тойруу /14200/,
              </div>
              <div className="text-sm text-mutedForeground">
                Б. Алтангэрэлийн гудамж-5,
              </div>
              <div className="text-sm text-mutedForeground">
                Сити центр 7 давхар 701 тоот
              </div>
            </div>
          </div>
        </div>
      </div>
      <Separator className="mt-6" />
      <div className="px-4 py-2">
        <p className="text-sm text-mutedForeground">© 2024 - FundMe birj LLC</p>
        {/* <Muted text="© 2024 - FundMe" /> */}
      </div>
    </div>
  );
};

export default FooterComponent;

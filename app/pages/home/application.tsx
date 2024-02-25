import { Title } from "../../../lib/typography";
import Image from "next/image";
import React from "react";
import { Button } from "../../ui/button";

function Application() {
  return (
    <div className="bg-[#E4E4E4]" id="app">
      <div className="container items-center justify-between lg:flex" id="app">
        <div className="py-12 lg:w-[50%]">
          <Title
            className="text-3xl text-[#1a2155] lg:text-3xl"
            text="FundMe апп тун удахгүй"
          />
          <p className="text-md mt-8 text-gray-400">
            Зээлийн эрхийн хэмжээгээ нэг удаа тогтоолгон богино хугацааны
            санхүүгийн хэрэгцээгээ хурдан шуурхай, шимтгэл бага байдлаар хангах
            боломжтой.
          </p>
          <div className="mt-12 flex gap-4">
            <Button
              variant="ghost"
              disabled
              className="me-1 h-[52px] w-full rounded-[15px] bg-[#000] p-[10px]"
            >
              {/* <a
              className="flex"
              href="https://play.google.com/store/games"
              target="_blank"
            > */}
              <Image
                src="/images/playstore.svg"
                alt="Picture of the detail"
                width={32}
                height={32}
              />
              <div className="ms-4">
                <div className="text-left text-[8px] font-normal leading-[14px] text-[#fff]">
                  Android on app
                </div>
                <div className="text-center font-normal leading-[16px] text-[#fff]">
                  Google Play
                </div>
              </div>
            </Button>

            <Button
              disabled
              className="h-[52px] w-full rounded-[15px] bg-[#000] p-[10px]"
              variant="ghost"
            >
              {/* <a
              className="flex"
              href="https://www.apple.com/app-store/"
              target="_blank"
            > */}
              <Image
                src="/images/appstore.svg"
                alt="Picture of the detail"
                width={32}
                height={32}
              />
              <div className="ms-4">
                <div className="text-left text-[8px] font-normal leading-[14px] text-[#fff]">
                  Download on the
                </div>
                <div className="text-center font-normal leading-[16px] text-[#fff]">
                  App Store
                </div>
              </div>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <Image
            className="flex items-center justify-center pt-12"
            src="/root/application.png"
            alt="Picture of the detail"
            width={500}
            height={500}
          />
        </div>
      </div>
    </div>
  );
}

export default Application;

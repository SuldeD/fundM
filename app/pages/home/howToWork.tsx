import { Title } from "../../../lib/typography";
import Image from "next/image";
import React from "react";

function HowToWork() {
  const workerDiagram = [
    {
      id: "01",
      title: "Бүртгүүлэх",
      image: "/root/loan-reg.svg",
    },
    {
      id: "02",
      title: "Баталгаажуулах",
      image: "/root/loan-ver.svg",
    },
    {
      id: "03",
      title: "Хүсэлт илгээх",
      image: "/root/loan-wait.svg",
    },
    {
      id: "04",
      title: "Гэрээ байгуулах",
      image: "/root/loan-cont.svg",
    },
    {
      id: "05",
      title: "Амжилттай",
      image: "/root/loan-done.svg",
    },
  ];

  return (
    <div className="py-24">
      <Title
        className="text-center text-3xl text-[#1a2155] dark:text-white lg:text-3xl"
        text="FundMe хэрхэн ажилладаг вэ?"
      />

      <div className="mx-auto mt-[75px] justify-center gap-[30px] px-[30px] lg:flex">
        {workerDiagram.map((el, idx) => (
          <div
            key={idx}
            className="relative mb-[20px] h-[280px] w-[100%] min-w-[180px] items-center justify-center rounded-[30px] border  bg-white p-[32px] shadow-sm lg:max-w-[230px]"
          >
            {workerDiagram.length - 1 != idx && (
              <div className="absolute right-[-62.5px] top-1/2 z-10 hidden lg:inline">
                <img width="50%" src="/images/arrow.svg" />
              </div>
            )}
            <div className=" flex justify-center text-[40px] font-bold leading-[48px] text-primary">
              {el.id}
            </div>
            <div className="mb-8 mt-6 text-center text-xl font-medium text-black">
              {el.title}
            </div>
            <Image
              className="mx-auto mt-8 "
              src={el.image}
              alt="Picture of the detail"
              width={50}
              height={62}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default HowToWork;

import Image from "next/image";
import React from "react";

function Detail() {
  const openInto = [
    {
      title: "САНХҮҮЖИЛТ ӨГӨХ",
      money: "2,249,378.75 ₮",
      detail:
        "Богино хугацааны эх үүсвэртээ өгөөж хүртэн, санхүүгийн эрэлт хэрэгцээгээ хангах боломжтой.",
      image: "/root/found.svg",
    },
    {
      title: "ЗЭЭЛ АВАХ",
      money: "272,532,055.00 ₮",
      detail:
        "Зээлийн эрхийн хэмжээгээ нэг удаа тогтоолгон богино хугацааны санхүүгийн хэрэгцээгээ хурдан шуурхай, шимтгэл бага байдлаар хангах боломжтой.",
      image: "/root/loan.svg",
    },
    {
      title: "ЗАРЛАСАН ХҮҮ",
      money: "1.92 %",
      detail:
        "Тухайн өдрийн санхүүжилт өгөх болон зээл олгох зарласан хүү нь эрэлт хэрэгцээн дээр тулгуурлан тогтоодог.",
      image: "/root/rate.svg",
    },
  ];
  return (
    <div>
      <div className="container mx-auto flex-wrap justify-center gap-[30px] py-24 lg:flex">
        {openInto.map((el, idx) => (
          <div
            key={idx}
            className="mb-[20px] min-h-[410px] w-full rounded-[30px] border bg-[#fff] px-[50px] py-[30px] shadow-sm lg:max-w-[374px]"
          >
            <Image
              className="mx-auto"
              src={el.image}
              alt="Picture of the detail"
              width={150}
              height={150}
            />
            <div className="mt-[23px]">
              <div className="pb-[8px] text-center text-[22px] font-bold leading-[27px] text-[#1a2155]">
                {el.title}
              </div>
              <div className="mb-[20px] pb-[15px] text-center text-[30px] font-semibold text-primary">
                {el.money}
              </div>
              <div className="text-center text-sm text-gray-400">
                {el.detail}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Detail;

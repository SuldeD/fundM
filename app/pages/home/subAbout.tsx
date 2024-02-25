import React from "react";
import { Title } from "../../../lib/typography";

function SubAbout() {
  return (
    <div className="bg-black bg-[url('/images/about.png')] bg-cover bg-top bg-no-repeat py-28">
      <div className="container mx-auto items-center gap-24 px-[20px] md:flex">
        <div className="inline-grid w-full gap-12 lg:w-[50%]">
          <Title
            className="text-4xl text-white lg:text-5xl"
            text="Байгууллагуудын богино хугацаат санхүүгийн ухаалаг шийдэл."
          />
        </div>

        <div className="hidden lg:flex">
          <div className="relative me-[14px] flex-row">
            <img src="/images/about-1.png" className="h-[254px] w-[254px]" />
            <img
              src="/images/about-2.webp"
              className="absolute right-0 mt-[11px] h-[185px] w-[185px] rounded-bl-[50px]"
            />
          </div>
          <img src="/images/about-3.png" className="h-[453px] w-[254px]" />
        </div>
      </div>
      <div className="lg: absolute left-0 top-2/4 hidden">
        <img src="/images/vector-6.png" />
      </div>
    </div>
  );
}

export default SubAbout;

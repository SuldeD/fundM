import React from "react";
import { Title } from "../../../lib/typography";

function Finance() {
  return (
    // <div className="bg-black bg-[url('/root/finance-bg.png')] bg-cover">
    <div className="bg-blend-color-darken bg-black bg-[url('/images/about.png')] bg-cover">
      <div className="container top-0 py-24 text-white">
        <Title className="text-4xl lg:text-4xl" text="Санхүүжилт өгөх" />
        <div className="mt-12 text-xl ">
          “Хэрэв та богино хугацаанд бусад төрлийн хөрөнгө оруулалт болон
          хадгаламжийн хүүнээс илүү хүүний өгөөж хүртэхийг эрэлхийлж буй бол та
          бидэнтэй нэгдээрэй.”
        </div>

        <div className="mt-12 text-gray-300">
          <div>Тавигдах шаардлага:</div>
          <div>- Эцсийн өмчлөгчийг үнэн зөв тодорхойлох боломжтой байх;</div>
          <div>
            - Дампуурлын хэрэг болон татан буулгах үйл ажиллагаа эхлүүлээгүй
            байх;
          </div>
          <div>
            - Холбогдох хууль хяналтын байгууллагаар шалгагдаж байгаа болон
            хамтран ажилласнаар цаашид эрсдэл үүсэж болзошгүй нөхцөл байдал
            үүсээгүй байх;
          </div>
          <div>
            - Мөнгө угаах тероризмыг санхүүжүүлэхтэй тэмцэх тухай хуулийн дагуу
            орлогын эх үүсвэр нь тодорхой байх;
          </div>
        </div>
      </div>
    </div>
  );
}

export default Finance;

import styles from "../styles/Home.module.css";
import { RightOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/router";

export const Home = () => {
  const router = useRouter();
  const openInto = [
    {
      title: "САНХҮҮЖИЛТ ӨГӨХ",
      money: "2,249,378.75 ₮",
      detail:
        "Богино хугацааны эх үүсвэртээ өгөөж хүртэн, санхүүгийн эрэлт хэрэгцээгээ хангах боломжтой.",
      image: "/images/write-lg.svg",
    },
    {
      title: "ЗЭЭЛ АВАХ",
      money: "272,532,055.00 ₮",
      detail:
        "Зээлийн эрхийн хэмжээгээ нэг удаа тогтоолгон богино хугацааны санхүүгийн хэрэгцээгээ хурдан шуурхай, шимтгэл бага байдлаар хангах боломжтой.",
      image: "/images/finance-lg.svg",
    },
    {
      title: "ЗАРАЛСАН ХҮҮ",
      money: "1.92 %",
      detail:
        "Тухайн өдрийн санхүүжилт өгөх болон зээл олгох заралсан хүү нь эрэлт хэрэгцээн дээр тулгуурлан тогтоодог.",
      image: "/images/zoos-lg.svg",
    },
  ];

  const workerDiagram = [
    {
      id: "01",
      title: "Бүртгүүлэх",
      image: "/images/register.svg",
    },
    {
      id: "02",
      title: "Баталгаажуулах",
      image: "/images/verification.svg",
    },
    {
      id: "03",
      title: "Хүсэлт илгээх",
      image: "/images/loan.svg",
    },
    {
      id: "04",
      title: "Гэрээ байгуулах",
      image: "/images/generate.svg",
    },
    {
      id: "05",
      title: "Амжилттай",
      image: "/images/repayment.svg",
    },
  ];
  return (
    <div>
      <div className="bg-black bg-[url('/images/about.png')] bg-cover bg-top bg-no-repeat sm:py-[120px]">
        <div className="container mx-auto flex justify-between">
          <div className="w-[50%] md:m-[50px]">
            <div className="text-[2.375rem] font-bold text-white">
              FundMe-тэй хамт бизнесийн илүү их амжилтанд хүрээрэй
            </div>
            <ul className="my-[30px] ms-5 list-disc text-[0.875rem] font-normal leading-9 text-white">
              <li>Монголын тэргүүлэгч апп</li>
              <li>Зээлийн асуудалгүй шийдлүүд</li>
              <li>Танд хамгийн хэрэгтэй үед нь дэмжиж ажиллана</li>
            </ul>
            <Link href="/about-us">
              <button className="flex w-[169px] rounded-[9px] border-[2px] py-3 text-center text-[14px] font-bold leading-[14px] text-white hover:text-primary">
                <span className="ms-7">Дэлгэрэнгүй</span>
                {<RightOutlined className="ms-2 mt-[1px] " />}
              </button>
            </Link>
          </div>

          <div className="hidden md:flex">
            <div className="relative me-[14px] flex-row">
              <img src="/images/about-1.png" className="h-[254px] w-[254px]" />
              <img
                src="/images/about-2.png"
                className="absolute right-0 mt-[11px] h-[185px] w-[185px]"
              />
            </div>
            <img src="/images/about-3.png" className="h-[453px] w-[254px]" />
          </div>
        </div>
        <div className="absolute left-0 top-2/4">
          <img src="/images/vector-6.png" />
        </div>
      </div>

      <div className="container mx-auto flex gap-[30px] py-[100px]">
        {openInto.map((el, idx) => (
          <div
            key={idx}
            className="h-[410px] w-full rounded-[30px] bg-[#fff] px-[60px] py-[30px] shadow-custom"
          >
            <img src={el.image} className="mx-auto" />
            <div className="mt-[23px]">
              <div className="pb-[8px] text-center text-[22px] font-bold leading-[27px] text-[#1a2155]">
                {el.title}
              </div>

              <div className="mb-[20px] pb-[15px] text-center text-[30px] font-semibold text-primary">
                {el.money}
              </div>

              <div className="text-center text-[16px] font-normal leading-[20px] text-detail">
                {el.detail}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="relative">
        <div className="absolute left-0 top-[-180px]">
          <img src="/images/medium-left-vector.png" />
        </div>
        <div className=" bg-black bg-[url('/images/fundNow-bg.png')] bg-cover bg-top bg-no-repeat py-[100px]">
          <div className="container mx-auto flex justify-between">
            <div className="max-w-3xl items-center text-[22px] font-bold leading-[27px] text-[#fff]">
              ТА FUNDME-ЭЭС ХАМГИЙН БАГА ХҮҮТЭЙ 50,000₮ - 100,000,000₮ ЗЭЭЛЭХ
              БОЛОМЖТОЙ.
            </div>
            <button
              onClick={() => router.push("/login")}
              className="h-[44px] w-[220px] rounded-[9px] bg-primary text-[14px] font-bold text-[#fff] hover:bg-sky-900"
            >
              ХАЙХ
            </button>
          </div>
        </div>
        <div className="absolute right-0 top-[100px]">
          <img src="/images/vector-4.png" />
        </div>
      </div>
      <div className="py-[100px] pt-[60px]">
        <div className="text-center text-[22px] font-bold leading-[27px] text-[#1a2155]">
          FUND ME хэрхэн ажилладаг вэ?
        </div>

        <div className="mx-auto mt-[75px] flex gap-[48px] px-[160px]">
          {" "}
          {workerDiagram.map((el, idx) => (
            <div className="relative  h-[300px] w-[100%] rounded-[30px] bg-[#fff] p-[32px] shadow-custom">
              {workerDiagram.length - 1 != idx && (
                <div className="absolute right-[-62.5px] top-1/2 z-10">
                  <img width="100%" src="/images/arrow.svg" />
                </div>
              )}
              <div className=" flex justify-center pb-[10px] text-[40px] font-bold leading-[48px] text-primary">
                {el.id}
              </div>
              <div className="leding-[24px] my-[20px] text-center text-[20px] font-medium text-[#000]">
                {el.title}
              </div>
              <img height={86} src={el.image} className="mx-auto" />
            </div>
          ))}
        </div>
      </div>
      <div className="relative bg-[#E4E4E4]" id="app">
        <div className="container mx-auto p-[78px]">
          <div className="max-w-[430px] p-[20px]">
            <div className="text-[28px] font-bold leading-[34px] text-[#1a2155] ">
              FUND ME Аппликейшиг хэрхэн татаж авах вэ?
            </div>

            <div className="mb-[56px] mt-[36px] text-[14px] font-medium leading-[20px] text-[#000] opacity-[0.5]">
              Uniquely streamline standardized methods of empowerment for
              professional initiatives. Synergistically brand top-line
              opportunities through market-driven platforms. Efficiently.
            </div>
            <button className="me-1 h-[52px] w-[140px] rounded-[15px] bg-[#000] p-[10px]">
              <a
                className="flex"
                href="https://play.google.com/store/games"
                target="_blank"
              >
                <img width={32} src="/images/playstore.svg" />
                <div>
                  <div className="text-left text-[8px] font-normal leading-[14px] text-[#fff]">
                    Android on app
                  </div>
                  <div className="text-center font-normal leading-[16px] text-[#fff]">
                    Google Play
                  </div>
                </div>
              </a>
            </button>

            <button className="h-[52px] w-[140px] rounded-[15px] bg-[#000] p-[10px] ">
              <a
                className="flex"
                href="https://www.apple.com/app-store/"
                target="_blank"
              >
                <img width={32} src="/images/appstore.svg" />
                <div>
                  <div className="text-left text-[8px] font-normal leading-[14px] text-[#fff]">
                    Download on the
                  </div>
                  <div className="text-center font-normal leading-[16px] text-[#fff]">
                    App Store
                  </div>
                </div>
              </a>
            </button>
          </div>

          <div className="absolute right-10 top-0">
            <img width="100%" src="/images/phone.png" />
          </div>

          <div className="absolute left-0">
            <img width="100%" src="/images/vector-5.png" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

import { RightOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Image from "next/image";

export const Home = () => {
  const router = useRouter();
  const { data } = useSession();

  const openInto = [
    {
      title: "САНХҮҮЖИЛТ ӨГӨХ",
      // money: "2,249,378.75 ₮",
      detail:
        "Богино хугацааны эх үүсвэртээ өгөөж хүртэн, санхүүгийн эрэлт хэрэгцээгээ хангах боломжтой.",
      image: "/root/found.svg",
    },
    {
      title: "ЗЭЭЛ АВАХ",
      // money: "272,532,055.00 ₮",
      detail:
        "Зээлийн эрхийн хэмжээгээ нэг удаа тогтоолгон богино хугацааны санхүүгийн хэрэгцээгээ хурдан шуурхай, шимтгэл бага байдлаар хангах боломжтой.",
      image: "/root/loan.svg",
    },
    {
      title: "ЗАРЛАСАН ХҮҮ",
      money: "1.5 %",
      detail:
        "Тухайн өдрийн санхүүжилт өгөх болон зээл олгох зарласан хүү нь эрэлт хэрэгцээн дээр тулгуурлан тогтоодог.",
      image: "/root/rate.svg",
    },
  ];

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

  if (data) {
    return null;
  } else {
    return (
      <div>
        <div className="bg-black bg-[url('/images/about.png')] bg-cover bg-top bg-no-repeat py-[120px]">
          <div className="container mx-auto flex justify-between px-[20px]">
            <div className="flex w-full items-center md:m-[50px] lg:w-[50%]">
              <div className="font-lato  text-[2.375rem] font-bold text-white">
                Байгууллагуудын богино хугацаат санхүүгийн ухаалаг шийдэл.
              </div>
              {/* <ul className="my-[30px] ms-5 list-disc font-lato text-[0.875rem] font-normal leading-9 text-white">
                <li>Монголын тэргүүлэгч апп</li>
                <li>Зээлийн асуудалгүй шийдлүүд</li>
                <li>Танд хамгийн хэрэгтэй үед нь дэмжиж ажиллана</li>
              </ul>
              <Link href="/about-us">
                <button className="flex w-[169px] rounded-[9px] border-[2px] py-3 text-center text-[14px] font-bold leading-[14px] text-white hover:text-primary">
                  <span className="ms-7">Дэлгэрэнгүй</span>
                  {<RightOutlined className="ms-2 mt-[1px] " />}
                </button>
              </Link> */}
            </div>

            <div className="hidden lg:flex">
              <div className="relative me-[14px] flex-row">
                <img
                  src="/images/about-1.png"
                  className="h-[254px] w-[254px]"
                />
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
        <div className="relative">
          <div className=" bg-black bg-[url('/images/fundNow-bg.png')] bg-cover bg-top bg-no-repeat py-[100px]">
            <div className="container mx-auto justify-between px-[20px] md:flex">
              {/* <div className="max-w-3xl items-center text-[22px] font-bold leading-[27px] text-[#fff]">
                ТА FUNDME-ЭЭС ХАМГИЙН БАГА ХҮҮТЭЙ 50,000₮ - 100,000,000₮ ЗЭЭЛЭХ
                БОЛОМЖТОЙ.
              </div>
              <button
                onClick={() => router.push("/login")}
                className="mt-[20px] h-[44px] w-full rounded-[9px] bg-primary text-[14px] font-bold text-[#fff] hover:bg-sky-900 md:w-[220px]"
              >
                ХАЙХ
              </button> */}
            </div>
          </div>
        </div>
        <div className="py-[100px] pt-[60px]">
          <div className="text-center text-[22px] font-bold leading-[27px] text-[#1a2155]">
            FUNDME хэрхэн ажилладаг вэ?
          </div>

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
        {/* <div className="relative bg-[#E4E4E4]" id="app">
          <div className="container mx-auto py-[78px]">
            <div className="w-full p-[20px] lg:w-[430px]">
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
                  <div className="ms-[10px]">
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
                  <div className="ms-[10px]">
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

            <div className="absolute right-10 top-0 hidden lg:flex">
              <img width="100%" src="/images/phone.png" />
            </div>

     
          </div>
        </div> */}
      </div>
    );
  }
};

export default Home;

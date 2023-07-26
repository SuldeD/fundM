"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AboutUS = void 0;
const antd_1 = require("antd");
const Loader_1 = require("app/components/Loader");
const react_1 = require("next-auth/react");
const about_us_module_css_1 = __importDefault(require("../../styles/about-us.module.css"));
const Home_module_css_1 = __importDefault(require("../../styles/Home.module.css"));
const AboutUS = () => {
    const { data } = (0, react_1.useSession)();
    if (data) {
        return <Loader_1.Loaderr />;
    }
    else {
        return (<antd_1.Row className={about_us_module_css_1.default["about-us-background-image"]} justify="center" align={"middle"}>
        <div className={Home_module_css_1.default["filter-image"]}/>
        <antd_1.Col span={20} className={about_us_module_css_1.default["about-us-col-padding"]}>
          <antd_1.Row justify="start" gutter={[0, 54]}>
            <antd_1.Col span={24}>
              <div className={about_us_module_css_1.default["about-us-title-text"]}>Бидний тухай</div>
            </antd_1.Col>
            <antd_1.Col span={24}>
              <div className={about_us_module_css_1.default["about-us-text"]}>
                “ФАНД МИ БИРЖ” ХК нь Монгол улсын зах зээлд анх удаа технологийн
                дэвшлийг санхүүгийн үйлчилгээтэй хамтатгасан Финтек бизнес
                моделийг Fundme аппликейшн болон веб сайтаар дамжуулан амжилттай
                нэвтрүүлж буй цахим мөнгөний биржийн үйлчилгээ үзүүлэгч
                байгууллага юм.
              </div>
            </antd_1.Col>
            <antd_1.Col span={24}>
              <div className={about_us_module_css_1.default["about-us-text"]}>
                Бидны зорилго нь аж ахуй нэгжүүдийн богино хугацаат санхүүгийн
                хэрэгцээ болон илүүдэл мөнгөн хөрөнгийг харилцан ашигтайгаар
                технологийн шийдлийг ашиглан холбоход оршино.
              </div>
            </antd_1.Col>
            <antd_1.Col span={24}>
              <div className={about_us_module_css_1.default["about-us-text"]}>Бидний давуу тал:</div>
              <ul className={`${about_us_module_css_1.default["about-us-paragraph"]} list-disc`}>
                <li>Хэрэглэхэд хялбар</li>
                <li>Хүү бага</li>
                <li>Найдвартай</li>
                <li>Мэдээллийн аюулгүй байдлыг бүрэн хангасан</li>
              </ul>
            </antd_1.Col>
          </antd_1.Row>
        </antd_1.Col>
      </antd_1.Row>
        // <div className="relative bg-[url(/images/about-us.jpg)] brightness-50">
        //   <div className="container px-[50px] py-[120px] text-[#fff]">
        //     <div className="leadning-[48px] mb-[54px] font-inter text-[40px] font-bold">
        //       Бидний тухай
        //     </div>
        //     <div className="font-inter text-[18px] font-normal leading-[32px]">
        //       “ФАНД МИ БИРЖ” ХК нь Монгол улсын зах зээлд анх удаа технологийн
        //       дэвшлийг санхүүгийн үйлчилгээтэй <br />
        //       хамтатгасан Финтек бизнес моделийг Fundme аппликейшн болон веб
        //       сайтаар дамжуулан амжилттай нэвтрүүлж буй цахим биржийн үйлчилгээ
        //       үзүүлэгч байгууллага юм. угацаат санхүүгийн хэрэгцээ болон илүүдэл
        //       мөнгөн хөрөнгийг харилцан ашигтайгаар технологийн шийдлийг ашиглан
        //       холбоход оршино.
        //     </div>
        //     <div className={styles["about-us-text"]}>Бидний давуу тал:</div>
        //     <ul className={`${styles["about-us-paragraph"]} list-disc`}>
        //       <li>Хэрэглэхэд хялбар</li>
        //       <li>Хүү бага</li>
        //       <li>Найдвартай</li>
        //       <li>Мэдээллийн аюулгүй байдлыг бүрэн хангасан</li>
        //     </ul>
        //   </div>
        // </div>
        );
    }
};
exports.AboutUS = AboutUS;
exports.default = exports.AboutUS;

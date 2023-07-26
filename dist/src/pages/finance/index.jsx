"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Finance = void 0;
const antd_1 = require("antd");
const Loader_1 = require("app/components/Loader");
const react_1 = require("next-auth/react");
const finance_module_css_1 = __importDefault(require("../../styles/finance.module.css"));
const Home_module_css_1 = __importDefault(require("../../styles/Home.module.css"));
const Finance = () => {
    const { data } = (0, react_1.useSession)();
    if (data) {
        return <Loader_1.Loaderr />;
    }
    else {
        return (<antd_1.Row className={finance_module_css_1.default["finance-background-image"]} justify="center" align={"middle"}>
        <div className={Home_module_css_1.default["filter-image"]}/>
        <antd_1.Col span={20} className={finance_module_css_1.default["finance-col-padding"]}>
          <antd_1.Row justify="start" gutter={[0, 54]}>
            <antd_1.Col span={24}>
              <div className={finance_module_css_1.default["finance-title-text"]}>
                Санхүүжилт өгөх
              </div>
            </antd_1.Col>
            <antd_1.Col span={24}>
              <div className={finance_module_css_1.default["finance-text"]}>
                “Хэрэв та богино хугацаанд бусад төрлийн хөрөнгө оруулалт болон
                хадгаламжийн хүүнээс илүү хүүний өгөөж хүртэхийг эрэлхийлж буй
                бол та Цахим биржийн санхүүжүүлэгч болсноор энэхүү хүсэлтээ
                биелүүлэх боломжтой болно. Таны хөрөнгө оруулалт эрсдлийн
                сангаар баталгаажсан тул та эргэлзэх хэрэггүй. Харилцагч та
                5,000,000 /таван сая/ - 100,000,000 /нэг зуун сая/ төгрөг
                хүртэлх санхүүжилтыг 7-28 хоногийн сонголттойгоор өгөх боломжтой
                ба таниас ямар нэгэн шимтгэл хураамжийн зардал гарахгүй.
              </div>
            </antd_1.Col>
            <antd_1.Col span={24}>
              <div className={finance_module_css_1.default["finance-text"]}>Тавигдах шаардлага:</div>
              <ul className={`${finance_module_css_1.default["finance-paragraph"]} list-disc`}>
                <li>Эцсийн өмчлөгчийг үнэн зөв тодорхойлох боломжтой байх;</li>
                <li>
                  Дампуурлын хэрэг болон татан буулгах үйл ажиллагаа эхлүүлээгүй
                  байх;
                </li>
                <li>
                  Холбогдох хууль хяналтын байгууллагаар шалгагдаж байгаа болон
                  хамтран ажилласнаар цаашид эрсдэл үүсэж болзошгүй нөхцөл
                  байдал үүсээгүй байх;
                </li>
                <li>
                  Мөнгө угаах тероризмыг санхүүжүүлэхтэй тэмцэх тухай хуулийн
                  дагуу орлогын эх үүсвэр нь тодорхой байх;
                </li>
              </ul>
            </antd_1.Col>
          </antd_1.Row>
        </antd_1.Col>
      </antd_1.Row>);
    }
};
exports.Finance = Finance;
exports.default = exports.Finance;

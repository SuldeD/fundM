"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loan = void 0;
const antd_1 = require("antd");
const loan_module_css_1 = __importDefault(require("../../styles/loan.module.css"));
const Home_module_css_1 = __importDefault(require("../../styles/Home.module.css"));
const react_1 = require("next-auth/react");
const Loader_1 = require("app/components/Loader");
const Loan = () => {
    const { data } = (0, react_1.useSession)();
    if (data) {
        return <Loader_1.Loaderr />;
    }
    else {
        return (<antd_1.Row className={loan_module_css_1.default["loan-background-image"]} justify="center" align={"middle"}>
        <div className={Home_module_css_1.default["filter-image"]}/>
        <antd_1.Col span={20} className={loan_module_css_1.default["loan-col-padding"]}>
          <antd_1.Row justify="start" gutter={[0, 54]}>
            <antd_1.Col span={24}>
              <div className={loan_module_css_1.default["loan-title-text"]}>Зээл авах</div>
            </antd_1.Col>
            <antd_1.Col span={24}>
              <div className={loan_module_css_1.default["loan-text"]}>
                Эрхэм харилцагч та зээлийн судалгаанд хамрагдаж, өөрийн
                санхүүгийн чадамжинд тохирох зээлийн эрхийг нэг жилийн
                хугацаатайгаар гэрээ байгуулж баталгаажуулснаар зээл авах
                боломжтой болно.
              </div>
            </antd_1.Col>
            <antd_1.Col span={24}>
              <div className={loan_module_css_1.default["loan-text"]}>Бүрдүүлэх материал:</div>
              <ul className={`${loan_module_css_1.default["loan-paragraph"]} list-disc`}>
                <li>ААН гэрчилгээ дүрэм</li>
                <li>Гүйцэтгэх захиралын иргэний үнэмлэх</li>
                <li>Сүүлийн 1 жилийн дансны хуулга</li>
                <li>Сүүлийн 2 жилийн санхүүгийн тайлан</li>
                <li>
                  Бизнесийн үйл ажиллагаатай холбоотой гэрээ хэлцэл, тусгай
                  зөвшөөрөл, түрээсийн гэрээ
                </li>
                <li>Барьцаа хөрөнгийг гэрчлэх баримт</li>
                <li>Зээл хүссэн албан тоот</li>
              </ul>
            </antd_1.Col>
          </antd_1.Row>
        </antd_1.Col>
      </antd_1.Row>);
    }
};
exports.Loan = Loan;
exports.default = exports.Loan;

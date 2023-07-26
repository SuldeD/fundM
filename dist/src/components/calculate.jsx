"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculateComponent = void 0;
const antd_1 = require("antd");
const calculate_module_css_1 = __importDefault(require("../styles/calculate.module.css"));
const number_helpers_1 = require("../utils/number.helpers");
const react_1 = require("react");
const CalculateComponent = () => {
    const [inputValue, setInputValue] = (0, react_1.useState)();
    const onChange = (
    /** @type {import("react").SetStateAction<undefined>} */ value) => {
        setInputValue(value);
    };
    const handleChange = (/** @type {any} */ value) => {
        console.log(`selected ${value}`);
    };
    const items = [
        {
            key: "1",
            label: "Өгөх",
            children: (<antd_1.Col span={24}>
          <antd_1.Row justify="center" align="middle" gutter={[0, 14]}>
            <antd_1.Col span={24}>
              <antd_1.InputNumber defaultValue={1} value={inputValue} 
            // @ts-ignore
            onChange={onChange} formatter={(value) => (0, number_helpers_1.numberToCurrency)(value)} className={calculate_module_css_1.default["calculate-inputNumber-div"]}/>
            </antd_1.Col>
            <antd_1.Col span={24}>
              <div className={calculate_module_css_1.default["calculate-tabs-content-title"]}>
                Санхүүжилт өгөх мөнгөн дүнгээ оруулна уу.
              </div>
            </antd_1.Col>
            <antd_1.Col span={24}>
              <antd_1.Row gutter={16}>
                <antd_1.Col span={12}>
                  <antd_1.Select defaultValue="7" style={{
                    width: "100%",
                }} onChange={handleChange} options={[
                    {
                        value: "7",
                        label: "7 хоног",
                    },
                    {
                        value: "14",
                        label: "14 хоног",
                    },
                    {
                        value: "21",
                        label: "21 хоног",
                    },
                    {
                        value: "28",
                        label: "28 хоног",
                    },
                ]}/>
                </antd_1.Col>
                <antd_1.Col span={12}>
                  <antd_1.Select style={{ width: "100%" }} defaultValue="1" onChange={handleChange} options={[
                    {
                        value: "1",
                        label: "1.0 %",
                    },
                    {
                        value: "2",
                        label: "2.4 %",
                    },
                ]}/>
                </antd_1.Col>
              </antd_1.Row>
            </antd_1.Col>
            <antd_1.Col span={24}>
              <div className={calculate_module_css_1.default["calculate-tabs-content-title"]}>
                Ерөнхий мэдээлэл
              </div>
            </antd_1.Col>
            <antd_1.Col span={24}>
              <antd_1.Row justify="center" className={calculate_module_css_1.default["calculate-tabs-content-general-div"]} gutter={[0, 10]}>
                <antd_1.Col span={24}>
                  <antd_1.Row justify="space-between" align="middle">
                    <antd_1.Col flex="none">
                      <div className={calculate_module_css_1.default["calculate-tabs-content-general-title"]}>
                        Үндсэн зээлийн төлбөр:
                      </div>
                    </antd_1.Col>
                    <antd_1.Col flex="none">
                      <div className={calculate_module_css_1.default["calculate-tabs-information-number"]}>
                        {(0, number_helpers_1.numberToCurrency)(inputValue)}
                      </div>
                    </antd_1.Col>
                  </antd_1.Row>
                </antd_1.Col>
                <antd_1.Col span={24}>
                  <antd_1.Row justify="space-between" align="middle">
                    <antd_1.Col flex="none">
                      <div className={calculate_module_css_1.default["calculate-tabs-content-general-title"]}>
                        Хугацаа:
                      </div>
                    </antd_1.Col>
                    <antd_1.Col flex="none">
                      <div className={calculate_module_css_1.default["calculate-tabs-information-number"]}>
                        14 хоног
                      </div>
                    </antd_1.Col>
                  </antd_1.Row>
                </antd_1.Col>
                <antd_1.Col span={24}>
                  <antd_1.Row justify="space-between" align="middle">
                    <antd_1.Col flex="none">
                      <div className={calculate_module_css_1.default["calculate-tabs-content-general-title"]}>
                        Шимтгэл:
                      </div>
                    </antd_1.Col>
                    <antd_1.Col flex="none">
                      <div className={calculate_module_css_1.default["calculate-tabs-information-number"]}>
                        {(0, number_helpers_1.numberToCurrency)(816000)}
                      </div>
                    </antd_1.Col>
                  </antd_1.Row>
                </antd_1.Col>
                <antd_1.Col span={24}>
                  <antd_1.Row justify="space-between" align="middle">
                    <antd_1.Col flex="none">
                      <div className={calculate_module_css_1.default["calculate-tabs-content-general-title"]}>
                        Бодогдох хүү:
                      </div>
                    </antd_1.Col>
                    <antd_1.Col flex="none">
                      <div className={calculate_module_css_1.default["calculate-tabs-information-rate"]}>
                        {(0, number_helpers_1.numberToCurrency)(1169000)}
                      </div>
                    </antd_1.Col>
                  </antd_1.Row>
                </antd_1.Col>
              </antd_1.Row>
            </antd_1.Col>
            <antd_1.Col span={24}>
              <antd_1.Row justify="center" wrap={false} gutter={10} align="middle">
                <antd_1.Col flex="none">
                  <antd_1.Image width={20} src={"/images/calculate-info.svg"} preview={false} alt="Information"/>
                </antd_1.Col>
                <antd_1.Col span={20}>
                  <div className={calculate_module_css_1.default["calculate-tabs-information-text"]}>
                    Харилцагч та зээлийн авах эрхийн хэмжээгээ өөрт ойр салбарт
                    хандан нээлгэнэ үү.
                  </div>
                </antd_1.Col>
              </antd_1.Row>
            </antd_1.Col>
            <antd_1.Col span={24}>
              <antd_1.Button type="primary" className={calculate_module_css_1.default["calculate-tabs-button"]}>
                <antd_1.Row justify="center" align="middle" gutter={10}>
                  <antd_1.Col flex="none">
                    <antd_1.Image width="100%" src={"/images/carbon_calculator-check.svg"} preview={false} alt="Information"/>
                  </antd_1.Col>
                  <antd_1.Col flex="none">
                    <div className={calculate_module_css_1.default["calculate-tabs-button-text"]}>
                      Тооцох
                    </div>
                  </antd_1.Col>
                </antd_1.Row>
              </antd_1.Button>
            </antd_1.Col>
          </antd_1.Row>
        </antd_1.Col>),
        },
        {
            key: "2",
            label: "Авах",
            children: (<antd_1.Col span={24}>
          <antd_1.Row justify="center" align="middle" gutter={[0, 14]}>
            <antd_1.Col span={24}>
              <antd_1.InputNumber defaultValue={1} value={inputValue} 
            // @ts-ignore
            onChange={onChange} formatter={(value) => (0, number_helpers_1.numberToCurrency)(value)} className={calculate_module_css_1.default["calculate-inputNumber-div"]}/>
            </antd_1.Col>
            <antd_1.Col span={24}>
              <div className={calculate_module_css_1.default["calculate-tabs-content-title"]}>
                Санхүүжилт өгөх мөнгөн дүнгээ оруулна уу.
              </div>
            </antd_1.Col>
            <antd_1.Col span={24}>
              <antd_1.Row gutter={16}>
                <antd_1.Col span={12}>
                  <antd_1.Select defaultValue="7" style={{
                    width: "100%",
                }} onChange={handleChange} options={[
                    {
                        value: "7",
                        label: "7 хоног",
                    },
                    {
                        value: "14",
                        label: "7 хоног",
                    },
                    {
                        value: "30",
                        label: "30 хоног",
                    },
                ]}/>
                </antd_1.Col>
                <antd_1.Col span={12}>
                  <antd_1.Select style={{ width: "100%" }} defaultValue="1" onChange={handleChange} options={[
                    {
                        value: "1",
                        label: "1.5 %",
                    },
                    {
                        value: "2",
                        label: "2.5 %",
                    },
                ]}/>
                </antd_1.Col>
              </antd_1.Row>
            </antd_1.Col>
            <antd_1.Col span={24}>
              <div className={calculate_module_css_1.default["calculate-tabs-content-title"]}>
                Ерөнхий мэдээлэл
              </div>
            </antd_1.Col>
            <antd_1.Col span={24}>
              <antd_1.Row justify="center" className={calculate_module_css_1.default["calculate-tabs-content-general-div"]} gutter={[0, 10]}>
                <antd_1.Col span={24}>
                  <antd_1.Row justify="space-between" align="middle">
                    <antd_1.Col flex="none">
                      <div className={calculate_module_css_1.default["calculate-tabs-content-general-title"]}>
                        Үндсэн зээлийн төлбөр:
                      </div>
                    </antd_1.Col>
                    <antd_1.Col flex="none">
                      <div className={calculate_module_css_1.default["calculate-tabs-information-number"]}>
                        {(0, number_helpers_1.numberToCurrency)(inputValue)}
                      </div>
                    </antd_1.Col>
                  </antd_1.Row>
                </antd_1.Col>
                <antd_1.Col span={24}>
                  <antd_1.Row justify="space-between" align="middle">
                    <antd_1.Col flex="none">
                      <div className={calculate_module_css_1.default["calculate-tabs-content-general-title"]}>
                        Хугацаа:
                      </div>
                    </antd_1.Col>
                    <antd_1.Col flex="none">
                      <div className={calculate_module_css_1.default["calculate-tabs-information-number"]}>
                        14 хоног
                      </div>
                    </antd_1.Col>
                  </antd_1.Row>
                </antd_1.Col>
                <antd_1.Col span={24}>
                  <antd_1.Row justify="space-between" align="middle">
                    <antd_1.Col flex="none">
                      <div className={calculate_module_css_1.default["calculate-tabs-content-general-title"]}>
                        Шимтгэл:
                      </div>
                    </antd_1.Col>
                    <antd_1.Col flex="none">
                      <div className={calculate_module_css_1.default["calculate-tabs-information-number"]}>
                        {(0, number_helpers_1.numberToCurrency)(816000)}
                      </div>
                    </antd_1.Col>
                  </antd_1.Row>
                </antd_1.Col>
                <antd_1.Col span={24}>
                  <antd_1.Row justify="space-between" align="middle">
                    <antd_1.Col flex="none">
                      <div className={calculate_module_css_1.default["calculate-tabs-content-general-title"]}>
                        Бодогдох хүү:
                      </div>
                    </antd_1.Col>
                    <antd_1.Col flex="none">
                      <div className={calculate_module_css_1.default["calculate-tabs-information-rate"]}>
                        {(0, number_helpers_1.numberToCurrency)(1169000)}
                      </div>
                    </antd_1.Col>
                  </antd_1.Row>
                </antd_1.Col>
              </antd_1.Row>
            </antd_1.Col>
            <antd_1.Col span={24}>
              <antd_1.Row justify="center" wrap={false} gutter={10} align="middle">
                <antd_1.Col flex="none">
                  <antd_1.Image width={20} src={"/images/calculate-info.svg"} preview={false} alt="Information"/>
                </antd_1.Col>
                <antd_1.Col span={20}>
                  <div className={calculate_module_css_1.default["calculate-tabs-information-text"]}>
                    Харилцагч та зээлийн авах эрхийн хэмжээгээ өөрт ойр салбарт
                    хандан нээлгэнэ үү.
                  </div>
                </antd_1.Col>
              </antd_1.Row>
            </antd_1.Col>
            <antd_1.Col span={24}>
              <antd_1.Button type="primary" className={calculate_module_css_1.default["calculate-tabs-button"]}>
                <antd_1.Row justify="center" align="middle" gutter={10}>
                  <antd_1.Col flex="none">
                    <antd_1.Image width="100%" src={"/images/carbon_calculator-check.svg"} preview={false} alt="Information"/>
                  </antd_1.Col>
                  <antd_1.Col flex="none">
                    <div className={calculate_module_css_1.default["calculate-tabs-button-text"]}>
                      Тооцох
                    </div>
                  </antd_1.Col>
                </antd_1.Row>
              </antd_1.Button>
            </antd_1.Col>
          </antd_1.Row>
        </antd_1.Col>),
        },
    ];
    return (<antd_1.Row gutter={[0, 25]} justify="center">
      <antd_1.Col flex="none">
        <div className={calculate_module_css_1.default["calculate-title"]}>Тооцоолуур</div>
        <div className={calculate_module_css_1.default["calculate-subtitle"]}>
          Тус тооцоолуур нь тухайн өдрийн биржийн зарлагдсан хүү нь дээр
          үндэслэн тооцогдохыг анхаарна уу!!!
        </div>
      </antd_1.Col>
      <antd_1.Col span={24}>
        <antd_1.Tabs defaultActiveKey="1" items={items} tabBarGutter={0}/>
      </antd_1.Col>
    </antd_1.Row>);
};
exports.CalculateComponent = CalculateComponent;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FooterComponent = void 0;
const antd_1 = require("antd");
const { Footer } = antd_1.Layout;
const Footer_module_css_1 = __importDefault(require("../styles/Footer.module.css"));
const link_1 = __importDefault(require("next/link"));
const FooterComponent = () => {
    return (<Footer className={Footer_module_css_1.default["footer-style"]}>
      <antd_1.Row justify="center" id="contact">
        <antd_1.Col span={18} className={Footer_module_css_1.default["padding-div"]}>
          <antd_1.Row justify="space-between" gutter={[0, 55]}>
            <antd_1.Col span={24}>
              <antd_1.Image width={180} src={"/logo.svg"} preview={false} alt="Logo"/>
            </antd_1.Col>
            <antd_1.Row gutter={[0, 24]}>
              <antd_1.Col span={24}>
                <div className={Footer_module_css_1.default["title-text"]}>FundMe</div>
                <ul className={`${Footer_module_css_1.default["paragraph-text"]} list-disc`}>
                  <link_1.default href="/about-us">
                    <li>Бидний тухай</li>
                  </link_1.default>
                  <link_1.default href="/finance">
                    <li>Санхүүжилт өгөх</li>
                  </link_1.default>
                  <link_1.default href="/loan">
                    <li>Зээл авах</li>
                  </link_1.default>
                  <link_1.default href="/#app">
                    <li>АПП татах</li>
                  </link_1.default>
                </ul>
              </antd_1.Col>
            </antd_1.Row>
            <antd_1.Row gutter={[0, 24]}>
              <antd_1.Col span={24}>
                <div className={Footer_module_css_1.default["title-text"]}>Холбоо барих</div>
                <div className={Footer_module_css_1.default["footer-text"]}>info@fundme.mn</div>
                <div className={Footer_module_css_1.default["footer-text"]}>72229911</div>
                <div className={Footer_module_css_1.default["footer-text"]}>Даваа-Баасан :</div>
                <div className={Footer_module_css_1.default["footer-text"]}>
                  Өглөө 9:00 - Орой 18:00
                </div>
                <div className={Footer_module_css_1.default["footer-text"]}>Бямба-Ням : Амарна</div>
              </antd_1.Col>
            </antd_1.Row>
            <antd_1.Row gutter={[0, 24]}>
              <antd_1.Col>
                <div className={Footer_module_css_1.default["title-text"]}>Байрлал</div>
                <div className={Footer_module_css_1.default["footer-text"]}>
                  Улаанбаатар хот, Хан-Уул дүүрэг,
                </div>
                <div className={Footer_module_css_1.default["footer-text"]}>
                  17-р хороо Их монгол улсын
                </div>
                <div className={Footer_module_css_1.default["footer-text"]}>
                  гудамж 301 байр 112 тоот
                </div>
                <antd_1.Image width={232} src="/images/footer-map.jpg" preview={false} style={{ paddingTop: 14 }} alt="Mongolian Location"/>
              </antd_1.Col>
            </antd_1.Row>
          </antd_1.Row>
        </antd_1.Col>

        <antd_1.Col span={24}>
          <antd_1.Row justify="center" align="middle" className={Footer_module_css_1.default["footer-copyright"]}>
            Bichil Globus © 2023 by Infinity Solutions
          </antd_1.Row>
        </antd_1.Col>
      </antd_1.Row>
    </Footer>);
};
exports.FooterComponent = FooterComponent;
exports.default = exports.FooterComponent;

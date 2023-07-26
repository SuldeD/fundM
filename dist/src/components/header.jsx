"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderDashboard = void 0;
const antd_1 = require("antd");
const dashboard_header_module_css_1 = __importDefault(require("../styles/dashboard-header.module.css"));
// @ts-ignore
const HeaderDashboard = ({ title, subTitle }) => {
    const { Countdown } = antd_1.Statistic;
    const deadline = Date.now() + 1000 * 2000;
    return (<antd_1.Col span={24}>
      <antd_1.Row justify="space-between" align="middle">
        <antd_1.Col xs={24} lg={12}>
          <div className={dashboard_header_module_css_1.default["header-title-name"]}>{title}</div>
        </antd_1.Col>
        <antd_1.Col xs={0} lg={12}>
          <antd_1.Row gutter={10} justify="end" align="middle">
            <antd_1.Col flex="none">
              <div className={dashboard_header_module_css_1.default["header-exchange-title"]}>
                Бирж хаагдах хугацаа:
              </div>
            </antd_1.Col>
            <antd_1.Col flex="none">
              <Countdown value={deadline} format="HH:mm:ss" valueStyle={{
            fontFamily: "Raleway",
            fontWeight: 500,
            fontSize: 22,
            color: "#FF0000",
            fontStyle: "normal",
        }}/>
            </antd_1.Col>
          </antd_1.Row>
        </antd_1.Col>
      </antd_1.Row>
      <antd_1.Col xs={24} sm={24} lg={18} xl={14} style={{ paddingTop: 10 }}>
        <div className={dashboard_header_module_css_1.default["header-subtitle"]}>{subTitle}</div>
      </antd_1.Col>
    </antd_1.Col>);
};
exports.HeaderDashboard = HeaderDashboard;

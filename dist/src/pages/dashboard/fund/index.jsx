"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FundHistory = void 0;
const antd_1 = require("antd");
const fund_module_css_1 = __importDefault(require("../../../styles/fund.module.css"));
const number_helpers_1 = require("../../../utils/number.helpers");
const header_1 = require("../../../components/header");
const auth_1 = require("app/utils/auth");
const Loader_1 = require("app/components/Loader");
const dashboardApiContext_1 = require("app/context/dashboardApiContext");
const FundHistory = () => {
    const { data } = (0, dashboardApiContext_1.useApiContext)();
    (0, auth_1.useRequireAuth)();
    // @ts-ignore
    const { Countdown } = antd_1.Statistic;
    // @ts-ignore
    const deadline = Date.now() + 1000 * 10 * 24 * 2 + 1000 * 30;
    const totalFundMoney = 345200000;
    const totalLoanMoney = 100000000;
    const columns = [
        {
            title: "№",
            dataIndex: "id",
            key: "id",
            width: "6%",
            // @ts-ignore
            render: (id) => (<div className={fund_module_css_1.default["fund-tabs-content-table-number"]}>{id}</div>),
        },
        {
            title: "Зээлийн хэмжээ",
            dataIndex: "loanTotal",
            key: "loanTotal",
            align: "center",
            width: "23%",
            // @ts-ignore
            render: (loanTotal) => (<div className={fund_module_css_1.default["fund-tabs-content-table-number"]}>
          {(0, number_helpers_1.numberToCurrency)(loanTotal)}
        </div>),
        },
        {
            title: "Төрөл",
            dataIndex: "type",
            key: "type",
            align: "center",
            width: "23%",
            // @ts-ignore
            render: (type) => type === "Өгсөн санхүүжилт" ? (<div className={fund_module_css_1.default["fund-tabs-1-content-table-type-text"]}>
            {type}
          </div>) : (<div className={fund_module_css_1.default["fund-tabs-2-content-table-type-text"]}>
            {type}
          </div>),
        },
        {
            title: "Хүү",
            dataIndex: "rate",
            key: "rate",
            align: "center",
            width: "15%",
            // @ts-ignore
            render: (rate) => (<div className={fund_module_css_1.default["fund-tabs-content-table-number"]}>{rate}</div>),
        },
        {
            title: "Санхүүжилт өгсөн өдөр",
            dataIndex: "day",
            key: "day",
            align: "center",
            width: "23%",
            // @ts-ignore
            render: (day) => (<div className={fund_module_css_1.default["fund-tabs-content-table-number"]}>{day}</div>),
        },
        {
            title: " ",
            dataIndex: "icon",
            key: "icon",
            width: "10%",
            align: "center",
            // @ts-ignore
            render: (icon) => (<antd_1.Image width={25} src={"/images/info-icon.png"} preview={false} alt="Information"/>),
        },
    ];
    const dataTable = [
        {
            id: 1,
            loanTotal: 100000000,
            type: "Өгсөн санхүүжилт",
            rate: "2.5 %",
            day: "12/07/23",
            icon: "asd",
        },
        {
            id: 2,
            loanTotal: 15000000,
            type: "Өгсөн санхүүжилт",
            rate: "2.5 %",
            day: "12/07/23",
            icon: "asd",
        },
        {
            id: 3,
            loanTotal: 4500000,
            type: "Өгсөн санхүүжилт",
            rate: "2.5 %",
            day: "12/07/23",
            icon: "asd",
        },
        {
            id: 4,
            loanTotal: 1000000,
            type: "Өгсөн санхүүжилт",
            rate: "2.5 %",
            day: "12/07/23",
            icon: "asd",
        },
        {
            id: 5,
            loanTotal: 300000000,
            type: "Өгсөн санхүүжилт",
            rate: "2.5 %",
            day: "12/07/23",
            icon: "asd",
        },
        {
            id: 6,
            loanTotal: 200000000,
            type: "Өгсөн санхүүжилт",
            rate: "2.5 %",
            day: "12/07/23",
            icon: "asd",
        },
        {
            id: 7,
            loanTotal: 150000000,
            type: "Өгсөн санхүүжилт",
            rate: "2.5 %",
            day: "12/07/23",
            icon: "asd",
        },
        {
            id: 8,
            loanTotal: 120000000,
            type: "Өгсөн санхүүжилт",
            rate: "2.5 %",
            day: "12/07/23",
            icon: "asd",
        },
    ];
    const data1 = [
        {
            id: 1,
            loanTotal: 100000000,
            type: "Авсан зээл",
            rate: "2.5 %",
            day: "12/07/23",
            icon: "asd",
        },
        {
            id: 2,
            loanTotal: 15000000,
            type: "Авсан зээл",
            rate: "2.5 %",
            day: "12/07/23",
            icon: "asd",
        },
        {
            id: 3,
            loanTotal: 4500000,
            type: "Авсан зээл",
            rate: "2.5 %",
            day: "12/07/23",
            icon: "asd",
        },
        {
            id: 4,
            loanTotal: 1000000,
            type: "Авсан зээл",
            rate: "2.5 %",
            day: "12/07/23",
            icon: "asd",
        },
        {
            id: 5,
            loanTotal: 300000000,
            type: "Авсан зээл",
            rate: "2.5 %",
            day: "12/07/23",
            icon: "asd",
        },
        {
            id: 6,
            loanTotal: 200000000,
            type: "Авсан зээл",
            rate: "2.5 %",
            day: "12/07/23",
            icon: "asd",
        },
        {
            id: 7,
            loanTotal: 150000000,
            type: "Авсан зээл",
            rate: "2.5 %",
            day: "12/07/23",
            icon: "asd",
        },
        {
            id: 8,
            loanTotal: 120000000,
            type: "Авсан зээл",
            rate: "2.5 %",
            day: "12/07/23",
            icon: "asd",
        },
    ];
    const items = [
        {
            key: "1",
            label: "Өгсөн санхүүжилт",
            children: (<antd_1.Row gutter={[0, 30]} justify="center">
          <antd_1.Col span={24}>
            <antd_1.Row justify="space-between" className={fund_module_css_1.default["fund-tabs-content-border"]}>
              <antd_1.Col flex="none">
                <div className={fund_module_css_1.default["fund-tabs-content-title"]}>
                  Нийт зээлийн хэмжээ
                </div>
                <div className={fund_module_css_1.default["fund-tabs-1-content-money"]}>
                  {(0, number_helpers_1.numberToCurrency)(totalFundMoney)}
                </div>
              </antd_1.Col>
              <antd_1.Col flex="none">
                <div className={fund_module_css_1.default["fund-tabs-content-title"]}>
                  Дундаж хүү
                </div>
                <div className={fund_module_css_1.default["fund-tabs-content-rate"]}>1.53 %</div>
              </antd_1.Col>
              <antd_1.Col flex="none">
                <div className={fund_module_css_1.default["fund-tabs-content-title"]}>
                  Санхүүжилтын тоо
                </div>
                <div className={fund_module_css_1.default["fund-tabs-content-rate"]}>8</div>
              </antd_1.Col>
            </antd_1.Row>
          </antd_1.Col>
          <antd_1.Col span={24}>
            <antd_1.Table scroll={{ x: 430 }} 
            // @ts-ignore
            columns={columns} pagination={{
                    pageSize: 10,
                    position: ["bottomCenter"],
                }} dataSource={dataTable} rowKey={"id"}/>
          </antd_1.Col>
        </antd_1.Row>),
        },
        {
            key: "2",
            label: "Авсан зээл",
            children: (<antd_1.Row gutter={[0, 30]} justify="center">
          <antd_1.Col span={24}>
            <antd_1.Row justify="space-between" className={fund_module_css_1.default["fund-tabs-content-border"]}>
              <antd_1.Col flex="none">
                <div className={fund_module_css_1.default["fund-tabs-content-title"]}>
                  Нийт зээлийн хэмжээ
                </div>
                <div className={fund_module_css_1.default["fund-tabs-2-content-money"]}>
                  {(0, number_helpers_1.numberToCurrency)(totalLoanMoney)}
                </div>
              </antd_1.Col>
              <antd_1.Col flex="none">
                <div className={fund_module_css_1.default["fund-tabs-content-title"]}>
                  Дундаж хүү
                </div>
                <div className={fund_module_css_1.default["fund-tabs-content-rate"]}>1.83 %</div>
              </antd_1.Col>
              <antd_1.Col flex="none">
                <div className={fund_module_css_1.default["fund-tabs-content-title"]}>
                  Зээлийн тоо
                </div>
                <div className={fund_module_css_1.default["fund-tabs-content-rate"]}>8</div>
              </antd_1.Col>
            </antd_1.Row>
          </antd_1.Col>
          <antd_1.Col span={24}>
            <antd_1.Table scroll={{ x: 430 }} 
            // @ts-ignore
            columns={columns} pagination={{
                    pageSize: 10,
                    position: ["bottomCenter"],
                }} dataSource={data1} rowKey={"id"}/>
          </antd_1.Col>
        </antd_1.Row>),
        },
    ];
    if (!data) {
        return <Loader_1.Loaderr />;
    }
    else {
        return (<antd_1.Row justify="center" className={fund_module_css_1.default["fund-main-row"]}>
        <antd_1.Col span={22}>
          <antd_1.Row gutter={[0, 20]}>
            <header_1.HeaderDashboard title={"Миний санхүүжилт"} subTitle={" Харилцагч та нийт идэвхитэй хүсэлтүүд болон өөрийн өгсөн санхүүжилт болон авсан зээлтэй холбоотой мэдээллээ доорх цэсээр харна уу."}/>

            <antd_1.Col span={24}>
              <antd_1.Tabs defaultActiveKey="1" items={items} tabBarGutter={0}/>
            </antd_1.Col>
          </antd_1.Row>
        </antd_1.Col>
      </antd_1.Row>);
    }
};
exports.FundHistory = FundHistory;
exports.default = exports.FundHistory;

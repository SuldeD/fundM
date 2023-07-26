"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.List = void 0;
const antd_1 = require("antd");
const myfund_list_module_css_1 = __importDefault(require("../../../../styles/myfund-list.module.css"));
const number_helpers_1 = require("../../../../utils/number.helpers");
const header_1 = require("../../../../components/header");
const appContext_1 = require("../../../../context/appContext");
const router_1 = require("next/router");
const auth_1 = require("app/utils/auth");
const dashboardApiContext_1 = require("app/context/dashboardApiContext");
const List = () => {
    const router = (0, router_1.useRouter)();
    (0, auth_1.useRequireAuth)();
    const { myFundTabKey } = (0, appContext_1.useAppContext)();
    const { myLoanOrders, mySavingOrders } = (0, dashboardApiContext_1.useApiContext)();
    const columns = [
        {
            title: "Дараалал",
            dataIndex: "id",
            key: "id",
            align: "center",
            width: "6%",
            // @ts-ignore
            render: (id) => (<div className={myfund_list_module_css_1.default["myfund-tabs-content-table-id"]}>{id}</div>),
        },
        {
            title: "Зээлийн хэмжээ",
            dataIndex: "loanTotal",
            key: "loanTotal",
            align: "center",
            width: "23%",
            // @ts-ignore
            render: (loanTotal) => (<div className={myfund_list_module_css_1.default["myfund-tabs-content-table-number"]}>
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
            render: (type) => type === "Өгөх хүсэлт" ? (<div className={myfund_list_module_css_1.default["myfund-tabs-2-content-table-type-text"]}>
            {type}
          </div>) : (<div className={myfund_list_module_css_1.default["myfund-tabs-1-content-table-type-text"]}>
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
            render: (rate) => (<div className={myfund_list_module_css_1.default["myfund-tabs-content-table-number"]}>{rate}</div>),
        },
        {
            title: "Биелэлт",
            dataIndex: "completion",
            key: "completion",
            align: "center",
            width: "23%",
            // @ts-ignore
            render: (completion) => (<div className={myfund_list_module_css_1.default["myfund-tabs-content-table-number"]}>
          {completion}
        </div>),
        },
        {
            title: " ",
            dataIndex: "icon",
            key: "icon",
            width: "10%",
            align: "center",
            render: () => (<antd_1.Image width={25} src={"/images/info-icon.png"} preview={false} alt="Information"/>),
        },
    ];
    const dataFoundataionAll = [
        {
            id: 1,
            loanTotal: 100000000,
            type: "Санхүүжилт өгөх",
            rate: "2.5 %",
            completion: "80 %",
            icon: " ",
            take: true,
        },
        {
            id: 2,
            loanTotal: 100000000,
            type: "Санхүүжилт өгөх",
            rate: "2.5 %",
            completion: "0 %",
            icon: " ",
        },
        {
            id: 3,
            loanTotal: 50000000,
            type: "Санхүүжилт өгөх",
            rate: "2.5 %",
            completion: "0 %",
            icon: " ",
            take: true,
        },
        {
            id: 4,
            loanTotal: 100000000,
            type: "Санхүүжилт өгөх",
            rate: "2.5 %",
            completion: "0 %",
            icon: " ",
        },
        {
            id: 5,
            loanTotal: 100000000,
            type: "Санхүүжилт өгөх",
            rate: "2.5 %",
            completion: "0 %",
            icon: " ",
        },
        {
            id: 6,
            loanTotal: 100000000,
            type: "Санхүүжилт өгөх",
            rate: "2.5 %",
            completion: "0 %",
            icon: " ",
        },
        {
            id: 7,
            loanTotal: 100000000,
            type: "Санхүүжилт өгөх",
            rate: "2.5 %",
            completion: "0 %",
            icon: " ",
        },
        {
            id: 8,
            loanTotal: 100000000,
            type: "Санхүүжилт өгөх",
            rate: "2.5 %",
            completion: "0 %",
            icon: " ",
        },
        {
            id: 9,
            loanTotal: 100000000,
            type: "Санхүүжилт өгөх",
            rate: "2.5 %",
            completion: "0 %",
            icon: " ",
        },
        {
            id: 10,
            loanTotal: 100000000,
            type: "Санхүүжилт өгөх",
            rate: "2.5 %",
            completion: "0 %",
            icon: " ",
        },
        {
            id: 11,
            loanTotal: 100000000,
            type: "Санхүүжилт өгөх",
            rate: "2.5 %",
            completion: "0 %",
            icon: " ",
        },
    ];
    const dataLoanAll = [
        {
            id: 1,
            loanTotal: 100000000,
            type: "Зээлийн хүсэлт",
            rate: "2.5 %",
            completion: "80 %",
            icon: " ",
        },
        {
            id: 2,
            loanTotal: 100000000,
            type: "Зээлийн хүсэлт",
            rate: "2.5 %",
            completion: "0 %",
            icon: " ",
        },
        {
            id: 3,
            loanTotal: 50000000,
            type: "Зээлийн хүсэлт",
            rate: "2.5 %",
            completion: "0 %",
            icon: " ",
        },
        {
            id: 4,
            loanTotal: 100000000,
            type: "Зээлийн хүсэлт",
            rate: "2.5 %",
            completion: "0 %",
            icon: " ",
        },
        {
            id: 5,
            loanTotal: 100000000,
            type: "Зээлийн хүсэлт",
            rate: "2.5 %",
            completion: "0 %",
            icon: " ",
        },
        {
            id: 6,
            loanTotal: 100000000,
            type: "Зээлийн хүсэлт",
            rate: "2.5 %",
            completion: "0 %",
            icon: " ",
        },
        {
            id: 7,
            loanTotal: 100000000,
            type: "Зээлийн хүсэлт",
            rate: "2.5 %",
            completion: "0 %",
            icon: " ",
        },
        {
            id: 8,
            loanTotal: 100000000,
            type: "Зээлийн хүсэлт",
            rate: "2.5 %",
            completion: "0 %",
            icon: " ",
        },
        {
            id: 9,
            loanTotal: 100000000,
            type: "Зээлийн хүсэлт",
            rate: "2.5 %",
            completion: "0 %",
            icon: " ",
        },
        {
            id: 10,
            loanTotal: 100000000,
            type: "Зээлийн хүсэлт",
            rate: "2.5 %",
            completion: "0 %",
            icon: " ",
        },
        {
            id: 11,
            loanTotal: 100000000,
            type: "Зээлийн хүсэлт",
            rate: "2.5 %",
            completion: "0 %",
            icon: " ",
        },
    ];
    return (<antd_1.Row justify="center" className={myfund_list_module_css_1.default["myfund-main-row"]} gutter={[0, 30]}>
      <antd_1.Col span={22}>
        <antd_1.Row gutter={[0, 20]} className={myfund_list_module_css_1.default[myFundTabKey === "2" ? "myfund-list" : ""]}>
          <header_1.HeaderDashboard title={"Зээл авах хүсэлтүүд"} subTitle={"Харилцагч та нийт идэвхитэй хүсэлтүүд болон өөрийн өгсөн санхүүжилт болон авсан зээлтэй холбоотой мэдээллээ доорх цэсээр харна уу."}/>
          <antd_1.Col span={24}>
            <antd_1.Table scroll={{ x: 430 }} 
    // @ts-ignore
    columns={columns} pagination={false} dataSource={dataLoanAll} rowKey={"id"}/>
          </antd_1.Col>
        </antd_1.Row>
        <antd_1.Row gutter={[0, 20]} className={myfund_list_module_css_1.default[myFundTabKey === "1" ? "myfund-list" : ""]}>
          <header_1.HeaderDashboard title={"Санхүүжилт өгөх хүсэлтүүд"} subTitle={"Харилцагч та нийт идэвхитэй хүсэлтүүд болон өөрийн өгсөн санхүүжилт болон авсан зээлтэй холбоотой мэдээллээ доорх цэсээр харна уу."}/>
          <antd_1.Col span={24}>
            <antd_1.Table scroll={{ x: 430 }} 
    // @ts-ignore
    columns={columns} pagination={false} dataSource={dataFoundataionAll} rowKey={"id"}/>
          </antd_1.Col>
        </antd_1.Row>
      </antd_1.Col>
      <antd_1.Col span={22}>
        <antd_1.Row style={{ height: "100%" }} align="bottom">
          <antd_1.Col flex="auto">
            <antd_1.Button className={myfund_list_module_css_1.default["myfund-list-back-button"]} onClick={() => router.back()}>
              Буцах
            </antd_1.Button>
          </antd_1.Col>
        </antd_1.Row>
      </antd_1.Col>
    </antd_1.Row>);
};
exports.List = List;
exports.default = exports.List;

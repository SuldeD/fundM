"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyFund = void 0;
const antd_1 = require("antd");
const my_fund_module_css_1 = __importDefault(require("../../../styles/my-fund.module.css"));
const number_helpers_1 = require("../../../utils/number.helpers");
const header_1 = require("../../../components/header");
const appContext_1 = require("../../../context/appContext");
const auth_1 = require("app/utils/auth");
const dashboardApiContext_1 = require("app/context/dashboardApiContext");
const MyFund = () => {
    var _a;
    const { myFundTabKey, setMyFundTabKey } = (0, appContext_1.useAppContext)();
    const { myLoanOrders, mySavingOrders, sumMyLoan, sumMySaving } = (0, dashboardApiContext_1.useApiContext)();
    (0, auth_1.useRequireAuth)();
    const columns = [
        {
            title: "Дараалал",
            dataIndex: "CheckMbAccount",
            key: "CheckMbAccount",
            align: "center",
            width: "6%",
            // @ts-ignore
            render: (id) => (<div className={my_fund_module_css_1.default["myfund-tabs-content-table-id"]}>{id}</div>),
        },
        {
            title: "Зээлийн хэмжээ",
            dataIndex: "loan_amount",
            key: "loan_amount",
            align: "center",
            width: "23%",
            // @ts-ignore
            render: (loanTotal) => (<div className={my_fund_module_css_1.default["myfund-tabs-content-table-number"]}>
          {(0, number_helpers_1.numberToCurrency)(loanTotal)}
        </div>),
        },
        {
            title: "Төрөл",
            dataIndex: "product_type_code",
            key: "product_type_code",
            align: "center",
            width: "23%",
            // @ts-ignore
            render: (product_type_code) => product_type_code === "saving" ? (<div className={my_fund_module_css_1.default["myfund-tabs-2-content-table-type-text"]}>
            {product_type_code}
          </div>) : (<div className={my_fund_module_css_1.default["myfund-tabs-1-content-table-type-text"]}>
            {product_type_code}
          </div>),
        },
        {
            title: "Хүү",
            dataIndex: "loan_rate_month",
            key: "loan_rate_month",
            align: "center",
            width: "15%",
            // @ts-ignore
            render: (rate) => (<div className={my_fund_module_css_1.default["myfund-tabs-content-table-number"]}>{rate}</div>),
        },
        {
            title: "Биелэлт",
            dataIndex: "completion",
            key: "completion",
            align: "center",
            width: "23%",
            // @ts-ignore
            render: (completion) => (<div className={my_fund_module_css_1.default["myfund-tabs-content-table-number"]}>
          {completion}
        </div>),
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
    const data = [
        {
            id: 5,
            loanTotal: 100000000,
            type: "Зээлийн хүсэлт",
            rate: "1.5 %",
            completion: "0 %",
            icon: " ",
        },
    ];
    const items = [
        {
            key: "1",
            label: "Зээл авах хүсэлт",
            children: (<antd_1.Col span={24}>
          <antd_1.Row gutter={[0, 30]} justify="space-between" className={my_fund_module_css_1.default["myfund-tabs-content-border"]}>
            <antd_1.Col flex="none">
              <div className={my_fund_module_css_1.default["myfund-tabs-content-title"]}>
                Оруулсан хүсэлтийн хэмжээ
              </div>
              <div className={my_fund_module_css_1.default["myfund-tabs-1-content-money"]}>
                {(0, number_helpers_1.numberToCurrency)(sumMyLoan)}
              </div>
            </antd_1.Col>
            <antd_1.Col flex="none">
              <div className={my_fund_module_css_1.default["myfund-tabs-content-title"]}>
                Биржийн хүү
              </div>
              <div className={my_fund_module_css_1.default["myfund-tabs-content-rate"]}>
                {(_a = myLoanOrders[0]) === null || _a === void 0 ? void 0 : _a.loan_rate_month} %
              </div>
            </antd_1.Col>
            <antd_1.Col flex="none">
              <div className={my_fund_module_css_1.default["myfund-tabs-content-title"]}>Биелэлт</div>
              <div className={my_fund_module_css_1.default["myfund-tabs-content-rate"]}>80 %</div>
            </antd_1.Col>
            <antd_1.Col flex="none">
              <div className={my_fund_module_css_1.default["myfund-tabs-content-title"]}>
                Биелээгүй мөнгөн дүн
              </div>
              <div className={my_fund_module_css_1.default["myfund-tabs-content-rate"]}>
                {(0, number_helpers_1.numberToCurrency)(0)}
              </div>
            </antd_1.Col>
            <antd_1.Col span={24}>
              <antd_1.Table scroll={{ x: 430 }} 
            // @ts-ignore
            columns={columns} pagination={{
                    pageSize: 10,
                    position: ["bottomCenter"],
                }} dataSource={myLoanOrders} rowKey={"CheckMbAccount"}/>
            </antd_1.Col>
          </antd_1.Row>
        </antd_1.Col>),
        },
        {
            key: "2",
            label: "Санхүүжилт өгөх хүсэлт",
            children: (<antd_1.Row gutter={[0, 30]} justify="center">
          <antd_1.Col span={24}>
            <antd_1.Row justify="space-between" gutter={[0, 30]} className={my_fund_module_css_1.default["myfund-tabs-content-border"]}>
              <antd_1.Col flex="none">
                <div className={my_fund_module_css_1.default["myfund-tabs-content-title"]}>
                  Оруулсан хүсэлтийн хэмжээ
                </div>
                <div className={my_fund_module_css_1.default["myfund-tabs-2-content-money"]}>
                  {(0, number_helpers_1.numberToCurrency)(sumMySaving)}
                </div>
              </antd_1.Col>
              <antd_1.Col flex="none">
                <div className={my_fund_module_css_1.default["myfund-tabs-content-title"]}>
                  Биржийн хүү
                </div>
                <div className={my_fund_module_css_1.default["myfund-tabs-content-rate"]}>1.50 %</div>
              </antd_1.Col>
              <antd_1.Col flex="none">
                <div className={my_fund_module_css_1.default["myfund-tabs-content-title"]}>
                  Нийт биелэлт
                </div>
                <div className={my_fund_module_css_1.default["myfund-tabs-content-rate"]}>40 %</div>
              </antd_1.Col>
              <antd_1.Col flex="none">
                <div className={my_fund_module_css_1.default["myfund-tabs-content-title"]}>
                  Биелээгүй мөнгөн дүн
                </div>
                <div className={my_fund_module_css_1.default["myfund-tabs-content-rate"]}>
                  {(0, number_helpers_1.numberToCurrency)(120000000)}
                </div>
              </antd_1.Col>
              <antd_1.Col span={24}>
                <antd_1.Table scroll={{ x: 430 }} 
            // @ts-ignore
            columns={columns} pagination={{
                    pageSize: 10,
                    position: ["bottomCenter"],
                }} dataSource={mySavingOrders} rowKey={"CheckMbAccount"}/>
              </antd_1.Col>
            </antd_1.Row>
          </antd_1.Col>
        </antd_1.Row>),
        },
    ];
    return (<antd_1.Row justify="center" className={my_fund_module_css_1.default["myfund-main-row"]}>
      <antd_1.Col span={22}>
        <antd_1.Row gutter={[0, 20]}>
          <header_1.HeaderDashboard title={"Миний хүсэлтүүд"} subTitle={"Харилцагч та нийт идэвхитэй хүсэлтүүд болон өөрийн өгсөн санхүүжилт болон авсан зээлтэй холбоотой мэдээллээ доорх цэсээр харна уу."}/>

          <antd_1.Col span={24}>
            <antd_1.Tabs activeKey={myFundTabKey} onChange={(key) => setMyFundTabKey(key)} items={items} tabBarGutter={0}/>
          </antd_1.Col>
        </antd_1.Row>
      </antd_1.Col>
    </antd_1.Row>);
};
exports.MyFund = MyFund;
exports.default = exports.MyFund;

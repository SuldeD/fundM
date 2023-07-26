"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dashboard = void 0;
const antd_1 = require("antd");
const dashboard_module_css_1 = __importDefault(require("../../styles/dashboard.module.css"));
const icons_1 = require("@ant-design/icons");
const header_1 = require("../../components/header");
const number_helpers_1 = require("../../utils/number.helpers");
const router_1 = require("next/router");
const Loader_1 = require("app/components/Loader");
const dashboardApiContext_1 = require("app/context/dashboardApiContext");
const auth_1 = require("app/utils/auth");
const Dashboard = () => {
    const router = (0, router_1.useRouter)();
    (0, auth_1.useRequireAuth)();
    const { loan, orders, data, sumLoan, sumSaving } = (0, dashboardApiContext_1.useApiContext)();
    const columns = [
        {
            title: "Зээлийн хэмжээ",
            dataIndex: "loan_amount",
            key: "loan_amount",
            width: "20%",
            render: (price) => (<div className={dashboard_module_css_1.default["dashboard-list-item-text"]}>
          {(0, number_helpers_1.numberToCurrency)(price)}
        </div>),
        },
        {
            title: "Төрөл",
            dataIndex: "product_type_code",
            key: "type",
            align: "center",
            width: "20%",
            // @ts-ignore
            render: (type) => type == "saving" ? (<div className={dashboard_module_css_1.default["dashboard-list-item-type-2"]}>
            Өгөх хүсэлт
          </div>) : (<div className={dashboard_module_css_1.default["dashboard-list-item-type-1"]}>
            Авах хүсэлт
          </div>),
        },
        {
            title: "Хүү",
            dataIndex: "loan_rate_month",
            key: "rate",
            width: "20%",
            align: "center",
            // @ts-ignore
            render: (rate) => (<div className={dashboard_module_css_1.default["dashboard-list-item-text"]}>{rate} %</div>),
        },
        {
            title: "Хугацаа",
            dataIndex: "loan_day",
            key: "day",
            width: "20%",
            align: "center",
            // @ts-ignore
            render: (day) => (<div className={dashboard_module_css_1.default["dashboard-list-item-text"]}>{day} хоног</div>),
        },
        {
            title: "Огноо",
            dataIndex: "create_date",
            align: "right",
            key: "date",
            width: "20%",
            // @ts-ignore
            render: (date) => (<div className={dashboard_module_css_1.default["dashboard-list-item-text"]}>
          {date.slice(0, 10)}
        </div>),
        },
    ];
    if (!data) {
        router.push("/");
        return <Loader_1.Loaderr />;
    }
    else {
        return (<antd_1.Row justify="center" className={dashboard_module_css_1.default["dashboard-main-row"]}>
        <antd_1.Col span={22}>
          <antd_1.Row justify="center" align="middle" gutter={[0, 30]}>
            <header_1.HeaderDashboard title={"Цахим бирж"} subTitle={undefined}/>
            <antd_1.Col span={24}>
              <antd_1.Row justify="space-between" gutter={20}>
                <antd_1.Col xs={24} lg={12}>
                  <antd_1.Row className={dashboard_module_css_1.default["dashboard-loan-intro-div"]} gutter={[0, 10]}>
                    <antd_1.Col span={24}>
                      <div className={dashboard_module_css_1.default["dashboard-loan-intro-title"]}>
                        Зээл өгөх хүсэлт
                      </div>
                    </antd_1.Col>
                    <antd_1.Col span={24}>
                      <div className={dashboard_module_css_1.default["dashboard-loan-price-title-text"]}>
                        Нийт хэмжээ
                      </div>
                    </antd_1.Col>
                    <antd_1.Col span={24}>
                      <div className={dashboard_module_css_1.default["dashboard-loan-price-text"]}>
                        {(0, number_helpers_1.numberToCurrency)(sumLoan
                ? sumLoan > sumSaving
                    ? sumLoan
                    : sumSaving
                : 0)}
                      </div>
                    </antd_1.Col>
                    <antd_1.Col span={24}>
                      <antd_1.Button className={`${dashboard_module_css_1.default["dashboard-loan-finance-button"]} bg-primary`} type="primary" onClick={() => router.push("/dashboard/loan/")}>
                        Зээл авах
                      </antd_1.Button>
                    </antd_1.Col>
                  </antd_1.Row>
                </antd_1.Col>
                <antd_1.Col xs={24} lg={12}>
                  <antd_1.Row className={dashboard_module_css_1.default["dashboard-loan-intro-div"]}>
                    <antd_1.Col span={10}>
                      <antd_1.Row gutter={[0, 42]}>
                        <antd_1.Col span={24}>
                          <div className={dashboard_module_css_1.default["dashboard-loan-intro-title"]}>
                            Зарласан хүү
                          </div>
                        </antd_1.Col>
                        <antd_1.Col span={24}>
                          <div className={dashboard_module_css_1.default["dashboard-loan-son-number"]}>
                            {loan && (loan === null || loan === void 0 ? void 0 : loan.loan_rate_month.slice(0, 4))}
                          </div>
                        </antd_1.Col>
                      </antd_1.Row>
                    </antd_1.Col>
                    <antd_1.Col span={14}>
                      <antd_1.Image height="100%" src={"./images/loan-image.svg"} preview={false} alt="teller"/>
                    </antd_1.Col>
                  </antd_1.Row>
                </antd_1.Col>
              </antd_1.Row>
            </antd_1.Col>
            <antd_1.Col span={24} className={dashboard_module_css_1.default["dashboard-bg-image"]}>
              <antd_1.Row justify="end" align="bottom" style={{ height: "100%" }}>
                <antd_1.Button className={`${dashboard_module_css_1.default["dashboard-bg-image-button"]} bg-primary`} type="primary">
                  Дэлгэрэнгүй {<icons_1.RightOutlined />}
                </antd_1.Button>
              </antd_1.Row>
            </antd_1.Col>
            <antd_1.Col span={24}>
              <antd_1.Row gutter={[0, 20]} justify="start">
                <antd_1.Col flex="none">
                  <div className={dashboard_module_css_1.default["dashboard-complete-order-title"]}>
                    Биелсэн захиалгууд
                  </div>
                </antd_1.Col>
                <antd_1.Col span={24}>
                  <antd_1.Row>
                    <antd_1.Col span={24}>
                      <antd_1.Table scroll={{ x: 430 }} 
        // @ts-ignore
        columns={columns} pagination={{
                pageSize: 10,
                position: ["bottomCenter"],
            }} dataSource={orders} rowKey={"CheckMbAccount"}/>
                    </antd_1.Col>
                  </antd_1.Row>
                </antd_1.Col>
              </antd_1.Row>
            </antd_1.Col>
          </antd_1.Row>
        </antd_1.Col>
      </antd_1.Row>);
    }
};
exports.Dashboard = Dashboard;
exports.default = exports.Dashboard;

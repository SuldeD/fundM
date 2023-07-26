"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanTakeReqComponent = void 0;
const antd_1 = require("antd");
const loan_take_req_module_css_1 = __importDefault(require("../styles/loan-take-req.module.css"));
const number_helpers_1 = require("../utils/number.helpers");
const clsx_1 = __importDefault(require("clsx"));
const router_1 = require("next/router");
const react_1 = require("react");
const dashboardApiContext_1 = require("app/context/dashboardApiContext");
const LoanTakeReqComponent = () => {
    const router = (0, router_1.useRouter)();
    const { publicLoanOrders: data } = (0, dashboardApiContext_1.useApiContext)();
    return (<antd_1.Row gutter={[0, 25]} justify="center">
      <antd_1.Col span={24}>
        <div className={loan_take_req_module_css_1.default["loanReq-title"]}>Зээл авах хүсэлт</div>
      </antd_1.Col>
      <antd_1.Col span={24}>
        <div className={loan_take_req_module_css_1.default["loanReq-description"]}>
          Та манай платиниум болон диамонд харилцагч болсоноор давуу эрхтэйгээр
          зээл авах боломжтой. Дэлгэрэнгүйг тусламж цэсний харилцагчийн
          үйлчилгээний хэсгээс харна уу.
        </div>
      </antd_1.Col>
      <antd_1.Col span={24}>
        {data &&
            data.map((
            // @ts-ignore
            el, 
            // @ts-ignore
            indx) => (<react_1.Fragment key={`id-${indx}`}>
                {indx === 0 ? (<antd_1.Row align="middle" justify="end" className={(0, clsx_1.default)({
                        // @ts-ignore
                        [loan_take_req_module_css_1.default["loanReq-row-div"]]: true,
                        // @ts-ignore
                        [loan_take_req_module_css_1.default["loanReq-row-div-end"]]: data.length - 1 === indx,
                    })}>
                    <antd_1.Col span={22}>
                      <antd_1.Row align="middle">
                        <antd_1.Col span={5}>
                          <div className={loan_take_req_module_css_1.default["loanReq-list-number"]}>
                            {el.is_my_request == "1" ? (<div className={loan_take_req_module_css_1.default["loanReq-start"]}>
                                <antd_1.Image width={23} src="/images/star.svg" preview={false}/>
                              </div>) : (indx + 1)}
                          </div>
                        </antd_1.Col>
                        <antd_1.Col span={19}>
                          <antd_1.Row justify="center" align="middle" gutter={[0, 10]}>
                            <antd_1.Col span={12}>
                              <antd_1.Row justify="center">
                                <antd_1.Col span={24}>
                                  <div className={loan_take_req_module_css_1.default["loanReq-list-title"]}>
                                    Зээлийн хэмжээ
                                  </div>
                                </antd_1.Col>
                                <antd_1.Col span={24}>
                                  <div className={loan_take_req_module_css_1.default["loanReq-list-currency-1"]}>
                                    {(0, number_helpers_1.numberToCurrency)(el.loan_amount)}
                                  </div>
                                </antd_1.Col>
                              </antd_1.Row>
                            </antd_1.Col>
                            <antd_1.Col span={12}>
                              <div className={loan_take_req_module_css_1.default["loanReq-list-percent-title"]}>
                                Биелэлт
                              </div>

                              <div className={loan_take_req_module_css_1.default["loanReq-list-percent"]}>
                                {el.percent} %
                              </div>
                            </antd_1.Col>
                            <antd_1.Col span={24}>
                              <antd_1.Row justify="space-between" align="middle">
                                <antd_1.Col flex="none">
                                  <div className={loan_take_req_module_css_1.default["loanReq-list-rate-title-1"]}>
                                    Хүү
                                  </div>
                                  <div className={loan_take_req_module_css_1.default["loanReq-list-currency-1"]}>
                                    {el.loan_rate_month}
                                  </div>
                                </antd_1.Col>
                                <antd_1.Col flex="none">
                                  <antd_1.Button type="primary" className={`${loan_take_req_module_css_1.default["loanReq-list-button"]} bg-primary`} onClick={() => router.push("/dashboard/loan")}>
                                    Санхүүжилт өгөх
                                  </antd_1.Button>
                                </antd_1.Col>
                              </antd_1.Row>
                            </antd_1.Col>
                          </antd_1.Row>
                        </antd_1.Col>
                      </antd_1.Row>
                    </antd_1.Col>
                  </antd_1.Row>) : (<antd_1.Row align="middle" justify="end" className={(0, clsx_1.default)({
                        // @ts-ignore
                        [loan_take_req_module_css_1.default["loanReq-row-div"]]: true,
                        // @ts-ignore
                        [loan_take_req_module_css_1.default["loanReq-row-div-end"]]: data.length - 1 === indx,
                    })}>
                    <antd_1.Col span={22}>
                      <antd_1.Row align="middle">
                        <antd_1.Col span={5}>
                          <div className={loan_take_req_module_css_1.default["loanReq-list-number"]}>
                            {el.is_my_request == "1" ? (<div className={loan_take_req_module_css_1.default["loanReq-start"]}>
                                <antd_1.Image width={23} src="/images/star.svg" preview={false}/>
                              </div>) : (indx + 1)}
                          </div>
                        </antd_1.Col>
                        <antd_1.Col span={19}>
                          <antd_1.Row justify="center" align="middle">
                            <antd_1.Col span={12}>
                              <antd_1.Row justify="center">
                                <antd_1.Col span={24}>
                                  <div className={loan_take_req_module_css_1.default["loanReq-list-title"]}>
                                    Зээлийн хэмжээ
                                  </div>
                                </antd_1.Col>
                                <antd_1.Col span={24}>
                                  <div className={loan_take_req_module_css_1.default["loanReq-list-currency-1"]}>
                                    {(0, number_helpers_1.numberToCurrency)(el.loan_amount)}
                                  </div>
                                </antd_1.Col>
                              </antd_1.Row>
                            </antd_1.Col>
                            <antd_1.Col span={12}>
                              <antd_1.Row justify="center">
                                <antd_1.Col span={24}>
                                  <div className={loan_take_req_module_css_1.default["loanReq-list-rate-title-2"]}>
                                    Хүү
                                  </div>
                                </antd_1.Col>
                                <antd_1.Col span={24}>
                                  <div className={loan_take_req_module_css_1.default["loanReq-list-currency-2"]}>
                                    {el.loan_rate_month}
                                  </div>
                                </antd_1.Col>
                              </antd_1.Row>
                            </antd_1.Col>
                          </antd_1.Row>
                        </antd_1.Col>
                      </antd_1.Row>
                    </antd_1.Col>
                  </antd_1.Row>)}
              </react_1.Fragment>))}
      </antd_1.Col>
      <antd_1.Col span={24}>
        <antd_1.Button type="primary" className={loan_take_req_module_css_1.default["loanReq-button"]} onClick={() => router.push("/dashboard/myfund/list")}>
          Бүгдийг харах
        </antd_1.Button>
      </antd_1.Col>
    </antd_1.Row>);
};
exports.LoanTakeReqComponent = LoanTakeReqComponent;

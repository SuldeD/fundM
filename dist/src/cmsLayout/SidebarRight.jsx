"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SidebarRightComponent = void 0;
const antd_1 = require("antd");
const react_1 = __importDefault(require("react"));
const protectedLayout_module_css_1 = __importDefault(require("../styles/protectedLayout.module.css"));
const calculate_1 = require("../components/calculate");
const loanRequest_1 = require("../components/loanRequest");
const link_1 = __importDefault(require("next/link"));
const router_1 = require("next/router");
const loanTakeRequest_1 = require("../components/loanTakeRequest");
const foundationReq_1 = require("../components/foundationReq");
const dashboardApiContext_1 = require("app/context/dashboardApiContext");
const { Sider } = antd_1.Layout;
// @ts-ignore
const SidebarRightComponent = () => {
    var _a, _b;
    const { accountInfo: data } = (0, dashboardApiContext_1.useApiContext)();
    const router = (0, router_1.useRouter)();
    const myFundTabKey = "1";
    const NavBars = {
        "/dashboard/profile": calculate_1.CalculateComponent,
        "/dashboard": foundationReq_1.FoundationReq,
        "/dashboard/loan": loanRequest_1.LoanReqComponent,
        "/dashboard/foundation": loanTakeRequest_1.LoanTakeReqComponent,
        "/dashboard/myfund": myFundTabKey === "1" ? loanTakeRequest_1.LoanTakeReqComponent : foundationReq_1.FoundationReq,
    };
    const renderNavbar = (/** @type {string} */ pathname) => {
        var _a;
        // @ts-ignore
        const Comp = (_a = NavBars[pathname]) !== null && _a !== void 0 ? _a : NavBars["/dashboard/profile"];
        return <Comp />;
    };
    return (<Sider style={{
            background: "#FFF",
            borderInlineStart: "1px solid #D9D9D9",
            height: "100vh",
        }} width="27%" breakpoint="lg" collapsedWidth="0">
      <antd_1.Row justify="center" className={protectedLayout_module_css_1.default["sidebar-right-main"]}>
        <antd_1.Col span={20}>
          <antd_1.Row justify="center" gutter={[0, 30]}>
            <antd_1.Col span={24}>
              <antd_1.Row justify="space-between">
                <antd_1.Col span={18}>
                  <link_1.default href={"/dashboard/profile"}>
                    <antd_1.Row align="middle" gutter={10} className={protectedLayout_module_css_1.default["sidebar-right-profile-div"]}>
                      <antd_1.Col flex="none">
                        <antd_1.Avatar size={32} src={"/images/profile.png"}/>
                      </antd_1.Col>
                      <antd_1.Col flex="none">
                        <div className={protectedLayout_module_css_1.default["sidebar-right-profile-name"]}>
                          {((_a = data === null || data === void 0 ? void 0 : data.account) === null || _a === void 0 ? void 0 : _a.first_name)
            ? (_b = data === null || data === void 0 ? void 0 : data.account) === null || _b === void 0 ? void 0 : _b.first_name
            : "."}
                        </div>
                      </antd_1.Col>
                    </antd_1.Row>
                  </link_1.default>
                </antd_1.Col>
                <antd_1.Col flex="none">
                  <antd_1.Row align="middle" justify="center" className={protectedLayout_module_css_1.default["sidebar-right-notification-div"]}>
                    <antd_1.Badge count={5}>
                      <antd_1.Avatar size={21} src={"/images/notification.svg"}/>
                    </antd_1.Badge>
                  </antd_1.Row>
                </antd_1.Col>
              </antd_1.Row>
            </antd_1.Col>
            <antd_1.Col span={24}>{renderNavbar(router.pathname)}</antd_1.Col>
          </antd_1.Row>
        </antd_1.Col>
      </antd_1.Row>
    </Sider>);
};
exports.SidebarRightComponent = SidebarRightComponent;
exports.default = exports.SidebarRightComponent;

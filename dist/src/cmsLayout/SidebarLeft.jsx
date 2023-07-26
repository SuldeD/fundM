"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SidebarLeftComponent = void 0;
const antd_1 = require("antd");
const link_1 = __importDefault(require("next/link"));
const router_1 = require("next/router");
const protectedLayout_module_css_1 = __importDefault(require("../styles/protectedLayout.module.css"));
const react_1 = require("react");
const react_2 = require("next-auth/react");
const { Sider } = antd_1.Layout;
const SidebarLeftComponent = () => {
    const router = (0, router_1.useRouter)();
    const [keys, setKeys] = (0, react_1.useState)(["/"]);
    (0, react_1.useEffect)(() => {
        if (router.isReady) {
            setKeys([router.asPath]);
        }
    }, [router]);
    const items = [
        {
            key: "/dashboard",
            label: <link_1.default href="/dashboard">Дашбоард</link_1.default>,
            icon: <img src="/images/menu.png" style={{ width: 22 }}/>,
        },
        {
            key: "/dashboard/fund",
            label: <link_1.default href="/dashboard/fund">Миний санхүүжилт</link_1.default>,
            icon: <img src="/images/stats.png" style={{ width: 22 }}/>,
        },
        {
            key: "/dashboard/myfund",
            label: <link_1.default href="/dashboard/myfund">Миний хүсэлтүүд</link_1.default>,
            icon: <img src="/images/save-money.png" style={{ width: 22 }}/>,
        },
        {
            key: "/dashboard/history",
            label: <link_1.default href="/dashboard/history">Санхүүжилтын түүх</link_1.default>,
            icon: <img src="/images/tugrik.png" style={{ width: 22 }}/>,
        },
        {
            key: "/dashboard/loan",
            label: <link_1.default href="/dashboard/loan">Зээл авах хүсэлт</link_1.default>,
            icon: <img src="/images/save-money.png" style={{ width: 22 }}/>,
        },
        {
            key: "/dashboard/foundation",
            label: <link_1.default href="/dashboard/foundation">Санхүүжилт өгөх хүсэлт</link_1.default>,
            icon: <img src="/images/give-money.png" style={{ width: 22 }}/>,
        },
    ];
    return (<Sider className={protectedLayout_module_css_1.default["sidebar-left-main"]} width="18%" breakpoint="lg" collapsedWidth="0">
      <antd_1.Row style={{ padding: "25px 0", height: "100%" }}>
        <antd_1.Col span={24}>
          <antd_1.Row justify="center">
            <antd_1.Col span={18}>
              <antd_1.Image width="100%" src={"/logo.svg"} preview={false} alt="Header Logo"/>
            </antd_1.Col>
            <antd_1.Col span={24}>
              <antd_1.Divider />
            </antd_1.Col>
            <antd_1.Col span={22}>
              <antd_1.Menu selectedKeys={keys} mode="inline" items={items} theme="light" className={protectedLayout_module_css_1.default["sidebar-left-menu-title"]}/>
            </antd_1.Col>
          </antd_1.Row>
        </antd_1.Col>
        <antd_1.Col span={24}>
          <antd_1.Row justify="center" align="bottom" style={{ height: "100%" }}>
            <antd_1.Col span={24}>
              <antd_1.Row justify="center">
                <antd_1.Col span={18}>
                  <antd_1.Button onClick={() => {
            void (0, react_2.signOut)(), router.push("/");
        }} className={protectedLayout_module_css_1.default["sidebar-left-exit-button"]}>
                    <antd_1.Row gutter={15} align="middle">
                      <antd_1.Col flex="none">
                        <antd_1.Image width="100%" src={"/images/exitIcon.svg"} preview={false} alt="exit icon"/>
                      </antd_1.Col>
                      <antd_1.Col>
                        <div className={protectedLayout_module_css_1.default["sidebar-left-exit-button-text"]}>
                          Гарах
                        </div>
                      </antd_1.Col>
                    </antd_1.Row>
                  </antd_1.Button>
                </antd_1.Col>
                <antd_1.Col span={24}>
                  <antd_1.Divider />
                </antd_1.Col>
                <antd_1.Col span={24}>
                  <div className={protectedLayout_module_css_1.default["sidebar-left-footer-text"]}>
                    ©2023 Fund me birj LLC. Version 1.01
                  </div>
                </antd_1.Col>
              </antd_1.Row>
            </antd_1.Col>
          </antd_1.Row>
        </antd_1.Col>
      </antd_1.Row>
    </Sider>);
};
exports.SidebarLeftComponent = SidebarLeftComponent;
exports.default = exports.SidebarLeftComponent;

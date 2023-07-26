"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderComponent = void 0;
const react_1 = require("react");
const link_1 = __importDefault(require("next/link"));
const antd_1 = require("antd");
const Header_module_css_1 = __importDefault(require("../styles/Header.module.css"));
const icons_1 = require("@ant-design/icons");
const router_1 = require("next/router");
const react_2 = require("next-auth/react");
const { Header } = antd_1.Layout;
const HeaderComponent = () => {
    const router = (0, router_1.useRouter)();
    const [keys, setKeys] = (0, react_1.useState)(["/"]);
    (0, react_1.useEffect)(() => {
        if (router.isReady) {
            setKeys([router.asPath]);
        }
    }, [router]);
    const items = [
        {
            key: "/",
            label: <link_1.default href="/">Нүүр</link_1.default>,
        },
        {
            key: "/about-us",
            label: <link_1.default href="/about-us">Бидний тухай</link_1.default>,
        },
        {
            key: "/finance",
            label: <link_1.default href="/finance">Санхүүжилт өгөх</link_1.default>,
        },
        {
            key: "/loan",
            label: <link_1.default href="/loan">Зээл авах</link_1.default>,
        },
        {
            key: "/#app",
            label: <link_1.default href="/#app">Апп татах</link_1.default>,
        },
        {
            key: "/#contact",
            label: <link_1.default href="/#contact">Холбоо барих</link_1.default>,
        },
    ];
    const phoneItems = [
        {
            image: "/images/home.png",
            key: "1",
            label: <link_1.default href="/">Нүүр</link_1.default>,
            link: "/",
        },
        {
            image: "/images/man.png",
            key: "2",
            label: <link_1.default href="/about-us">Бидний тухай</link_1.default>,
            link: "/about-us",
        },
        {
            image: "/images/finance.png",
            key: "3",
            label: <link_1.default href="/finance">Санхүүжилт өгөх</link_1.default>,
            link: "/finance",
        },
        {
            image: "/images/loan.png",
            key: "4",
            label: <link_1.default href="/loan">Зээл авах</link_1.default>,
            link: "/loan",
        },
        {
            image: "/images/user-interface.png",
            key: "5",
            label: <link_1.default href="/#app">Апп татах</link_1.default>,
            link: "/#app",
        },
        {
            image: "/images/contact-book.png",
            key: "6",
            label: <link_1.default href="/#contact">Холбоо барих</link_1.default>,
            link: "/#contact",
        },
    ];
    const accountPages = [
        {
            image: "/images/signup.png",
            key: "signup",
            label: <link_1.default href="/">БҮРТГҮҮЛЭХ</link_1.default>,
            link: "/signup",
        },
        {
            image: "/images/sign-in.png",
            key: "signin",
            label: <link_1.default href="/login">НЭВТРЭХ</link_1.default>,
            link: "/login",
        },
    ];
    const [open, setOpen] = (0, react_1.useState)(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    return (<Header className="flex h-[100px] justify-between bg-[#fff] px-[50px] py-[22px]">
      <link_1.default href="/">
        <img src={"/logo.svg"} alt="Header Logo" className="w-[180px]"/>
      </link_1.default>
      <antd_1.Menu selectedKeys={keys} theme="light" mode="horizontal" items={items} className="text-[rgb(0, 0 ,0, 0.10)] hidden w-[50%] scroll-smooth border-0  font-lato text-[16px] font-normal lg:flex"/>
      <div className="hidden gap-[24px] lg:flex">
        <p>
          <link_1.default href="/signup" className="border-b border-primary font-inter text-[14px] font-bold leading-[14px] text-primary">
            БҮРТГҮҮЛЭХ
          </link_1.default>
        </p>

        <button onClick={() => void (0, react_2.signIn)()} className=" w-[127px] rounded-[9px] bg-primary text-center text-[#fff]">
          НЭВТРЭХ
        </button>
      </div>
      <div>
        <icons_1.MenuOutlined onClick={showDrawer} className="flex text-[30px] text-primary active:text-sky-900 lg:hidden"/>

        <antd_1.Drawer title={<img src={"/logo.svg"} className="h w-[180px]"/>} placement="right" onClose={onClose} open={open} width="min(400px,100%)">
          {phoneItems.map((el, idx) => (<antd_1.Col span={24} onClick={() => router.push(el.link)} key={`phone-${idx}`}>
              <antd_1.Row justify="center" gutter={10} align="middle" className={Header_module_css_1.default["drawer-title-div"]} onClick={onClose}>
                <img width={30} src={el.image} className="w-[30px]"/>

                <antd_1.Col flex="auto">
                  <div className={Header_module_css_1.default["drawer-title-text"]}>{el.label}</div>
                </antd_1.Col>
              </antd_1.Row>
            </antd_1.Col>))}
          <antd_1.Col span={24} className={Header_module_css_1.default["drawer-account-pages-title"]}>
            Хэрэглэгчийн хуудсууд
          </antd_1.Col>
          {accountPages.map((el, idx) => (<antd_1.Col span={24} onClick={() => router.push(el.link)} key={`accpg-${idx}`}>
              <antd_1.Row justify="center" gutter={10} align="middle" className={Header_module_css_1.default["drawer-title-div"]} onClick={onClose}>
                <img src={el.image} className="w-[30px]"/>

                <antd_1.Col flex="auto">
                  <div className={Header_module_css_1.default["drawer-title-text"]}>{el.label}</div>
                </antd_1.Col>
              </antd_1.Row>
            </antd_1.Col>))}
        </antd_1.Drawer>
      </div>
    </Header>
    // <Header className={style["home-header-style"]}>
    //   <Row justify="center">
    //     <Col xs={20} lg={22}>
    //       <Row align="middle" wrap={false} justify="space-between">
    //         <Col flex="auto">
    //         </Col>
    //         <Col xs={0} lg={12} xl={15} xxl={16}>
    //           <Menu
    //             selectedKeys={keys}
    //             theme="light"
    //             mode="horizontal"
    //             items={items}
    //             className={style["header-menu-item"]}
    //             style={{
    //               justifyContent: "center",
    //               lineHeight: 3,
    //               borderBottom: 0,
    //             }}
    //           />
    //         </Col>
    //         <Col xs={0} lg={7} xl={5} xxl={4}>
    //           <Row wrap={false} justify="end" gutter={24}>
    //             <Col flex="none">
    //               <Link href="/signup">
    //                 <Button type="text" className={style["sign-up-button"]}>
    //                   <div>БҮРТГҮҮЛЭХ</div>
    //                 </Button>
    //               </Link>
    //             </Col>
    //             <Col flex="none">
    //               <Button
    //                 type="primary"
    //                 className={style["login-button"]}
    //                 onClick={() => void signIn()}
    //               >
    //                 НЭВТРЭХ
    //               </Button>
    //             </Col>
    //           </Row>
    //         </Col>
    //         <Col lg={0}>
    //           <Row align="middle">
    //             <Button
    //               type="text"
    //               className={style["hamburger-button"]}
    //               onClick={showDrawer}
    //             >
    //               <MenuOutlined style={{ fontSize: 30, color: "#0300B4" }} />
    //             </Button>
    //           </Row>
    //         </Col>
    //
    //       </Row>
    //     </Col>
    //   </Row>
    // </Header>
    );
};
exports.HeaderComponent = HeaderComponent;
exports.default = exports.HeaderComponent;

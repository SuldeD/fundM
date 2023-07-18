import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Col, Layout, Row, Menu, Image, Drawer } from "antd";
import style from "../styles/Header.module.css";
import { MenuOutlined } from "@ant-design/icons";
import { Router, useRouter } from "next/router";
import { signIn } from "next-auth/react";

const { Header } = Layout;

export const HeaderComponent = () => {
  const router = useRouter();
  const [keys, setKeys] = useState(["/"]);

  useEffect(() => {
    if (router.isReady) {
      setKeys([router.asPath]);
    }
  }, [router]);
  const items = [
    {
      key: "/",
      label: <Link href="/">Нүүр</Link>,
    },
    {
      key: "/about-us",
      label: <Link href="/about-us">Бидний тухай</Link>,
    },
    {
      key: "/finance",
      label: <Link href="/finance">Санхүүжилт өгөх</Link>,
    },
    {
      key: "/loan",
      label: <Link href="/loan">Зээл авах</Link>,
    },
    {
      key: "/#app",
      label: <Link href="/#app">Апп татах</Link>,
    },
    {
      key: "/#contact",
      label: <Link href="/#contact">Холбоо барих</Link>,
    },
  ];

  const phoneItems = [
    {
      image: "/images/home.png",
      key: "1",
      label: <Link href="/">Нүүр</Link>,
      link: "/",
    },
    {
      image: "/images/man.png",
      key: "2",
      label: <Link href="/about-us">Бидний тухай</Link>,
      link: "/about-us",
    },
    {
      image: "/images/finance.png",
      key: "3",
      label: <Link href="/finance">Санхүүжилт өгөх</Link>,
      link: "/finance",
    },
    {
      image: "/images/loan.png",
      key: "4",
      label: <Link href="/loan">Зээл авах</Link>,
      link: "/loan",
    },
    {
      image: "/images/user-interface.png",
      key: "5",
      label: <Link href="/#app">Апп татах</Link>,
      link: "/#app",
    },
    {
      image: "/images/contact-book.png",
      key: "6",
      label: <Link href="/#contact">Холбоо барих</Link>,
      link: "/#contact",
    },
  ];

  const accountPages = [
    {
      image: "/images/signup.png",
      key: "signup",
      label: <Link href="/">БҮРТГҮҮЛЭХ</Link>,
      link: "/signup",
    },
    {
      image: "/images/sign-in.png",
      key: "signin",
      label: <Link href="/login">НЭВТРЭХ</Link>,
      link: "/login",
    },
  ];

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  return (
    <Header className={style["home-header-style"]}>
      <Row justify="center">
        <Col xs={20} lg={22}>
          <Row align="middle" wrap={false} justify="space-between">
            <Col flex="auto">
              <Link href="/">
                <Image
                  width={180}
                  src={"/logo.svg"}
                  preview={false}
                  alt="Header Logo"
                />
              </Link>
            </Col>
            <Col xs={0} lg={12} xl={15} xxl={16}>
              <Menu
                selectedKeys={keys}
                theme="light"
                mode="horizontal"
                items={items}
                className={style["header-menu-item"]}
                style={{
                  justifyContent: "center",
                  lineHeight: 3,
                  borderBottom: 0,
                }}
              />
            </Col>
            <Col xs={0} lg={7} xl={5} xxl={4}>
              <Row wrap={false} justify="end" gutter={24}>
                <Col flex="none">
                  <Link href="/signup">
                    <Button type="text" className={style["sign-up-button"]}>
                      <div>БҮРТГҮҮЛЭХ</div>
                    </Button>
                  </Link>
                </Col>
                <Col flex="none">
                  <Button
                    type="primary"
                    className={style["login-button"]}
                    onClick={() => void signIn()}
                  >
                    НЭВТРЭХ
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col lg={0}>
              <Row align="middle">
                <Button
                  type="text"
                  className={style["hamburger-button"]}
                  onClick={showDrawer}
                >
                  <MenuOutlined style={{ fontSize: 30, color: "#0300B4" }} />
                </Button>
              </Row>
            </Col>
            <Drawer
              title={
                <Row style={{ height: 68 }} align="middle">
                  <Image width={180} src={"/logo.svg"} preview={false} />
                </Row>
              }
              placement="right"
              onClose={onClose}
              open={open}
              width="min(400px,100%)"
            >
              <Row gutter={[0, 15]}>
                {phoneItems.map((el, idx) => (
                  <Col
                    span={24}
                    onClick={() => router.push(el.link)}
                    key={`phone-${idx}`}
                  >
                    <Row
                      justify="center"
                      gutter={10}
                      align="middle"
                      className={style["drawer-title-div"]}
                      onClick={onClose}
                    >
                      <Col flex="none">
                        <Image width={30} src={el.image} preview={false} />
                      </Col>
                      <Col flex="auto">
                        <div className={style["drawer-title-text"]}>
                          {el.label}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                ))}
                <Col span={24} className={style["drawer-account-pages-title"]}>
                  Хэрэглэгчийн хуудсууд
                </Col>
                {accountPages.map((el, idx) => (
                  <Col
                    span={24}
                    onClick={() => router.push(el.link)}
                    key={`accpg-${idx}`}
                  >
                    <Row
                      justify="center"
                      gutter={10}
                      align="middle"
                      className={style["drawer-title-div"]}
                      onClick={onClose}
                    >
                      <Col flex="none">
                        <Image width={30} src={el.image} preview={false} />
                      </Col>
                      <Col flex="auto">
                        <div className={style["drawer-title-text"]}>
                          {el.label}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                ))}
              </Row>
            </Drawer>
          </Row>
        </Col>
      </Row>
    </Header>
  );
};

export default HeaderComponent;

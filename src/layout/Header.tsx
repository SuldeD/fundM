import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Col, Drawer, Layout, Menu, Popover, Row } from "antd";
import style from "../styles/Header.module.css";
import { MenuOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
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
    <Header className="flex h-[100px] justify-between bg-[#fff] px-[20px] py-[22px]">
      <Link href="/">
        <img src={"/logo.svg"} alt="Header Logo" className="w-[180px]" />
      </Link>
      <Menu
        selectedKeys={keys}
        theme="light"
        mode="horizontal"
        items={items}
        className="text-[rgb(0, 0 ,0, 0.10)] hidden w-[50%] scroll-smooth border-0  font-lato text-[16px] font-normal lg:flex"
      />
      <div className="hidden gap-[24px] lg:flex">
        <p>
          <Popover
            placement="top"
            title={<div className="border-b pb-3 text-center">БҮРТГҮҮЛЭХ</div>}
            content={
              <div className="">
                <Button
                  className="mt-3 w-full"
                  onClick={() => router.push("/signup?s=org")}
                >
                  Байгууллага
                </Button>
                <Button
                  className="mt-3 w-full"
                  onClick={() => router.push("/signup")}
                >
                  Хэрэглэгч
                </Button>
              </div>
            }
            trigger="click"
          >
            <Button
              type="text"
              className="font-inter text-[14px] font-bold leading-[14px] text-primary"
            >
              БҮРТГҮҮЛЭХ
            </Button>
          </Popover>
        </p>

        <button
          onClick={() => void signIn()}
          className=" w-[127px] rounded-[9px] bg-primary text-center text-[#fff]"
        >
          НЭВТРЭХ
        </button>
      </div>
      <div>
        <MenuOutlined
          onClick={showDrawer}
          className="flex py-2 text-[30px] text-primary active:text-sky-900 lg:hidden"
        />

        <Drawer
          title={<img src={"/logo.svg"} className="h w-[180px]" />}
          placement="right"
          onClose={onClose}
          open={open}
          width="min(400px,100%)"
        >
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
                <img width={30} src={el.image} className="w-[30px]" />
                <Col flex="auto">
                  <div className={style["drawer-title-text"]}>{el.label}</div>
                </Col>
              </Row>
            </Col>
          ))}
          <Col
            span={24}
            className={`${style["drawer-account-pages-title"]} mb-[20px]`}
          >
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
                <img src={el.image} className="w-[30px]" />

                <Col flex="auto">
                  <div className={style["drawer-title-text"]}>{el.label}</div>
                </Col>
              </Row>
            </Col>
          ))}
        </Drawer>
      </div>
    </Header>
  );
};

export default HeaderComponent;

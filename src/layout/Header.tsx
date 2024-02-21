import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Col, Drawer, Image, Layout, Menu, Popover, Row } from "antd";
import style from "../styles/Header.module.css";
import { MenuOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

const { Header } = Layout;

export const HeaderComponent = () => {
  const router = useRouter();
  const [keys, setKeys] = useState(["/"]);
  const [loadings, setLoadings] = useState<boolean>(false);

  useEffect(() => {
    if (router.isReady) {
      setKeys([router.asPath]);
      setLoadings(false);
    }
  }, [router]);

  const items = [
    {
      key: "/",
      label: <Link href="/">Нүүр</Link>,
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
      key: "#contact",
      label: <Link href="#contact">Холбоо барих</Link>,
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
      image: "/images/contact-book.png",
      key: "6",
      label: <Link href="/#contact">Холбоо барих</Link>,
      link: "/#contact",
    },
  ];

  const [open, setOpen] = useState(false);
  const [openPhone, setOpenPhone] = useState(false);
  const [openWeb, setOpenWeb] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  return (
    <Header className="h-[90px] bg-[#fff] pe-0 ps-0 pt-[20px] lg:pt-[13px]">
      <Row justify="center" align="middle">
        <Col xs={0} lg={22}>
          <Row align="middle" justify="space-between" wrap={false}>
            <Col flex="auto">
              <Row>
                <img
                  src="/logo.svg"
                  onClick={() => router.push("/")}
                  style={{ cursor: "pointer" }}
                  alt=""
                />
              </Row>
            </Col>
            <Col flex="auto">
              <Menu
                selectedKeys={keys}
                theme="light"
                mode="horizontal"
                items={items}
                style={{
                  lineHeight: 3,
                  fontSize: "16px",
                  borderBottom: "none",
                }}
              />
            </Col>
            <Col flex="none">
              <Row gutter={[20, 0]}>
                <Col>
                  <Popover
                    placement="top"
                    open={openWeb}
                    title={null}
                    content={
                      <div className="">
                        <Button
                          className="mt-3 w-full"
                          onClick={() => {
                            router.push("/signup?s=org");

                            setOpenWeb(false);
                          }}
                        >
                          Байгууллага
                        </Button>
                        {/* <Button
                          className="mt-3 w-full"
                          onClick={() => {
                            router.push("/signup");
                            setOpenWeb(false);
                          }}
                        >
                          Хэрэглэгч
                        </Button> */}
                      </div>
                    }
                    trigger="click"
                  >
                    <Button
                      type="text"
                      onClick={() => setOpenWeb(true)}
                      className="font-inter text-[14px] font-bold leading-[14px] text-primary"
                    >
                      БҮРТГҮҮЛЭХ
                    </Button>
                  </Popover>
                </Col>
                <Col>
                  <Button
                    type="primary"
                    loading={loadings}
                    onClick={() => {
                      router.push("/login");
                      setLoadings(true);
                    }}
                    style={{ borderRadius: 9, height: 44 }}
                  >
                    НЭВТРЭХ
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col xs={22} lg={0}>
          <Row align="middle" wrap={false} justify="space-between">
            <Col>
              <Row>
                <Image
                  src={"/logo.svg"}
                  preview={false}
                  width="80%"
                  onClick={() => router.push("/")}
                  style={{ cursor: "pointer" }}
                />
              </Row>
            </Col>
            <Col>
              <MenuOutlined
                onClick={showDrawer}
                className="flex py-2 text-[30px] text-primary active:text-sky-900 lg:hidden"
              />
              <Drawer
                title={<img src={"/logo.svg"} className="h w-[180px]" />}
                placement="right"
                onClose={onClose}
                open={open}
                width="min(500px,100%)"
              >
                {phoneItems.map((el, idx) => (
                  <Col span={24} key={`phone-${idx}`}>
                    <Row
                      justify="center"
                      gutter={20}
                      align="middle"
                      className={style["drawer-title-div"]}
                      onClick={onClose}
                    >
                      <img width={30} src={el.image} className="w-[30px]" />
                      <Col flex="auto">
                        <div className={style["drawer-title-text"]}>
                          {el.label}
                        </div>
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
                <Col
                  span={24}
                  onClick={() => {
                    router.push("/login");
                    onClose();
                  }}
                >
                  <Row
                    justify="center"
                    gutter={20}
                    align="middle"
                    className={style["drawer-title-div"]}
                  >
                    <img src="/images/signup.png" className="w-[30px]" />

                    <Col flex="auto">
                      <div className={style["drawer-title-text"]}>НЭВТРЭХ</div>
                    </Col>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row
                    justify="center"
                    gutter={20}
                    align="middle"
                    className={style["drawer-title-div"]}
                  >
                    <img src="/images/signup.png" className="w-[30px]" />

                    <Col flex="auto">
                      <div className={style["drawer-title-text"]}>
                        <Popover
                          open={openPhone}
                          placement="bottom"
                          title={null}
                          content={
                            <div className="">
                              <Button
                                className="mt-3 w-full"
                                onClick={() => {
                                  router.push("/signup?s=org");
                                  onClose();
                                  setOpenPhone(false);
                                }}
                              >
                                Байгууллага
                              </Button>
                              {/* <Button
                                className="mt-3 w-full"
                                onClick={() => {
                                  router.push("/signup");
                                  onClose();
                                  setOpenPhone(false);
                                }}
                              >
                                Хэрэглэгч
                              </Button> */}
                            </div>
                          }
                          trigger="click"
                        >
                          <Button
                            type="text"
                            onClick={() => setOpenPhone(true)}
                            className="p-0 font-inter text-[14px] font-bold leading-[14px] text-primary"
                          >
                            БҮРТГҮҮЛЭХ
                          </Button>
                        </Popover>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Drawer>
            </Col>
          </Row>
        </Col>
      </Row>
    </Header>
  );
};

export default HeaderComponent;

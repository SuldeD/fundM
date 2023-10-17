import { Col, Layout, Menu, Row, Image, Divider, Button } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import style from "../styles/protectedLayout.module.css";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

const { Sider } = Layout;

export const SidebarLeftComponent = ({ setOpen }: any) => {
  const router = useRouter();
  const [keys, setKeys] = useState(["/"]);

  useEffect(() => {
    if (router.isReady) {
      setKeys([router.asPath]);
    }
  }, [router]);

  const items = [
    {
      key: "/dashboard",
      label: <Link href="/dashboard">Нүүр хуудас</Link>,
      icon: <img src="/images/menu.png" style={{ width: 22 }} />,
    },
    {
      key: "/dashboard/foundation",
      label: <Link href="/dashboard/foundation">Санхүүжилт өгөх</Link>,
      icon: <img src="/images/give-money.png" style={{ width: 22 }} />,
    },
    {
      key: "/dashboard/loan",
      label: <Link href="/dashboard/loan">Зээл авах </Link>,
      icon: <img src="/images/save-money.png" style={{ width: 22 }} />,
    },
    {
      key: "/dashboard/myfund",
      label: <Link href="/dashboard/myfund">Миний хүсэлтүүд</Link>,
      icon: <img src="/images/save-money.png" style={{ width: 22 }} />,
    },
    {
      key: "/dashboard/fund",
      label: <Link href="/dashboard/fund">Миний санхүүжилт</Link>,
      icon: <img src="/images/stats.png" style={{ width: 22 }} />,
    },

    {
      key: "/dashboard/history",
      label: <Link href="/dashboard/history">Түүх</Link>,
      icon: <img src="/images/tugrik.png" style={{ width: 22 }} />,
    },
  ];

  return (
    <Sider
      className={style["sidebar-left-main"]}
      width="18%"
      breakpoint="lg"
      collapsedWidth="0"
      onClick={() => setOpen(false)}
    >
      <Row style={{ padding: "25px 0", height: "100%" }}>
        <Col span={24}>
          <Row justify="center">
            <Col span={18}>
              <img
                src={"/logo.svg"}
                onClick={() => router.push("/")}
                className="cursor-pointer"
                alt="Header Logo"
              />
            </Col>
            <Col span={24}>
              <Divider />
            </Col>
            <Col span={22}>
              <Menu
                selectedKeys={keys}
                mode="inline"
                items={items}
                theme="light"
                className={style["sidebar-left-menu-title"]}
              />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row justify="center" align="bottom" style={{ height: "100%" }}>
            <Col span={24}>
              <Row justify="center">
                <Col span={18}>
                  <Button
                    onClick={() => {
                      void signOut();
                    }}
                    className={style["sidebar-left-exit-button"]}
                  >
                    <Row gutter={15} align="middle">
                      <Col flex="none">
                        <Image
                          width="100%"
                          src={"/images/exitIcon.svg"}
                          preview={false}
                          alt="exit icon"
                        />
                      </Col>
                      <Col>
                        <div className={style["sidebar-left-exit-button-text"]}>
                          Гарах
                        </div>
                      </Col>
                    </Row>
                  </Button>
                </Col>
                <Col span={24}>
                  <Divider />
                </Col>
                <Col span={24}>
                  <div className={style["sidebar-left-footer-text"]}>
                    ©2023 Fund me birj LLC. Version 1.01
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </Sider>
  );
};

export default SidebarLeftComponent;

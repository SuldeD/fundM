import { Layout, Row, Col, Avatar, Badge } from "antd";
import React from "react";
import styles from "../styles/protectedLayout.module.css";
import { CalculateComponent } from "../components/calculate";
import { LoanReqComponent } from "../components/loanRequest";
import Link from "next/link";
import { useRouter } from "next/router";
import { LoanTakeReqComponent } from "../components/loanTakeRequest";
import { FoundationReq } from "../components/foundationReq";
import { useApiContext } from "app/context/dashboardApiContext";

const { Sider } = Layout;

// @ts-ignore
export const SidebarRightComponent = () => {
  const { accountInfo: data } = useApiContext();

  const router = useRouter();
  const myFundTabKey = "1";

  const NavBars = {
    // CalculateComponent
    "/dashboard/profile": LoanReqComponent,
    "/dashboard": LoanTakeReqComponent,
    "/dashboard/loan": LoanReqComponent,
    "/dashboard/foundation": LoanTakeReqComponent,
    "/dashboard/myfund":
      myFundTabKey === "1" ? LoanTakeReqComponent : FoundationReq,
  };

  const renderNavbar = (pathname: string) => {
    // @ts-ignore
    const Comp = NavBars[pathname] ?? NavBars["/dashboard/profile"];

    return <Comp />;
  };

  return (
    <Sider
      style={{
        background: "#FFF",
        borderInlineStart: "1px solid #D9D9D9",
        height: "100vh",
      }}
      width="27%"
      breakpoint="lg"
      collapsedWidth="0"
    >
      <Row justify="center" className={styles["sidebar-right-main"]}>
        <Col span={20}>
          <Row justify="center" gutter={[0, 30]}>
            <Col span={24}>
              <Row justify="space-between">
                <Col span={18}>
                  <Link href={"/dashboard/profile"}>
                    <Row
                      align="middle"
                      gutter={10}
                      className={styles["sidebar-right-profile-div"]}
                    >
                      <Col flex="none">
                        <Avatar size={32} src={"/images/profile.png"} />
                      </Col>
                      <Col flex="none">
                        <div className={styles["sidebar-right-profile-name"]}>
                          {data?.account?.first_name
                            ? data?.account?.first_name
                            : "."}
                        </div>
                      </Col>
                    </Row>
                  </Link>
                </Col>
                <Col flex="none">
                  <Row
                    align="middle"
                    justify="center"
                    className={styles["sidebar-right-notification-div"]}
                  >
                    <Badge count={5}>
                      <Avatar size={21} src={"/images/notification.svg"} />
                    </Badge>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col span={24}>{renderNavbar(router.pathname)}</Col>
          </Row>
        </Col>
      </Row>
    </Sider>
  );
};

export default SidebarRightComponent;

import { Layout, Row, Col, Avatar, Badge, Popover, Modal } from "antd";
import React, { useEffect } from "react";
import styles from "../styles/protectedLayout.module.css";
import { CalculateComponent } from "../components/calculate";
import { LoanReqComponent } from "../components/loanRequest";
import Link from "next/link";
import { useRouter } from "next/router";
import { LoanTakeReqComponent } from "../components/loanTakeRequest";
import { FoundationReq } from "../components/foundationReq";
import { useApiContext } from "app/context/dashboardApiContext";
import { useAppContext } from "app/context/appContext";
import { signOut } from "next-auth/react";
import { api } from "app/utils/api";

const { Sider } = Layout;

// @ts-ignore
export const SidebarRightComponent = ({ statusData }) => {
  const { accountInfo: data } = useApiContext();
  const { myFundTabKey } = useAppContext();
  const router = useRouter();
  const { error } = Modal;

  const NavBars = {
    // CalculateComponent
    "/dashboard/profile": LoanReqComponent,
    "/dashboard": LoanTakeReqComponent,
    "/dashboard/loan": LoanReqComponent,
    "/dashboard/foundation": LoanTakeReqComponent,
    "/dashboard/myfund":
      myFundTabKey === "1" ? LoanTakeReqComponent : FoundationReq,
    "/dashboard/myfund/list":
      myFundTabKey === "2" ? LoanTakeReqComponent : FoundationReq,
  };

  const renderNavbar = (pathname: string) => {
    // @ts-ignore
    const Comp = NavBars[pathname] ?? NavBars["/dashboard/profile"];

    return <Comp />;
  };

  const items = [
    <div>
      <div className="flex w-[400px] gap-3 border-b p-[10px]">
        <div className="flex h-[40px] w-[40px] justify-center rounded-[50%] bg-bank pt-2">
          <img
            className="h-[22px] w-[22px]"
            src="/images/notficationIcon.svg"
            alt=""
          />
        </div>
        <div className="">
          <p className="leading-[18px font-lato] text-[14px] font-medium text-[#1A2155]">
            Таны зээлийг хүсэлт амжилттай биеллээ
          </p>
          <p className="font-lato text-[8px] font-medium text-sub">
            20/08/2023
          </p>
        </div>
      </div>
      <div className="mx-auto w-[100px] cursor-pointer border-b border-[#1375ED] pt-[15px] text-center font-lato text-[14px] leading-[18px] text-[#1375ED]">
        Бүгдийг харах
      </div>
    </div>,
  ];

  const { mutate } = api.loan.notficationSearch.useMutation();

  useEffect(() => {
    mutate(
      {
        order: "date",
        order_up: "1",
        page: "1",
        page_size: "10",
      },
      {
        onSuccess: (
          /** @type {{ success: any; loan_requests: import("react").SetStateAction<undefined>; description: any; }} */ data
        ) => {
          if (data?.success) {
            console.log(data);
          } else {
            // signOut();
            error({
              title: "Амжилтгүй",
              content: <div>{data?.description || null}</div>,
            });
          }
        },
      }
    );
  }, []);

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
                  <Popover
                    placement="leftBottom"
                    title={
                      <div className="text-center font-lato text-[18px] font-medium leading-[18px]">
                        Мэдэгдэл
                      </div>
                    }
                    content={items}
                    trigger="click"
                  >
                    <Row
                      align="middle"
                      justify="center"
                      className={`${styles["sidebar-right-notification-div"]} cursor-pointer`}
                    >
                      <Badge count={statusData?.stat?.notification_count}>
                        <Avatar size={21} src={"/images/notification.svg"} />
                      </Badge>
                    </Row>
                  </Popover>
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

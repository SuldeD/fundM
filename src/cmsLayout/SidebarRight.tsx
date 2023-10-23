import {
  Layout,
  Row,
  Col,
  Avatar,
  Badge,
  Modal,
  Empty,
  Button,
  TabsProps,
} from "antd";
import React, { useEffect, useMemo, useState } from "react";
import styles from "../styles/protectedLayout.module.css";
import { LoanReqComponent } from "../components/loanRequest";
import Link from "next/link";
import { useRouter } from "next/router";
import { LoanTakeReqComponent } from "../components/loanTakeRequest";
import { FoundationReq } from "../components/foundationReq";
import { useAppContext } from "app/context/appContext";
import { signOut } from "next-auth/react";
import { api } from "app/utils/api";

const { Sider } = Layout;

export const SidebarRightComponent = ({ statusData, open, setOpen }: any) => {
  const router = useRouter();
  const { error } = Modal;

  //mutates
  const { mutate } = api.other.notficationSearch.useMutation();

  //queries
  const { data: accountInfo, refetch: re } = api.account.accountInfo.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    }
  );
  const { data: requestSearch } = api.loan.reguestSearch.useQuery(
    {
      order: "date",
      order_up: "1",
      page: "1",
      page_size: "30",
      filter_type: "active",
    },
    { refetchOnWindowFocus: false }
  );

  //states
  const { myFundTabKey } = useAppContext();
  const [notfication, setNotfication] = useState<any>();
  const [selectedNot, setSelectedNot] = useState<any>();
  const [openNot, setOpenNot] = useState<boolean>(false);

  //constants
  const activeSavingOrders = useMemo(() => {
    return requestSearch?.requests?.filter(
      (el: any) => el.request_type == "saving"
    ).length > 0
      ? requestSearch?.requests?.filter(
          (el: any) => el.request_type == "saving"
        )
      : [];
  }, [requestSearch]);

  const activeLoanOrders = useMemo(() => {
    return requestSearch?.requests?.filter(
      (el: any) => el?.request_type == "wallet"
    ).length > 0
      ? requestSearch?.requests?.filter(
          (el: any) => el?.request_type == "wallet"
        )
      : [];
  }, [requestSearch]);

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

  const renderNavbar = useMemo(() => {
    // @ts-ignore
    const Comp = NavBars[router.pathname] ?? NavBars["/dashboard/profile"];

    return (
      <Comp
        activeSavingOrders={
          activeSavingOrders.length > 0 && activeSavingOrders.reverse()
        }
        activeLoanOrders={
          activeLoanOrders.length > 0 && activeLoanOrders.reverse()
        }
      />
    );
  }, [router.pathname, myFundTabKey]);

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
            setNotfication(data);
          } else {
            error({
              title:
                "Таны аюулгүй байдлыг хангах үүднээс 15 минутаас дээш хугацаанд идэвхгүй байсан тул таны холболтыг салгалаа.",
              content: <div>{data?.description || null}</div>,
              onOk: () => signOut(),
            });
          }
        },
      }
    );
  }, [statusData?.stat?.notification_count]);

  //functions
  function allData(page_size: string) {
    mutate(
      {
        order: "date",
        order_up: "1",
        page: "1",
        page_size: page_size,
      },
      {
        onSuccess: (
          /** @type {{ success: any; loan_requests: import("react").SetStateAction<undefined>; description: any; }} */ data
        ) => {
          if (data?.success) {
            setNotfication(data);
            // notificationChange.mutate(
            //   {
            //     notification_count: (
            //       Number(statusData?.stat?.notification_count) -
            //       Number(page_size)
            //     ).toString(),
            //   },
            //   {
            //     onSuccess: (
            //       /** @type {{ success: any; loan_requests: import("react").SetStateAction<undefined>; description: any; }} */ data
            //     ) => {
            //       if (data?.success) {
            //         console.log(data);
            //       } else {
            //         error({
            //           title: "Амжилтгүй",
            //           content: <div>{data?.description || null}</div>,
            //         });
            //         signOut();
            //       }
            //     },
            //   }
            // );
          } else {
            error({
              title:
                "Таны аюулгүй байдлыг хангах үүднээс 15 минутаас дээш хугацаанд идвэхгүй байсан тул таны холболтыг салгалаа.",
              content: <div>{data?.description || null}</div>,
              onOk: () => signOut(),
            });
          }
        },
      }
    );
  }

  const IsGender = useMemo(() => {
    const IsGenderCheck = accountInfo?.account?.register?.slice(-2, -1);

    if (accountInfo?.account?.user_type == "org") {
      return "0";
    } else if (["0", "2", "4", "6", "8"].includes(IsGenderCheck)) {
      return "2";
    } else {
      if (["1", "3", "5", "7", "9"].includes(IsGenderCheck)) {
        return "1";
      }
    }
  }, [accountInfo]);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: (
        <div className="flex justify-center p-1">
          <p>Бүгд</p>
          <Badge
            className="ms-2"
            color={"#0300B4"}
            count={statusData?.stat?.notification_count}
          />
        </div>
      ),
      children: (
        <div className="mt-[-30px]">
          {notfication?.activity_list?.length > 0 ? (
            notfication?.activity_list?.map(
              (
                nt: {
                  activity_code: string;
                  description:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | React.PromiseLikeOfReactNode
                    | null
                    | undefined;
                  create_date: string | any[];
                },
                idx: any
              ) => (
                <div className="mt-2 flex border-b p-[10px]" key={`${idx}`}>
                  <div
                    className={`flex h-[40px] w-[40px] justify-center rounded-[50%] pt-2 ${
                      nt.activity_code == "wallet_bank"
                        ? "bg-[#FF563029]"
                        : "bg-[#22C55E29]"
                    }`}
                  >
                    <img
                      className="h-[22px] w-[22px]"
                      src={
                        nt.activity_code == "wallet_bank"
                          ? "/images/notfication2.svg"
                          : "/images/notficationIcon.svg"
                      }
                      alt="notfication"
                    />
                  </div>
                  <div className="ms-[10px] w-[90%]">
                    <p className="font-lato text-[15px] font-medium leading-[18px] text-[#0b0b0b]">
                      {nt?.description}
                    </p>
                    <p className="my-1 font-lato text-[14px] font-normal text-sub">
                      {nt?.create_date}
                    </p>
                  </div>
                </div>
              )
            )
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
          {notfication?.activity_list?.length > 0 &&
          notfication?.activity_list_more ? (
            <Button
              type="primary"
              className="mx-auto mt-[20px] flex h-[40px] rounded-[50px] bg-primary px-6 pt-2 text-center font-raleway text-[15px] leading-[18px]"
              onClick={() => {
                notfication?.activity_list?.length &&
                  allData(`${notfication?.activity_list?.length + 10}`);
              }}
            >
              Бүгдийг харах
            </Button>
          ) : (
            <Button
              type="default"
              disabled
              className="mx-auto mt-[20px] flex text-center font-raleway text-[14px] leading-[18px]"
            >
              Бүгдийг харах
            </Button>
          )}
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div className="flex justify-center">
          <p>Уншаагүй</p>
          <Badge
            className="ms-2"
            color={"#00B8D9"}
            count={statusData?.stat?.notification_count}
          />
        </div>
      ),
      children: (
        <div className="mt-[-30px]">
          {notfication?.activity_list?.length > 0 ? (
            notfication?.activity_list?.map(
              (
                nt: {
                  activity_code: string;
                  description:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | React.PromiseLikeOfReactNode
                    | null
                    | undefined;
                  create_date: string | any[];
                },
                idx: any
              ) => (
                <div
                  className="mt-2 flex cursor-pointer border-b p-[10px]"
                  onClick={() => {
                    setOpenNot(true);
                    setSelectedNot(nt);
                  }}
                  key={`${idx}`}
                >
                  <div
                    className={`relative flex h-[40px] w-[40px] justify-center rounded-[50%] pt-2 ${
                      nt.activity_code == "wallet_bank"
                        ? "bg-[#FF563029]"
                        : "bg-[#22C55E29]"
                    }`}
                  >
                    <div className="absolute left-[-10px] top-[16px] h-[4px] w-[4px] rounded-[50px] bg-[#118D87]" />
                    <img
                      className="h-[22px] w-[22px]"
                      src={
                        nt.activity_code == "wallet_bank"
                          ? "/images/notfication2.svg"
                          : "/images/notficationIcon.svg"
                      }
                      alt="notfication"
                    />
                  </div>
                  <div className="ms-[10px] w-[90%]">
                    <p className="font-lato text-[15px] font-medium leading-[18px] text-[#0b0b0b]">
                      {nt?.description}
                    </p>
                    <p className="my-1 font-lato text-[14px] font-normal text-sub">
                      {nt?.create_date}
                    </p>
                  </div>
                </div>
              )
            )
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
          {notfication?.activity_list?.length > 0 &&
          notfication?.activity_list_more ? (
            <Button
              type="primary"
              className="mx-auto mt-[20px] flex h-[40px] rounded-[50px] bg-primary px-6 pt-2 text-center font-raleway text-[15px] leading-[18px]"
              onClick={() => {
                notfication?.activity_list?.length &&
                  allData(`${notfication?.activity_list?.length + 10}`);
              }}
            >
              Бүгдийг харах
            </Button>
          ) : (
            <Button
              type="default"
              disabled
              className="mx-auto mt-[20px] flex text-center font-raleway text-[14px] leading-[18px]"
            >
              Бүгдийг харах
            </Button>
          )}
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <div className="flex justify-center">
          <p>Түүх</p>
          <Badge
            className="ms-2"
            color={"#22C55E"}
            count={statusData?.stat?.notification_count}
          />
        </div>
      ),
      children: (
        <div className="mt-[-30px]">
          {notfication?.activity_list?.length > 0 ? (
            notfication?.activity_list?.map(
              (
                nt: {
                  activity_code: string;
                  description:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | React.PromiseLikeOfReactNode
                    | null
                    | undefined;
                  create_date: string | any[];
                },
                idx: any
              ) => (
                <div className="mt-2 flex border-b p-[10px]" key={`${idx}`}>
                  <div
                    className={`flex h-[40px] w-[40px] justify-center rounded-[50%] pt-2 ${
                      nt.activity_code == "wallet_bank"
                        ? "bg-[#FF563029]"
                        : "bg-[#22C55E29]"
                    }`}
                  >
                    <img
                      className="h-[22px] w-[22px]"
                      src={
                        nt.activity_code == "wallet_bank"
                          ? "/images/notfication2.svg"
                          : "/images/notficationIcon.svg"
                      }
                      alt="notfication"
                    />
                  </div>
                  <div className="ms-[10px] w-[90%]">
                    <p className="font-lato text-[15px] font-medium leading-[18px] text-[#0b0b0b]">
                      {nt?.description}
                    </p>
                    <p className="my-1 font-lato text-[14px] font-normal text-sub">
                      {nt?.create_date}
                    </p>
                  </div>
                </div>
              )
            )
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
          {notfication?.activity_list?.length > 0 &&
          notfication?.activity_list_more ? (
            <Button
              type="primary"
              className="mx-auto mt-[20px] flex h-[40px] rounded-[50px] bg-primary px-6 pt-2 text-center font-raleway text-[15px] leading-[18px]"
              onClick={() => {
                notfication?.activity_list?.length &&
                  allData(`${notfication?.activity_list?.length + 10}`);
              }}
            >
              Бүгдийг харах
            </Button>
          ) : (
            <Button
              type="default"
              disabled
              className="mx-auto mt-[20px] flex text-center font-raleway text-[14px] leading-[18px]"
            >
              Бүгдийг харах
            </Button>
          )}
        </div>
      ),
    },
  ];
  return (
    <Sider
      className={styles["sidebar-left-main"]}
      width="28%"
      breakpoint="lg"
      collapsedWidth="0"
    >
      {/* <Drawer
        title={
          <div className="my-2 font-lato text-[18px] font-semibold leading-[18px]">
            Мэдэгдэл
          </div>
        }
        width={520}
        closable={false}
        onClose={() => setOpen(false)}
        open={open}
      >
        <Tabs
          defaultActiveKey="1"
          items={items}
          className="mt-[-20px]"
          // onChange={(e) => console.log(e, "EE")}
        />
        <Drawer
          title={
            <div className="my-2 font-lato text-[18px] font-semibold leading-[18px]">
              Text
            </div>
          }
          width={520}
          closable={false}
          onClose={() => setOpenNot(false)}
          open={openNot}
        >
          <p className="mb-5 font-lato text-[16px] font-medium leading-[18px] text-[#0b0b0b]">
            {selectedNot?.title}
          </p>
          <p className="mb-5 font-lato text-[16px] font-medium leading-[18px] text-[#0b0b0b]">
            {selectedNot?.description}
          </p>
          <p className=" font-lato text-[16px] font-normal text-sub">
            {selectedNot?.create_date}
          </p>
        </Drawer>
      </Drawer> */}
      {open && (
        <div className="absolute right-[5%] top-[12%] z-50 max-h-[85vh] overflow-auto rounded-[8px] border bg-white p-[10px] drop-shadow-2xl ">
          <div className="my-2 text-center font-lato text-[18px] font-medium leading-[18px]">
            Мэдэгдэл
          </div>
          {notfication?.activity_list?.length > 0 ? (
            notfication?.activity_list?.map(
              (
                nt: {
                  activity_code: string;
                  description:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | React.PromiseLikeOfReactNode
                    | null
                    | undefined;
                  create_date: string | any[];
                },
                idx: any
              ) => (
                <div className="flex  border-b p-[10px]" key={`${idx}`}>
                  <div className="flex h-[40px] w-[40px] justify-center rounded-[50%] bg-bank pt-2">
                    <img
                      className="h-[22px] w-[22px] text-white"
                      src={
                        nt.activity_code == "wallet_bank"
                          ? "/images/notfication2.svg"
                          : "/images/notficationIcon.svg"
                      }
                      alt="notfication"
                    />
                  </div>
                  <div className="ms-[10px] w-[90%]">
                    <p className="font-lato text-[14px] font-medium leading-[18px] text-[#1A2155]">
                      {nt?.description}
                    </p>
                    <p className="font-lato text-[12px] font-medium text-sub">
                      {nt?.create_date}
                    </p>
                  </div>
                </div>
              )
            )
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
          {notfication?.activity_list?.length > 0 &&
          notfication?.activity_list_more ? (
            <Button
              type="primary"
              className="mx-auto mt-[20px] flex bg-primary text-center font-raleway text-[14px] leading-[18px]"
              onClick={() => {
                notfication?.activity_list?.length &&
                  allData(`${notfication?.activity_list?.length + 10}`);
              }}
            >
              Бүгдийг харах
            </Button>
          ) : (
            <Button
              type="default"
              disabled
              className="mx-auto mt-[20px] flex text-center font-raleway text-[14px] leading-[18px]"
            >
              Бүгдийг харах
            </Button>
          )}
        </div>
      )}
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
                      className="rounded-[20px] bg-bank p-[10px]"
                    >
                      <Col>
                        <img
                          src={
                            IsGender == "1"
                              ? "https://www.svgrepo.com/show/31050/man.svg"
                              : IsGender == "2"
                              ? "https://www.svgrepo.com/show/954/woman.svg"
                              : "https://www.svgrepo.com/show/54329/office-block.svg"
                          }
                          className="h-[30px] w-[30px] rounded-[50%]"
                          alt="profile"
                        />
                      </Col>

                      <Col flex="none">
                        <div className={styles["sidebar-right-profile-name"]}>
                          {accountInfo?.account?.first_name}
                        </div>
                      </Col>
                    </Row>
                  </Link>
                </Col>
                <Col flex="none">
                  <Row
                    align="middle"
                    justify="center"
                    onClick={() => setOpen(!open)}
                    className={`${styles["sidebar-right-notification-div"]} cursor-pointer`}
                  >
                    <Badge count={statusData?.stat?.notification_count}>
                      <Avatar size={21} src={"/images/notification.svg"} />
                    </Badge>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col span={24}>{renderNavbar}</Col>
          </Row>
        </Col>
      </Row>
    </Sider>
  );
};

export default SidebarRightComponent;

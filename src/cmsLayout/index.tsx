import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  Col,
  Drawer,
  Form,
  Image,
  Layout,
  Modal,
  Row,
} from "antd";
import SidebarRightComponent from "./SidebarRight";
import SidebarLeftComponent from "./SidebarLeft";
import PopupModal from "app/components/modal";
import styles from "app/styles/foundation.module.css";
import style from "app/styles/Header.module.css";
import { signOut } from "next-auth/react";
import { api } from "app/utils/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MenuOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAppContext } from "app/context/appContext";
import moment from "moment";
const { Header } = Layout;
const { Content } = Layout;

export const ProtectedLayout = ({ children }: any) => {
  const router = useRouter();
  const { error } = Modal;
  const [form] = Form.useForm();

  //queries
  const { data: statusData, refetch: requestStatus } =
    api.account.accountStatus.useQuery(undefined, {
      enabled: false,
      refetchOnWindowFocus: false,
    });
  const { data: accountInfo, refetch: requestInfo } =
    api.account.accountInfo.useQuery(undefined, {
      enabled: false,
      refetchOnWindowFocus: false,
    });
  const { data: dan, refetch: requestDan } =
    api.account.accountStatusDan.useQuery(undefined, {
      enabled: false,
      refetchOnWindowFocus: false,
    });

  const { data: getContent } = api.term.getContent.useQuery(
    { code: "term_of_services" },
    {
      refetchOnWindowFocus: false,
    }
  );

  //mutates
  const { mutate } = api.other.notficationSearch.useMutation();
  const { mutate: mutateChange } = api.other.notificationChange.useMutation();

  const mutateTerm = api.term.termOfServiceConfirm.useMutation();

  //states
  const [open, setOpen] = useState<boolean>(false);
  const [openDra, setOpenDra] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);
  const [warningM, setWarning] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const [notfication, setNotfication] = useState<any>();
  const [openNot, setOpenNot] = useState<boolean>(false);

  //constants
  const html = useMemo(() => {
    return getContent?.page_html;
  }, [getContent]);
  const keys = router?.asPath;
  const phoneItems = [
    {
      key: "/dashboard",
      label: <Link href="/dashboard">Дашбоард</Link>,
      icon: <img src="/images/menu.png" style={{ width: 22 }} />,
    },
    {
      key: "/dashboard/fund",
      label: <Link href="/dashboard/fund">Миний санхүүжилт</Link>,
      icon: <img src="/images/stats.png" style={{ width: 22 }} />,
    },
    {
      key: "/dashboard/myfund",
      label: <Link href="/dashboard/myfund">Миний захиалгууд</Link>,
      icon: <img src="/images/save-money.png" style={{ width: 22 }} />,
    },
    {
      key: "/dashboard/history",
      label: <Link href="/dashboard/history">Санхүүжилтийн түүх</Link>,
      icon: <img src="/images/tugrik.png" style={{ width: 22 }} />,
    },
    {
      key: "/dashboard/loan",
      label: <Link href="/dashboard/loan">Зээл авах захиалга</Link>,
      icon: <img src="/images/save-money.png" style={{ width: 22 }} />,
    },
    {
      key: "/dashboard/foundation",
      label: <Link href="/dashboard/foundation">Санхүүжилт өгөх захиалга</Link>,
      icon: <img src="/images/give-money.png" style={{ width: 22 }} />,
    },
  ];

  //functions
  useEffect(() => {
    requestStatus();
    requestDan();
    requestInfo();
    // requestTermOfServiceConfirm()
  }, []);

  useEffect(() => {
    mutate(
      {
        order: "date",
        order_up: "1",
        page: "1",
        page_size: "20",
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
  }, [accountInfo]);

  const allData = useCallback((page_size: string) => {
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
          } else {
            error({
              title:
                "Таны аюулгүй байдлыг хангах үүднээс 15 минутаас дээш хугацаанд идэвхгүй байсан тул таны холболтыг салгалаа.",
              content: <div>{data?.description || null}</div>,
              onOk: () => signOut(),
            });
            // signOut();
          }
        },
      }
    );
  }, []);

  function buttonClick() {
    window.open(dan?.https_redirect, "_blank");
  }

  const toggleChecked = () => {
    setChecked(!checked);
  };

  const handleOk = async () => {
    await form.validateFields();
    toggleChecked();

    mutateTerm.mutate(undefined, {
      onSuccess: (
        /** @type {{ success: any; loan_requests: import("react").SetStateAction<undefined>; description: any; }} */ data
      ) => {
        console.log(data, "data");

        if (data?.success) {
          requestStatus();
          if (accountInfo?.account?.user_type === "user") {
            setOpen(true);
          }
        }
      },
    });
  };

  const close = () => {
    setOpenDra(false);
  };

  const notficationWarning = useMemo(() => {
    const dt = notfication?.activity_list?.find((e: any) => {
      return e.activity_code === "lost_amount" && e.is_read === "1";
    });

    const currentDate = moment();
    const formattedDate = currentDate.format("YYYY-MM-DD");

    const regex = /^(\d{4}-\d{2}-\d{2})/;
    const match = dt?.create_date?.match(regex);

    if (match?.length > 0 && formattedDate == match[0]) {
      setWarning(true);
    }
    return dt;
  }, [html]);

  const IsGender = useMemo(() => {
    const IsGenderCheck = accountInfo?.account?.register?.slice(-2, -1);

    if (["0", "2", "4", "6", "8"].includes(IsGenderCheck)) {
      return "2";
    } else if (accountInfo?.account?.register > 10) {
      return "0";
    } else {
      if (["1", "3", "5", "7", "9"].includes(IsGenderCheck)) {
        return "1";
      }
    }
  }, [accountInfo]);

  const { contextHolder } = useAppContext();

  useEffect(() => {
    setIsModalOpen(true);
  }, [statusData, accountInfo]);

  const onRead = () => {
    mutateChange(
      {
        activityId: notficationWarning?.activity_id,
      },
      {
        onSuccess: (
          /** @type {{ success: any; loan_requests: import("react").SetStateAction<undefined>; description: any; }} */ data
        ) => {
          if (data?.success) {
            mutate(
              {
                order: "date",
                order_up: "1",
                page: "1",
                page_size: `${notfication?.activity_list?.length}`,
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
          } else {
            error({
              title: "Амжилтгүй",
              content: <div>{data?.description || null}</div>,
            });
            signOut();
          }
        },
      }
    );
  };

  return (
    <Layout>
      <PopupModal
        modalWidth={"90%"}
        open={statusData?.stat?.term_of_service_confirm == 0 && isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        buttonText={null}
        iconPath={null}
        customIconWidth={null}
        customDiv={
          <div className="border-b border-black font-beau text-[16px] font-normal text-black">
            ҮЙЛЧИЛГЭЭНИЙ ЕРӨНХИЙ НӨХЦӨЛ
          </div>
        }
        closableM={"true"}
        textAlign={"start"}
        buttonClick={null}
        text={
          <Form form={form}>
            <Row justify="center">
              <Col
                xs={24}
                lg={20}
                className="my-5 justify-center rounded-[9px] bg-bank p-[50px]"
              >
                <div dangerouslySetInnerHTML={{ __html: html }} />
              </Col>
              <Col xs={24} lg={20}>
                <Form.Item
                  name="agreement"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) =>
                        value
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error(
                                "Та үйлчилгээний нөхцөл зөвшөөрөөгүй байна."
                              )
                            ),
                    },
                  ]}
                >
                  <Checkbox>
                    <div className={styles["foundation-checkbox-text"]}>
                      ҮЙЛЧИЛГЭЭНИЙ ЕРӨНХИЙ НӨХЦӨЛ
                    </div>
                  </Checkbox>
                </Form.Item>
              </Col>

              <Col xs={24} lg={20}>
                <Row
                  justify="space-between"
                  wrap={false}
                  className="w-full gap-3"
                >
                  <Button
                    className={styles["foundation-button-back"]}
                    onClick={() => setIsModalOpen(false)}
                  >
                    <div className={styles["foundation-button-back-text"]}>
                      Буцах
                    </div>
                  </Button>
                  <Button
                    type="primary"
                    className={styles["foundation-button-contiune"]}
                    onClick={handleOk}
                    htmlType="submit"
                  >
                    Зөвшөөрөх
                  </Button>
                </Row>
              </Col>
            </Row>
          </Form>
        }
      />
      {!isModalOpen && (
        <PopupModal
          modalWidth={null}
          textAlign={null}
          open={open}
          closeModal={() => setOpen(false)}
          buttonText={"Үргэлжлүүлэх"}
          iconPath={"/images/e-mongolia"}
          customIconWidth={278}
          customDiv={null}
          closableM={"true"}
          buttonClick={buttonClick}
          text={
            "Харилцагч та зээлийн эрхийн хэмжээгээ өөрт ойр байрлах салбар нэгжид хандан нээлгэнэ үү."
          }
        />
      )}

      <PopupModal
        buttonClick={() => {
          setWarning(false);
          onRead();
        }}
        buttonText={"Хаах"}
        closableM={null}
        closeModal={null}
        customDiv={null}
        customIconWidth={null}
        iconPath={"json2"}
        modalWidth={null}
        open={warningM}
        text={
          <div>
            <p className="mb-4 text-center text-[18px] font-bold text-primary">
              Анхааруулга!
            </p>
            <p className="text-center">{notficationWarning?.description}</p>
          </div>
        }
        textAlign={"center"}
      />

      <SidebarLeftComponent setOpen={setOpenNot} />

      <Layout onClick={() => setOpenNot(false)}>
        <Header className="sticky flex w-full items-center justify-between bg-[#fff] pe-0 ps-0 lg:hidden">
          <Col span={22} className="mx-auto">
            <Row justify="space-between" align="middle">
              <Col flex="none">
                <MenuOutlined
                  onClick={() => setOpenDra(true)}
                  className="flex h-[45px] w-[45px] rounded-[10px] bg-[#F4F6FA] p-[10px] text-[30px] text-black active:text-sky-900 lg:hidden"
                />
              </Col>
              <Col flex="none">
                <Row
                  align="middle"
                  justify="center"
                  onClick={() => setOpen(true)}
                  className={`${styles["sidebar-right-notification-div"]} cursor-pointer`}
                >
                  <Badge count={notfication?.msg?.unread_count}>
                    <Avatar
                      src={"/images/notification.svg"}
                      className="h-[45px] w-[45px] rounded-[10px] bg-[#F4F6FA] p-[11px]"
                    />
                  </Badge>
                </Row>
              </Col>
            </Row>
          </Col>
        </Header>
        <Drawer
          title={<img src={"/logo.svg"} className="h w-[180px]" />}
          placement="left"
          onClose={close}
          open={openDra}
          width="min(400px,100%)"
          closable
        >
          {phoneItems.map((el, idx) => (
            <Col span={24} key={`phone-${idx}`}>
              <Row
                gutter={10}
                align="middle"
                className={
                  keys == el.key
                    ? `${style["drawer-title-div"]} bg-[#d7cee6] text-primary`
                    : style["drawer-title-div"]
                }
                onClick={() => {
                  router.push(el.key);
                  setTimeout(() => {
                    setOpenDra(false);
                  }, 300);
                }}
              >
                <div className={style["drawer-title-text"]}>{el.icon}</div>
                <div className="ms-[20px]"> {el.label}</div>
              </Row>
            </Col>
          ))}

          <div className="mt-[20px] border-t pt-[20px]">
            <Button
              onClick={() => {
                router.push("/dashboard/profile");
                setTimeout(() => {
                  setOpenDra(false);
                }, 500);
              }}
              className={`${style["drawer-title-div"]} w-full`}
            >
              <Row gutter={10} align="middle">
                <Col flex="none">
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
                <Col>{accountInfo?.account?.first_name}</Col>
              </Row>
            </Button>

            <Button
              onClick={() => {
                void signOut();
              }}
              className={`${style["drawer-title-div"]} w-full bg-red-400`}
            >
              <Row gutter={10} align="middle">
                <Col flex="none">
                  <Image
                    width="100%"
                    src={"/images/exitIcon.svg"}
                    preview={false}
                    alt="exit icon"
                  />
                </Col>
                <Col>
                  <div>Гарах</div>
                </Col>
              </Row>
            </Button>
          </div>
        </Drawer>

        <Content>
          {contextHolder}
          {children}
        </Content>
      </Layout>

      <SidebarRightComponent
        setOpen={setOpenNot}
        open={openNot}
        statusData={statusData}
      />
    </Layout>
  );
};

import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  Col,
  Drawer,
  Empty,
  Form,
  Image,
  Layout,
  Modal,
  Row,
} from "antd";
import SidebarRightComponent from "./SidebarRight";
import SidebarLeftComponent from "./SidebarLeft";
import PopupModal from "../components/modal";
import { useRequireAuth } from "app/utils/auth";
import { Loaderr } from "app/components/Loader";
import styles from "../styles/foundation.module.css";
import style from "../styles/Header.module.css";
import { signOut, useSession } from "next-auth/react";
import { ApiWrapper } from "app/context/dashboardApiContext";
import { api } from "app/utils/api";
import { useEffect, useState } from "react";
import sanitizeHtml from "sanitize-html";
import { MenuOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { useApiContext } from "src/context/dashboardApiContext";
const { Header } = Layout;
const { Content } = Layout;

export const ProtectedLayout = ({ children }: any) => {
  useRequireAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openNotf, setOpenNotf] = useState(false);
  const [openDra, setOpenDra] = useState(false);
  const [checked, setChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [notfication, setNotfication] = useState<any>();
  const [html, setHtml] = useState<any>();
  const { error } = Modal;
  const { mutate } = api.other.notficationSearch.useMutation();

  const [form] = Form.useForm();
  const { status } = useSession();

  const { data: statusData, refetch: requestStatus } =
    api.account.accountStatus.useQuery(undefined, {
      enabled: false,
    });

  const { data: accountInfo, refetch: requestInfo } =
    api.account.accountInfo.useQuery(undefined, {
      enabled: false,
    });

  const { data: dan, refetch: requestDan } =
    api.account.accountStatusDan.useQuery(undefined, {
      enabled: false,
    });

  const { data: termConfirm, refetch: requestTermOfServiceConfirm } =
    api.term.termOfServiceConfirm.useQuery(undefined, {
      enabled: false,
    });

  const { mutate: getContent } = api.term.getContent.useMutation();

  useEffect(() => {
    requestStatus();
    requestDan();
    // requestTermOfServiceConfirm()
  }, []);

  useEffect(() => {
    mutate(
      {
        order: "date",
        order_up: "1",
        page: "1",
        page_size: "3",
      },
      {
        onSuccess: (
          /** @type {{ success: any; loan_requests: import("react").SetStateAction<undefined>; description: any; }} */ data
        ) => {
          if (data?.success) {
            setNotfication(data);
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
  }, [statusData?.stat?.notification_count]);

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
  }

  function buttonClick() {
    window.open(dan?.https_redirect, "_blank");
  }

  const toggleChecked = () => {
    setChecked(!checked);
  };

  const handleOk = async () => {
    await form.validateFields();
    toggleChecked();
    setIsModalOpen(false);
    setOpen(true);
    // termConfirm();
  };

  useEffect(() => {
    getContent(
      {
        code: "term_of_services",
      },
      {
        onSuccess: (
          /** @type {{ success: any; loan_requests: import("react").SetStateAction<undefined>; description: any; }} */ data
        ) => {
          if (data?.success) {
            setHtml(sanitizeHtml(data?.page_html));
          } else {
            error({
              title: "Амжилтгүй",
              content: <div>{data?.description || null}</div>,
            });
          }
        },
      }
    );
  }, []);

  const [keys, setKeys] = useState("");
  useEffect(() => {
    if (router.isReady) {
      setKeys(router.asPath);
    }
  }, [router]);

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
      label: <Link href="/dashboard/myfund">Миний хүсэлтүүд</Link>,
      icon: <img src="/images/save-money.png" style={{ width: 22 }} />,
    },
    {
      key: "/dashboard/history",
      label: <Link href="/dashboard/history">Санхүүжилтын түүх</Link>,
      icon: <img src="/images/tugrik.png" style={{ width: 22 }} />,
    },
    {
      key: "/dashboard/loan",
      label: <Link href="/dashboard/loan">Зээл авах хүсэлт</Link>,
      icon: <img src="/images/save-money.png" style={{ width: 22 }} />,
    },
    {
      key: "/dashboard/foundation",
      label: <Link href="/dashboard/foundation">Санхүүжилт өгөх хүсэлт</Link>,
      icon: <img src="/images/give-money.png" style={{ width: 22 }} />,
    },
  ];

  const close = () => {
    setOpenDra(false);
  };

  if (status == "loading") {
    return <Loaderr />;
  }

  return (
    <Layout>
      <ApiWrapper>
        <PopupModal
          modalWidth={"70%"}
          open={statusData?.stat?.valid_dan == 0 && isModalOpen}
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
            <>
              {html && html}
              <Form form={form}>
                <Row justify="center">
                  <Col span={24}>
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
                  <Col span={24}>
                    <Row justify="space-between">
                      <Col flex="none">
                        <Button
                          className={styles["foundation-button-back"]}
                          onClick={() => setIsModalOpen(false)}
                        >
                          <div
                            className={styles["foundation-button-back-text"]}
                          >
                            Буцах
                          </div>
                        </Button>
                      </Col>
                      <Col flex="none">
                        <Form.Item>
                          <Button
                            type="primary"
                            className={`${styles["foundation-button-contiune"]} bg-primary`}
                            onClick={handleOk}
                            htmlType="submit"
                          >
                            Үргэлжлүүлэх
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Form>
            </>
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
        <SidebarLeftComponent />

        <Layout>
          <Header className="flex w-full justify-between bg-[#fff] p-[20px] lg:hidden">
            <MenuOutlined
              onClick={() => setOpenDra(true)}
              className="flex h-[45px] w-[45px] rounded-[10px] bg-[#F4F6FA] p-[10px] text-[30px] text-black active:text-sky-900 lg:hidden"
            />
            <Col flex="none">
              <Modal
                title={
                  <div className="text-center font-lato text-[18px] font-medium leading-[18px]">
                    Мэдэгдэл
                  </div>
                }
                footer={null}
                open={openNotf}
                onCancel={() => setOpenNotf(false)}
              >
                <div key={"1"}>
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
                      className="mx-auto mt-[20px] flex bg-primary text-center font-lato text-[14px] leading-[18px]"
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
                      className="mx-auto mt-[20px] flex text-center font-lato text-[14px] leading-[18px]"
                    >
                      Бүгдийг харах
                    </Button>
                  )}
                </div>
              </Modal>
              <Row
                align="middle"
                justify="center"
                onClick={() => setOpenNotf(true)}
                className={`${styles["sidebar-right-notification-div"]} cursor-pointer`}
              >
                <Badge count={statusData?.stat?.notification_count}>
                  <Avatar
                    src={"/images/notification.svg"}
                    className="h-[45px] w-[45px] rounded-[10px] bg-[#F4F6FA] p-[11px]"
                  />
                </Badge>
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
                      src="/images/profile.png"
                      className="h-[30px] w-[30px] rounded-[50%]"
                      alt="profile"
                    />
                  </Col>
                  <Col>{accountInfo?.account?.first_name}</Col>
                </Row>
              </Button>

              <Button
                onClick={() => {
                  void signOut(), router.push("/");
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

          <Content>{children}</Content>
        </Layout>
        <SidebarRightComponent statusData={statusData} />
      </ApiWrapper>
    </Layout>
  );
};

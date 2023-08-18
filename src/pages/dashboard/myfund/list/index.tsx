import { Row, Col, Table, Image, Button, Modal } from "antd";
import styles from "../../../../styles/myfund-list.module.css";
import stylesList from "../../../../styles/dashboard.module.css";
import stylesDL from "../../../../styles/dloan.module.css";
import stylesFD from "../../../../styles/foundation.module.css";
import { numberToCurrency } from "../../../../utils/number.helpers";
import { HeaderDashboard } from "../../../../components/header";
import { useAppContext } from "../../../../context/appContext";
import { useRouter } from "next/router";
import { useRequireAuth } from "app/utils/auth";
import { useApiContext } from "app/context/dashboardApiContext";
import { useEffect, useState } from "react";
import { Loaderr } from "app/components/Loader";
import { api } from "app/utils/api";
import { signOut } from "next-auth/react";

export const List = () => {
  const { myFundTabKey } = useAppContext();
  const { data } = useApiContext();
  useRequireAuth();

  const [activeClass, setSelectedId] = useState<string>();
  const [activeLoanOrders, setActiveLoanOrders] = useState<any[]>([]);
  const [activeSavingOrders, setActiveSavingOrders] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  const { error } = Modal;

  const { mutate } = api.loan.reguestSearch.useMutation();

  useEffect(() => {
    mutate(
      {
        order: "date",
        order_up: "1",
        page: "1",
        page_size: "30",
        filter_type: "active",
      },
      {
        onSuccess: (
          /** @type {{ success: any; loan_requests: import("react").SetStateAction<undefined>; description: any; }} */ data
        ) => {
          if (data?.success) {
            console.log(data);
            data?.requests?.forEach((el: any) => {
              setOrders((prev) => [...prev, el]);
              if (el.request_type == "wallet") {
                setActiveLoanOrders((prev) => [...prev, el]);
              } else if (el.request_type == "saving") {
                setActiveSavingOrders((prev) => [...prev, el]);
              }
            });
          } else {
            signOut();
            error({
              title: "Амжилтгүй",
              content: <div>{data?.description || null}</div>,
            });
          }
        },
      }
    );
  }, []);

  const myLoanOrders = activeLoanOrders?.reverse();
  const mySavingOrders = activeSavingOrders?.reverse();

  const [open, setOpen] = useState<boolean>(false);

  const router = useRouter();

  const columns: any[] = [
    {
      title: "Дараалал",
      dataIndex: "id",
      key: "request_id",
      align: "center",
      width: "6%",
      render: (id: string, data: any) => (
        <div className={stylesList["myfund-tabs-content-table-number"]}>
          {data?.is_my_request == "1" ? (
            <div className={styles["loanReq-start"]}>
              <Image width={23} src="/images/star.svg" preview={false} />
            </div>
          ) : (
            id
          )}
        </div>
      ),
    },
    {
      title: "Зээлийн хэмжээ",
      dataIndex: "loan_amount",
      key: "loan_amount",
      align: "center",
      width: "23%",
      render: (loanTotal: string, data: any) => (
        <div
          className={
            data?.is_my_request == "1"
              ? data?.request_type == "wallet"
                ? `text-[#FF0000] ${stylesList["myfund-tabs-content-table-number"]}`
                : `text-[#39DA00] ${stylesList["myfund-tabs-content-table-number"]}`
              : `text-[#000] ${stylesList["myfund-tabs-content-table-number"]}`
          }
        >
          {numberToCurrency(loanTotal)}
        </div>
      ),
    },
    {
      title: "Төрөл",
      dataIndex: "request_type",
      key: "request_type",
      align: "center",
      width: "23%",
      render: (request_type: string) =>
        request_type == "saving" ? (
          <div className={stylesList["myfund-tabs-content-table-number"]}>
            Санхүүжилт өгөх
          </div>
        ) : (
          <div className={stylesList["myfund-tabs-content-table-number"]}>
            Зээлийн хүсэлт
          </div>
        ),
    },
    {
      title: "Хүү",
      dataIndex: "rate_month",
      key: "rate_month",
      align: "center",
      width: "15%",
      render: (rate: string) => (
        <div
          className={`text-[#000] ${stylesList["myfund-tabs-content-table-number"]}`}
        >
          {rate} %
        </div>
      ),
    },
    {
      title: "Биелэлт",
      dataIndex: "filled_percent",
      key: "completion",
      align: "center",
      width: "23%",
      render: (completion: string) => (
        <div
          className={`text-[#000] ${stylesList["myfund-tabs-content-table-number"]}`}
        >
          {completion.slice(0, 3)} %
        </div>
      ),
    },
    {
      title: "Огноо",
      dataIndex: "create_date",
      key: "create_date",
      width: "10%",
      align: "center",
      render: (create_date: string) => (
        <div
          className={`text-[#000] ${stylesList["myfund-tabs-content-table-number"]}`}
        >
          {create_date.slice(10, 19)}
        </div>
      ),
    },
    {
      title: " ",
      dataIndex: "create_date",
      key: "create_date",
      width: "10%",
      align: "center",
      render: (create_date: string) => (
        <Image
          width={25}
          onClick={() => {
            setSelectedId(create_date);
            setOpen(true);
          }}
          src={"/images/info-icon.png"}
          preview={false}
          className="cursor-pointer"
          alt="Information"
        />
      ),
    },
  ];

  if (!data) {
    <Loaderr />;
  } else {
    return (
      <Row
        justify="center"
        className={styles["myfund-main-row"]}
        gutter={[0, 30]}
      >
        {
          <Col span={22}>
            <Row
              gutter={[0, 20]}
              className={styles[myFundTabKey === "2" ? "myfund-list" : ""]}
            >
              <HeaderDashboard
                title={"Зээл авах хүсэлтүүд"}
                subTitle={
                  "Харилцагч та нийт идэвхитэй хүсэлтүүд болон өөрийн өгсөн санхүүжилт болон авсан зээлтэй холбоотой мэдээллээ доорх цэсээр харна уу."
                }
              />
              <Col span={24}>
                <Table
                  scroll={{ x: 430 }}
                  columns={columns}
                  pagination={{
                    pageSize: 8,
                    position: ["bottomCenter"],
                  }}
                  dataSource={myLoanOrders}
                  rowKey={"create_date"}
                />
              </Col>
            </Row>
            <Row
              gutter={[0, 20]}
              className={styles[myFundTabKey === "1" ? "myfund-list" : ""]}
            >
              <HeaderDashboard
                title={"Санхүүжилт өгөх хүсэлтүүд"}
                subTitle={
                  "Харилцагч та нийт идэвхитэй хүсэлтүүд болон өөрийн өгсөн санхүүжилт болон авсан зээлтэй холбоотой мэдээллээ доорх цэсээр харна уу."
                }
              />
              <Col span={24}>
                <Table
                  scroll={{ x: 430 }}
                  columns={columns}
                  pagination={{
                    pageSize: 8,
                    position: ["bottomCenter"],
                  }}
                  dataSource={mySavingOrders}
                  rowKey={"create_date"}
                />
              </Col>
            </Row>
          </Col>
        }
        {
          <Col span={22}>
            <Row style={{ height: "100%" }} align="bottom">
              <Col flex="auto">
                <Button
                  className={styles["myfund-list-back-button"]}
                  onClick={() => router.back()}
                >
                  Буцах
                </Button>
              </Col>
            </Row>
          </Col>
        }
        <Modal
          open={open}
          onCancel={() => setOpen(false)}
          footer={null}
          closeIcon={null}
          width={"50%"}
          title={
            <div className="text-center font-beau text-[16px] font-medium">
              {myFundTabKey == "1"
                ? "Зээлийн хүсэлт дэлгэрэнгүй"
                : "Санхүүжилт хүсэлт дэлгэрэнгүй"}
            </div>
          }
        >
          {activeClass &&
            orders.map(
              (o: any, idx: number) =>
                o.create_date == activeClass && (
                  <div key={`${idx}`}>
                    <Col span={22} key={`${idx}`} className="mx-auto w-full">
                      <Col className="mt-[20px]">
                        <Row
                          className={stylesDL["dloan-detail"]}
                          gutter={[0, 22]}
                        >
                          <Col span={24}>
                            <Row justify="space-between" align="middle">
                              <Col flex="none">
                                <div
                                  className={
                                    o.request_type == "saving"
                                      ? stylesFD["foundation-detail-text"]
                                      : stylesDL["dloan-detail-text"]
                                  }
                                >
                                  {myFundTabKey == "1"
                                    ? "Үндсэн зээлийн хэмжээ"
                                    : "Санхүүжилтын хэмжээ"}
                                </div>
                              </Col>
                              <Col flex="none">
                                <div
                                  className={stylesDL["dloan-detail-maxValue"]}
                                >
                                  {numberToCurrency(Math.round(o.loan_amount))}
                                </div>
                              </Col>
                            </Row>
                          </Col>

                          {myFundTabKey == "2" && (
                            <Col span={24}>
                              <Row justify="space-between" align="middle">
                                <Col flex="none">
                                  <div
                                    className={stylesDL["dloan-detail-text"]}
                                  >
                                    Хүүгийн ашиг
                                  </div>
                                </Col>
                                <Col flex="none">
                                  <div
                                    className={
                                      o.request_type == "saving"
                                        ? stylesFD["foundation-rate-profit"]
                                        : stylesDL["dloan-rate-profit"]
                                    }
                                  >
                                    {numberToCurrency(
                                      Math.round(
                                        (o.filled_amount / 100) *
                                          Number(o.rate_day) *
                                          Number(o.duration)
                                      )
                                    )}
                                  </div>
                                </Col>
                              </Row>
                            </Col>
                          )}
                          {myFundTabKey == "2" && (
                            <Col span={24}>
                              <Row justify="space-between" align="middle">
                                <Col flex="none">
                                  <div
                                    className={stylesDL["dloan-detail-text"]}
                                  >
                                    Татвар
                                  </div>
                                </Col>
                                <Col flex="none">
                                  <div
                                    className={stylesDL["dloan-rate-profit"]}
                                  >
                                    {numberToCurrency(
                                      Math.round(
                                        Number(o.balance_amount / 100) *
                                          Number(o.rate_day) *
                                          Number(o.duration) *
                                          0.1
                                      )
                                    )}
                                  </div>
                                </Col>
                              </Row>
                            </Col>
                          )}
                          <Col span={24}>
                            <Row justify="space-between" align="middle">
                              <Col flex="none">
                                <div className={stylesDL["dloan-detail-text"]}>
                                  Хүүгийн хэмжээ
                                </div>
                              </Col>
                              <Col flex="none">
                                <div
                                  className={
                                    o.request_type == "saving"
                                      ? stylesFD["foundation-rate-profit"]
                                      : stylesDL["dloan-rate-profit"]
                                  }
                                >
                                  {o.rate_month} %
                                </div>
                              </Col>
                            </Row>
                          </Col>
                          {myFundTabKey == "1" && (
                            <Col span={24}>
                              <Row justify="space-between" align="middle">
                                <Col flex="none">
                                  <div
                                    className={stylesDL["dloan-detail-text"]}
                                  >
                                    Зээл олголтын шимтгэл
                                  </div>
                                </Col>
                                <Col flex="none">
                                  <div
                                    className={
                                      o.request_type == "saving"
                                        ? stylesFD["foundation-rate-profit"]
                                        : stylesDL["dloan-rate-profit"]
                                    }
                                  >
                                    {numberToCurrency(
                                      Math.round(
                                        Number(o.loan_amount / 100) *
                                          Number(o.fee_percent)
                                      )
                                    )}
                                  </div>
                                </Col>
                              </Row>
                            </Col>
                          )}
                          {myFundTabKey == "1" && (
                            <Col span={24}>
                              <Row justify="space-between" align="middle">
                                <Col flex="none">
                                  <div
                                    className={stylesDL["dloan-detail-text"]}
                                  >
                                    Нийт төлөх зээлийн хэмжээ
                                  </div>
                                </Col>
                                <Col flex="none">
                                  <div
                                    className={
                                      stylesDL["dloan-detail-maxValue"]
                                    }
                                  >
                                    {numberToCurrency(
                                      Math.ceil(
                                        (o.loan_amount / 100) *
                                          o.rate_day *
                                          Number(o.duration) +
                                          Number(o.loan_amount) +
                                          (o.loan_amount / 100) *
                                            Number(o.fee_percent)
                                      )
                                    )}
                                  </div>
                                </Col>
                              </Row>
                            </Col>
                          )}
                          <Col span={24}>
                            <Row justify="space-between" align="middle">
                              <Col flex="none">
                                <div className={stylesDL["dloan-detail-text"]}>
                                  Хугацаа
                                </div>
                              </Col>
                              <Col flex="none">
                                <div
                                  className={stylesDL["dloan-detail-maxValue"]}
                                >
                                  {o.duration} хоног
                                </div>
                              </Col>
                            </Row>
                          </Col>
                          {myFundTabKey == "1" && (
                            <Col span={24}>
                              <Row justify="space-between" align="middle">
                                <Col flex="none">
                                  <div
                                    className={stylesDL["dloan-detail-text"]}
                                  >
                                    Эргэн төлөгдөх хугацаа
                                  </div>
                                </Col>
                                <Col flex="none">
                                  <div
                                    className={
                                      stylesDL["dloan-detail-maxValue"]
                                    }
                                  >
                                    {o.expire_date}
                                  </div>
                                </Col>
                              </Row>
                            </Col>
                          )}
                        </Row>
                      </Col>
                    </Col>
                    {o.is_my_request == "1" && (
                      <Col span={22} className="mx-auto w-full">
                        <Col className="mt-[20px]">
                          <Row
                            className={stylesDL["dloan-detail"]}
                            gutter={[0, 22]}
                          >
                            <Col span={24}>
                              <p className="font-tahoma text-[12px] font-normal text-[#0300B4]">
                                {myFundTabKey == "2"
                                  ? "САНХҮҮЖИЛТ ӨГӨХ ЗАХИАЛГЫН НӨХЦӨЛ"
                                  : "ЗЭЭЛ АВАХ ЗАХИАЛГЫН НӨХЦӨЛ"}
                              </p>
                              <p className="pt-[5px] font-lato text-[10px] font-light">
                                Итгэлцэл үйлчилгээ гэдэг нь харилцагч таны
                                хөрөнгийг итгэлцлийн үндсэн дээр гэрээ байгуулан
                                авч зах зээлийн эрсдэл үнэгүйдлээс хамгаалж
                                өндөр үр шим /ашиг/ олж өгөх зорилгоор харилцан
                                ашигтай хамтран ажиллах үйлчилгээ юм. Итгэлцлийн
                                хөрөнгө нь ямар ч төрөл, хэлбэр, үнэлгээтэй байж
                                болох ба түүний үр шимийг хоёр тал өөрсдийн
                                хэрэгцээнд тулгуурлан харилцан ашигтай ажиллах
                                боломжийг олгодог санхүүгийн хэрэгсэл юм.
                                <br />
                                Итгэлцлийн үйлчилгээний оролцогч талууд
                                <br />
                                Итгэмжлэгч – Хөрөнгөө удирдах, захиран зарцуулах
                                эрхээ гэрээний үндсэн дээр бусдад шилжүүлж
                                түүнээс үүсэх үр шимийг хүртэгч.
                                <br /> Хувь хүртэгч – Итгэмжлэгчтэй байгуулсан
                                гэрээний дагуу итгэмжлэгдсэн хөрөнгийн үр шимийг
                                хүртэгч. Гэхдээ энэ нь итгэмжлэгдсэн хөрөнгийн
                                эзэмшигч, захиран зарцуулах эрх бүхий этгээд биш
                                юм.
                                <br /> Итгэмжлэгдэгч – Хувь хүн, Бизнес эрхлэгч,
                                Аж ахуй нэгжийн аль нь ч байж болох ба
                                итгэмжлэгчтэй байгуулсан хөрөнгө удирдах
                                гэрээний дагуу хөрөнгийн үнэ цэнийг өсгөх,
                                хадгалах, үр өгөөж бий болгогч.
                              </p>
                            </Col>
                          </Row>
                        </Col>
                      </Col>
                    )}

                    <Row className="mt-[20px]">
                      {activeClass && (
                        <Button
                          type="primary"
                          className={`${stylesDL["dloan-button-back"]} bg-primary text-[#fff]`}
                          onClick={() => {
                            setSelectedId("");
                            setOpen(false);
                          }}
                        >
                          <Col flex={"auto"}>
                            <div className={styles["dloan-change-button-text"]}>
                              Хаах
                            </div>
                          </Col>
                        </Button>
                      )}
                    </Row>
                  </div>
                )
            )}
        </Modal>
      </Row>
    );
  }
};

export default List;

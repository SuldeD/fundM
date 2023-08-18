import { Row, Col, Tabs, Table, Image, Button, Modal } from "antd";
import styles from "../../../styles/my-fund.module.css";
import stylesList from "../../../styles/dashboard.module.css";
import stylesDL from "../../../styles/dloan.module.css";
import stylesFD from "../../../styles/foundation.module.css";
import { numberToCurrency } from "../../../utils/number.helpers";
import { HeaderDashboard } from "../../../components/header";
import { useAppContext } from "../../../context/appContext";
import { useRequireAuth } from "app/utils/auth";
import { useApiContext } from "app/context/dashboardApiContext";
import { useEffect, useState } from "react";
import { Loaderr } from "app/components/Loader";
import { api } from "app/utils/api";
import { signOut } from "next-auth/react";

export const MyFund = () => {
  const { myFundTabKey, setMyFundTabKey } = useAppContext();
  const { data } = useApiContext();
  useRequireAuth();
  const { mutate } = api.loan.reguestSearch.useMutation();
  const { error } = Modal;

  const [activeClass, setSelectedId] = useState<any>();
  const [open, setOpen] = useState<boolean>(false);

  const [myLoanOrders, setMyActiveLoanOrders] = useState<any[]>([]);
  const [mySavingOrders, setMyActiveSavingOrders] = useState<any[]>([]);

  const [myLoanOrdersSum, setMyActiveLoanOrdersSum] = useState<number>(0);
  const [mySavingOrdersSum, setMyActiveSavingOrdersSum] = useState<number>(0);

  const [sumMySaving, setSumMySaving] = useState<number>(0);
  const [sumMyLoan, setSumMyLoan] = useState<number>(0);

  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    mutate(
      {
        order: "date",
        order_up: "1",
        page: "1",
        page_size: "30",
        filter_type: "my",
      },
      {
        onSuccess: (
          /** @type {{ success: any; loan_requests: import("react").SetStateAction<undefined>; description: any; }} */ data
        ) => {
          if (data?.success) {
            data?.requests?.forEach((el: any) => {
              setOrders((prev) => [...prev, el]);
              if (el.filled_percent.slice(0, 3) != "100") {
                if (el.request_type == "wallet") {
                  setMyActiveLoanOrders((prev) => [...prev, el]);
                  setMyActiveLoanOrdersSum(
                    (prev) => prev + Number(el.filled_percent.slice(0, 3))
                  );
                  setSumMyLoan((prev) => prev + Number(el.loan_amount));
                } else if (el.request_type == "saving") {
                  setMyActiveSavingOrders((prev) => [...prev, el]);
                  setMyActiveSavingOrdersSum(
                    (prev) => prev + Number(el.filled_percent.slice(0, 3))
                  );
                  setSumMySaving((prev) => prev + Number(el.loan_amount));
                }
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

  const columns: any[] = [
    {
      title: "Дараалал",
      dataIndex: "id",
      key: "IsActive",
      align: "center",
      width: "6%",
      render: (id: string) => (
        <div className={styles["myfund-tabs-content-table-id"]}>{id}</div>
      ),
    },
    {
      title: "Зээлийн хэмжээ",
      dataIndex: "loan_amount",
      key: "loan_amount",
      align: "center",
      width: "23%",
      render: (loanTotal: string) => (
        <div className={styles["myfund-tabs-content-table-number"]}>
          {numberToCurrency(loanTotal)}
        </div>
      ),
    },
    {
      title: "Төрөл",
      dataIndex: "request_type",
      key: "product_type_code",
      align: "center",
      width: "23%",
      render: (product_type_code: string) =>
        product_type_code == "saving" ? (
          <div className={stylesList["dashboard-list-item-type-2"]}>
            Өгөх хүсэлт
          </div>
        ) : (
          <div className={stylesList["dashboard-list-item-type-1"]}>
            Авах хүсэлт
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
        <div className={styles["myfund-tabs-content-table-number"]}>
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
        <div className={styles["myfund-tabs-content-table-number"]}>
          {completion.slice(0, 3)} %
        </div>
      ),
    },
    {
      title: " ",
      dataIndex: "create_date",
      key: "create_date",
      width: "10%",
      align: "center",
      render: (create_date: string, data: any) => (
        <Image
          width={25}
          src={"/images/info-icon.png"}
          preview={false}
          alt="Information"
          className="cursor-pointer"
          onClick={() => {
            setSelectedId(data?.id);
            setOpen(true);
          }}
        />
      ),
    },
  ];

  const items = [
    {
      key: "1",
      label: "Зээл авах хүсэлт",
      children: (
        <Col span={24}>
          <Row
            gutter={[0, 30]}
            justify="space-between"
            className={styles["myfund-tabs-content-border"]}
          >
            <Col flex="none">
              <div className={styles["myfund-tabs-content-title"]}>
                Оруулсан хүсэлтийн хэмжээ
              </div>
              <div className={styles["myfund-tabs-1-content-money"]}>
                {numberToCurrency(sumMyLoan)}
              </div>
            </Col>
            <Col flex="none">
              <div className={styles["myfund-tabs-content-title"]}>
                Биржийн хүү
              </div>
              <div className={styles["myfund-tabs-content-rate"]}>
                {myLoanOrders && myLoanOrders[0]?.rate_month
                  ? myLoanOrders[0]?.rate_month
                  : "0"}{" "}
                %
              </div>
            </Col>
            <Col flex="none">
              <div className={styles["myfund-tabs-content-title"]}>Биелэлт</div>
              <div className={styles["myfund-tabs-content-rate"]}>
                {myLoanOrders.length > 0
                  ? myLoanOrdersSum / myLoanOrders.length
                  : 0}{" "}
                %
              </div>
            </Col>
            <Col flex="none">
              <div className={styles["myfund-tabs-content-title"]}>
                Биелээгүй мөнгөн дүн
              </div>
              <div className={styles["myfund-tabs-content-rate"]}>
                {myLoanOrders.length > 0
                  ? numberToCurrency(
                      sumMyLoan * (myLoanOrdersSum / myLoanOrders.length / 100)
                    )
                  : numberToCurrency(0)}
              </div>
            </Col>
            <Col span={24}>
              <Table
                scroll={{ x: 430 }}
                columns={columns}
                pagination={{
                  pageSize: 10,
                  position: ["bottomCenter"],
                }}
                dataSource={myLoanOrders.reverse()}
                rowKey={"create_date"}
              />
            </Col>
          </Row>
        </Col>
      ),
    },
    {
      key: "2",
      label: "Санхүүжилт өгөх хүсэлт",
      children: (
        <Row gutter={[0, 30]} justify="center">
          <Col span={24}>
            <Row
              justify="space-between"
              gutter={[0, 30]}
              className={styles["myfund-tabs-content-border"]}
            >
              <Col flex="none">
                <div className={styles["myfund-tabs-content-title"]}>
                  Оруулсан хүсэлтийн хэмжээ
                </div>
                <div className={styles["myfund-tabs-2-content-money"]}>
                  {numberToCurrency(sumMySaving)}
                </div>
              </Col>
              <Col flex="none">
                <div className={styles["myfund-tabs-content-title"]}>
                  Биржийн хүү
                </div>
                <div className={styles["myfund-tabs-content-rate"]}>
                  {mySavingOrders && mySavingOrders[0]?.rate_month
                    ? mySavingOrders[0]?.rate_month
                    : "0"}{" "}
                  %
                </div>
              </Col>
              <Col flex="none">
                <div className={styles["myfund-tabs-content-title"]}>
                  Нийт биелэлт
                </div>
                <div className={styles["myfund-tabs-content-rate"]}>
                  {mySavingOrders.length > 0
                    ? mySavingOrdersSum / mySavingOrders.length
                    : 0}{" "}
                  %
                </div>
              </Col>
              <Col flex="none">
                <div className={styles["myfund-tabs-content-title"]}>
                  Биелээгүй мөнгөн дүн
                </div>
                <div className={styles["myfund-tabs-content-rate"]}>
                  {mySavingOrders.length > 0
                    ? numberToCurrency(
                        sumMySaving -
                          sumMySaving *
                            (mySavingOrdersSum / mySavingOrders.length / 100)
                      )
                    : numberToCurrency(sumMySaving)}
                </div>
              </Col>
              <Col span={24}>
                <Table
                  scroll={{ x: 430 }}
                  columns={columns}
                  pagination={{
                    pageSize: 10,
                    position: ["bottomCenter"],
                  }}
                  dataSource={mySavingOrders.reverse()}
                  rowKey={"create_date"}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      ),
    },
  ];

  if (!data) {
    <Loaderr />;
  } else {
    return (
      <Row justify="center" className={styles["myfund-main-row"]}>
        <Col span={22}>
          <Row gutter={[0, 20]}>
            <HeaderDashboard
              title={"Миний хүсэлтүүд"}
              subTitle={
                "Харилцагч та нийт идэвхитэй хүсэлтүүд болон өөрийн өгсөн санхүүжилт болон авсан зээлтэй холбоотой мэдээллээ доорх цэсээр харна уу."
              }
            />

            <Col span={24}>
              <Tabs
                activeKey={myFundTabKey}
                onChange={(key) => setMyFundTabKey(key)}
                items={items}
                tabBarGutter={0}
              />
            </Col>

            <Modal
              open={open}
              onCancel={() => setOpen(false)}
              footer={null}
              closeIcon={null}
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
                    o.id == activeClass && (
                      <div key={`${idx}`}>
                        <Col
                          span={22}
                          key={`${idx}`}
                          className="mx-auto w-full"
                        >
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
                                      className={
                                        stylesDL["dloan-detail-maxValue"]
                                      }
                                    >
                                      {numberToCurrency(o.loan_amount)}
                                    </div>
                                  </Col>
                                </Row>
                              </Col>

                              {myFundTabKey == "2" && (
                                <Col span={24}>
                                  <Row justify="space-between" align="middle">
                                    <Col flex="none">
                                      <div
                                        className={
                                          stylesDL["dloan-detail-text"]
                                        }
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
                                            Number(o.balance_amount / 100) *
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
                                        className={
                                          stylesDL["dloan-detail-text"]
                                        }
                                      >
                                        Татвар
                                      </div>
                                    </Col>
                                    <Col flex="none">
                                      <div
                                        className={
                                          stylesDL["dloan-rate-profit"]
                                        }
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
                                    <div
                                      className={stylesDL["dloan-detail-text"]}
                                    >
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
                                        className={
                                          stylesDL["dloan-detail-text"]
                                        }
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
                                            (o.loan_amount / 100) *
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
                                        className={
                                          stylesDL["dloan-detail-text"]
                                        }
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
                                    <div
                                      className={stylesDL["dloan-detail-text"]}
                                    >
                                      Хугацаа
                                    </div>
                                  </Col>
                                  <Col flex="none">
                                    <div
                                      className={
                                        stylesDL["dloan-detail-maxValue"]
                                      }
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
                                        className={
                                          stylesDL["dloan-detail-text"]
                                        }
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
                                        {o.create_date.slice(0, 10)}
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
                                    хөрөнгийг итгэлцлийн үндсэн дээр гэрээ
                                    байгуулан авч зах зээлийн эрсдэл үнэгүйдлээс
                                    хамгаалж өндөр үр шим /ашиг/ олж өгөх
                                    зорилгоор харилцан ашигтай хамтран ажиллах
                                    үйлчилгээ юм. Итгэлцлийн хөрөнгө нь ямар ч
                                    төрөл, хэлбэр, үнэлгээтэй байж болох ба
                                    түүний үр шимийг хоёр тал өөрсдийн
                                    хэрэгцээнд тулгуурлан харилцан ашигтай
                                    ажиллах боломжийг олгодог санхүүгийн
                                    хэрэгсэл юм.
                                    <br />
                                    Итгэлцлийн үйлчилгээний оролцогч талууд
                                    <br />
                                    Итгэмжлэгч – Хөрөнгөө удирдах, захиран
                                    зарцуулах эрхээ гэрээний үндсэн дээр бусдад
                                    шилжүүлж түүнээс үүсэх үр шимийг хүртэгч.
                                    <br /> Хувь хүртэгч – Итгэмжлэгчтэй
                                    байгуулсан гэрээний дагуу итгэмжлэгдсэн
                                    хөрөнгийн үр шимийг хүртэгч. Гэхдээ энэ нь
                                    итгэмжлэгдсэн хөрөнгийн эзэмшигч, захиран
                                    зарцуулах эрх бүхий этгээд биш юм.
                                    <br /> Итгэмжлэгдэгч – Хувь хүн, Бизнес
                                    эрхлэгч, Аж ахуй нэгжийн аль нь ч байж болох
                                    ба итгэмжлэгчтэй байгуулсан хөрөнгө удирдах
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
                                <div
                                  className={styles["dloan-change-button-text"]}
                                >
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
        </Col>
      </Row>
    );
  }
};

export default MyFund;

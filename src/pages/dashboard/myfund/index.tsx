import { Row, Col, Tabs, Table, Image, Button, Modal, Progress } from "antd";
import styles from "../../../styles/my-fund.module.css";
import stylesList from "../../../styles/dashboard.module.css";
import stylesDL from "../../../styles/dloan.module.css";
import stylesFD from "../../../styles/foundation.module.css";
import { numberToCurrency } from "../../../utils/number.helpers";
import { HeaderDashboard } from "../../../components/header";
import { useAppContext } from "../../../context/appContext";
import { useRequireAuth } from "app/utils/auth";
import { useMemo, useState } from "react";
import { Loaderr } from "app/components/Loader";
import { api } from "app/utils/api";
import { useSession } from "next-auth/react";

export const MyFund = () => {
  const { myFundTabKey, setMyFundTabKey } = useAppContext();
  const { data } = useSession();
  useRequireAuth();

  //queries
  const { data: requestSearch } = api.loan.reguestSearch.useQuery(
    {
      order: "date",
      order_up: "1",
      page: "1",
      page_size: "30",
      filter_type: "my",
    },
    { refetchOnWindowFocus: false }
  );

  //states
  const [activeClass, setSelectedId] = useState<string>();
  const [open, setOpen] = useState<boolean>(false);

  //constants
  const orders = useMemo(() => {
    return requestSearch?.requests;
  }, [requestSearch]);

  const mySavingOrders = useMemo(() => {
    return requestSearch?.requests?.filter(
      (el: any) =>
        el.filled_percent.slice(0, 3) != "100" && el.request_type == "saving"
    )
      ? requestSearch?.requests?.filter(
          (el: any) =>
            el.filled_percent.slice(0, 3) != "100" &&
            el.request_type == "saving"
        )
      : [];
  }, [requestSearch]);

  const myLoanOrders = useMemo(() => {
    return requestSearch?.requests?.filter(
      (el: any) =>
        el.filled_percent.slice(0, 3) != "100" && el.request_type == "wallet"
    )
      ? requestSearch?.requests?.filter(
          (el: any) =>
            el.filled_percent.slice(0, 3) != "100" &&
            el.request_type == "wallet"
        )
      : [];
  }, [requestSearch]);

  const sumMyLoan = useMemo(() => {
    if (!requestSearch || !requestSearch.requests) {
      return 0;
    }
    let num = 0;
    const filteredRequests = requestSearch.requests.filter((el: any) => {
      if (
        el.filled_percent.slice(0, 3) !== "100" &&
        el.request_type === "wallet"
      ) {
        num += Number(el.loan_amount);
        return true;
      }
      return false;
    });
    return Math.round(num);
  }, [requestSearch]);
  const sumMySaving = useMemo(() => {
    if (!requestSearch || !requestSearch.requests) {
      return 0;
    }
    let num = 0;
    const filteredRequests = requestSearch.requests.filter((el: any) => {
      if (
        el.filled_percent.slice(0, 3) !== "100" &&
        el.request_type === "saving"
      ) {
        num += Number(el.loan_amount);
        return true;
      }
      return false;
    });

    return Math.round(num);
  }, [requestSearch]);

  const myLoanOrdersSum = useMemo(() => {
    if (!requestSearch || !requestSearch.requests) {
      return 0; // Return 0 if the data is not available
    }

    let num = 0;

    const filteredRequests = requestSearch.requests.filter((el: any) => {
      if (
        el.filled_percent.slice(0, 3) !== "100" &&
        el.request_type === "wallet"
      ) {
        num += parseFloat(el.filled_percent); // Accumulate filled_percent
        return true; // Include this request in the filtered list
      }
      return false; // Exclude this request from the filtered list
    });

    return num; // Return the accumulated sum of filled_percent values
  }, [requestSearch]);

  const mySavingOrdersSum = useMemo(() => {
    if (!requestSearch || !requestSearch.requests) {
      return 0; // Return 0 if the data is not available
    }

    let num = 0;

    const filteredRequests = requestSearch.requests.filter((el: any) => {
      if (
        el.filled_percent.slice(0, 3) !== "100" &&
        el.request_type === "saving"
      ) {
        num += parseFloat(el.filled_percent); // Accumulate filled_percent
        return true; // Include this request in the filtered list
      }
      return false; // Exclude this request from the filtered list
    });

    return num; // Return the accumulated sum of filled_percent values
  }, [requestSearch]);

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
          {Math.round(Number(completion))} %
        </div>
      ),
    },
    {
      title: " ",
      dataIndex: "id",
      key: "create_date",
      width: "10%",
      align: "center",
      render: (id: string) => (
        <Image
          width={25}
          src={"/images/info-icon.png"}
          preview={false}
          alt="Information"
          className="cursor-pointer"
          onClick={() => {
            setSelectedId(id);
            setOpen(true);
          }}
        />
      ),
    },
  ];

  const columns1: any[] = [
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
      title: "Санхүүжилтийн хэмжээ",
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
          {Math.round(Number(completion))} %
        </div>
      ),
    },
    {
      title: " ",
      dataIndex: "id",
      key: "create_date",
      width: "10%",
      align: "center",
      render: (id: string) => (
        <Image
          width={25}
          src={"/images/info-icon.png"}
          preview={false}
          alt="Information"
          className="cursor-pointer"
          onClick={() => {
            setSelectedId(id);
            setOpen(true);
          }}
        />
      ),
    },
  ];

  console.log(orders);

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
                  ? Math.round(myLoanOrdersSum / myLoanOrders.length)
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
                      Math.round(
                        sumMyLoan -
                          (sumMyLoan * myLoanOrdersSum) /
                            myLoanOrders.length /
                            100
                      )
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
                dataSource={myLoanOrders?.reverse()}
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
                    ? Math.round(mySavingOrdersSum / mySavingOrders.length)
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
                        Math.round(
                          sumMySaving -
                            sumMySaving *
                              (mySavingOrdersSum / mySavingOrders.length / 100)
                        )
                      )
                    : numberToCurrency(sumMySaving)}
                </div>
              </Col>
              <Col span={24}>
                <Table
                  scroll={{ x: 430 }}
                  columns={columns1}
                  pagination={{
                    pageSize: 10,
                    position: ["bottomCenter"],
                  }}
                  dataSource={mySavingOrders?.reverse()}
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
                "Харилцагч та өөрийн санхүүжилт өгөх болон зээл авах хүсэлтийн талаарх мэдээллээ доорх цэсээр харна уу."
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
                                          Math.ceil(
                                            Number(o.loan_amount / 100) *
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
                                            Number(o.loan_amount / 100) *
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

                        <Col className="mx-auto mt-[20px]" span={22}>
                          {activeClass && (
                            <Button
                              type="default"
                              className={stylesDL["dloan-button-back"]}
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
                        </Col>
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

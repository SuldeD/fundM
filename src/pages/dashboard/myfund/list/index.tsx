import { Row, Col, Table, Image, Button, Modal } from "antd";
import styles from "app/styles/myfund-list.module.css";
import stylesList from "app/styles/dashboard.module.css";
import stylesDL from "app/styles/dloan.module.css";
import stylesFD from "app/styles/foundation.module.css";
import { numberToCurrency } from "app/utils/number.helpers";
import { HeaderDashboard } from "app/components/header";
import { useAppContext } from "app/context/appContext";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { api } from "app/utils/api";
import { useSession } from "next-auth/react";

export const List = () => {
  const router = useRouter();
  const { myFundTabKey } = useAppContext();
  const { status } = useSession();

  //queries
  const { data: getContentLoan } = api.term.getContent.useQuery(
    {
      code: "loan",
    },
    { refetchOnWindowFocus: false }
  );

  const { data: getContentFound } = api.term.getContent.useQuery(
    {
      code: "saving",
    },
    { refetchOnWindowFocus: false }
  );

  const getContentLoanHtml = useMemo(() => {
    return getContentLoan && getContentLoan?.page_html;
  }, [getContentLoan]);

  const getContentFoundHtml = useMemo(() => {
    return getContentFound && getContentFound?.page_html;
  }, [getContentFound]);

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
  const [activeClass, setSelectedId] = useState<string>();
  const [open, setOpen] = useState<boolean>(false);

  //constants
  const orders = useMemo(() => {
    return requestSearch?.requests;
  }, [requestSearch]);

  const mySavingOrders = useMemo(() => {
    const arr: any = [];
    const filteredData = orders?.filter(
      (el: any) =>
        el.filled_percent.slice(0, 3) != "100" && el.request_type == "saving"
    );
    filteredData?.map((el: any, idx: number) =>
      arr.push({ ...el, idx: idx + 1 })
    );
    return arr;
  }, [requestSearch]);

  const myLoanOrders = useMemo(() => {
    const arr: any = [];
    const filteredData = orders?.filter(
      (el: any) =>
        el.filled_percent.slice(0, 3) != "100" && el.request_type == "wallet"
    );
    filteredData?.map((el: any, idx: number) =>
      arr.push({ ...el, idx: idx + 1 })
    );
    return arr;
  }, [requestSearch]);

  const columns: any[] = [
    {
      title: "Дараалал",
      dataIndex: "idx",
      key: "requst_id",
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
            Зээлийн захиалга
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
          {Math.round(Number(completion))} %
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
      dataIndex: "id",
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

  const columns1: any[] = [
    {
      title: "Дараалал",
      dataIndex: "idx",
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
      title: "Санхүүжилтийн хэмжээ",
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
            Зээлийн захиалга
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
          {Math.round(Number(completion))} %
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
      dataIndex: "id",
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
  if (status == "loading") {
    return null;
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
                title={"Зээл авах захиалгууд"}
                subTitle={
                  "Харилцагч та нийт идэвхитэй захиалгууд болон өөрийн өгсөн санхүүжилт болон авсан зээлтэй холбоотой мэдээллээ доорх цэсээр харна уу."
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
                title={"Санхүүжилт өгөх захиалгууд"}
                subTitle={
                  "Харилцагч та нийт идэвхитэй захиалгууд болон өөрийн өгсөн санхүүжилт болон авсан зээлтэй холбоотой мэдээллээ доорх цэсээр харна уу."
                }
              />
              <Col span={24}>
                <Table
                  scroll={{ x: 430 }}
                  columns={columns1}
                  pagination={{
                    pageSize: 8,
                    position: ["bottomCenter"],
                  }}
                  dataSource={mySavingOrders?.reverse()}
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
                ? "Зээлийн захиалгууд дэлгэрэнгүй"
                : "Санхүүжилт захиалгууд дэлгэрэнгүй"}
            </div>
          }
        >
          {activeClass &&
            orders.map(
              (o: any, idx: number) =>
                o.id == activeClass && (
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
                                    : "Санхүүжилтийн хэмжээ"}
                                </div>
                              </Col>
                              <Col flex="none">
                                <div
                                  className={stylesDL["dloan-detail-maxValue"]}
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
                                      Math.ceil(
                                        Number(o.loan_amount / 100) *
                                          Number(o.rate_day) *
                                          Number(
                                            o.duration_type === "M"
                                              ? o.duration * 30
                                              : o.duration
                                          )
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
                                        Number(o.loan_amount / 100) *
                                          Number(o.rate_day) *
                                          Number(
                                            o.duration_type === "M"
                                              ? o.duration * 30
                                              : o.duration
                                          ) *
                                          0.1
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
                                    Зээлийн хүү (төгрөгөөр)
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
                                          Number(o.rate_day) *
                                          Number(
                                            o.duration_type === "M"
                                              ? o.duration * 30
                                              : o.duration
                                          )
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
                                    Нийт
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
                                          Number(
                                            o.duration_type === "M"
                                              ? o.duration * 30
                                              : o.duration
                                          ) +
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
                          {myFundTabKey == "2" && (
                            <Col span={24}>
                              <Row justify="space-between" align="middle">
                                <Col flex="none">
                                  <div
                                    className={stylesDL["dloan-detail-text"]}
                                  >
                                    Нийт
                                  </div>
                                </Col>
                                <Col flex="none">
                                  <div
                                    className={
                                      stylesDL["dloan-detail-maxValue"]
                                    }
                                  >
                                    {numberToCurrency(
                                      Math.round(
                                        (o.loan_amount / 100) *
                                          Number(o.rate_day) *
                                          Number(
                                            o.duration_type === "M"
                                              ? o.duration * 30
                                              : o.duration
                                          ) -
                                          Number(o.loan_amount / 100) *
                                            Number(o.rate_day) *
                                            Number(
                                              o.duration_type === "M"
                                                ? o.duration * 30
                                                : o.duration
                                            ) *
                                            0.1 +
                                          Number(o.loan_amount)
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
                                  Хүүгийн хэмжээ (хувь)
                                </div>
                              </Col>
                              <Col flex="none">
                                <div
                                  className={stylesDL["dloan-detail-maxValue"]}
                                >
                                  {o.rate_month} %
                                </div>
                              </Col>
                            </Row>
                          </Col>
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
                                  {o.duration}{" "}
                                  {o.duration_type === "M" ? "сар" : "хоног"}
                                </div>
                              </Col>
                            </Row>
                          </Col>{" "}
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
                                    className={stylesDL["dloan-detail-text"]}
                                  >
                                    Зээлийн төлөлт хийх өдөр
                                  </div>
                                </Col>
                                <Col flex="none">
                                  <div
                                    className={
                                      stylesDL["dloan-detail-maxValue"]
                                    }
                                  >
                                    {o.expire_date.slice(0, 10)}
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
                              <p className="pt-[5px] font-lato text-[14px] font-light">
                                {myFundTabKey == "2" ? (
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: getContentFoundHtml,
                                    }}
                                  />
                                ) : (
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: getContentLoanHtml,
                                    }}
                                  />
                                )}
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
                            <div className={styles["dloan-change-button-text"]}>
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
    );
  }
};

export default List;

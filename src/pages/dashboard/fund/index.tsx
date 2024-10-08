import { Row, Col, Tabs, Table, Image, Button, Modal, message } from "antd";
import styles from "app/styles/fund.module.css";
import stylesDL from "app/styles/dloan.module.css";
import stylesFD from "app/styles/foundation.module.css";
import { numberToCurrency } from "app/utils/number.helpers";
import { HeaderDashboard } from "app/components/header";
import { useMemo, useState } from "react";
import { api } from "app/utils/api";
import InputCode from "app/components/input";
import { useSession } from "next-auth/react";

export const FundHistory = () => {
  const { error } = Modal;
  const { status } = useSession();

  //mutates
  const { mutate: repayment } = api.loan.repayment.useMutation();
  const { mutate: downloadPdf } = api.loan.downloadPdf.useMutation();
  const { mutate: checkPayAmount } = api.loan.checkPayAmount.useMutation();

  //queries
  const { data: loanSearch } = api.loan.loanSearch.useQuery(
    {
      order: "date",
      order_up: "1",
      page: "1",
      page_size: "50",
      filter_type: "loan",
    },
    { refetchOnWindowFocus: false }
  );

  //states
  const [activeClass, setSelectedId] = useState<any>();
  const [open, setOpen] = useState<boolean>(false);
  const [openPdf, setOpenPdf] = useState<boolean>(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState<boolean>(false);
  const [foundationBankData, setFoundationBankData] = useState<any>();
  const [selectedData, setSelectedData] = useState<any>();
  const [myFundTabKey, setMyFundTabKey] = useState<string>("1");
  const [isVerifyOpen, setIsVerifyOpen] = useState<boolean>(false);

  //constants
  const orders = useMemo(() => {
    return loanSearch?.loan_requests;
  }, [loanSearch]);

  const mySavingOrders = useMemo(() => {
    const arr: any = [];
    const filteredData = orders?.filter(
      (el: any) => el.product_type_code == "saving"
    );
    filteredData?.map((el: any, idx: number) =>
      arr.push({ ...el, idx: idx + 1 })
    );
    return arr;
  }, [loanSearch]);

  const myLoanOrders = useMemo(() => {
    const arr: any = [];
    const filteredData = orders?.filter(
      (el: any) => el.product_type_code == "loan"
    );
    filteredData?.map((el: any, idx: number) =>
      arr.push({ ...el, idx: idx + 1 })
    );

    return arr;
  }, [orders]);

  const sumMyLoan = useMemo(() => {
    if (!loanSearch || !loanSearch.loan_requests) {
      return 0;
    }
    let num = 0;
    const filteredRequests = loanSearch.loan_requests.filter((el: any) => {
      if (el.product_type_code === "loan") {
        num += Math.ceil(Number(el.this_month_unpaid_amount));
        return true;
      }
      return false;
    });
    return num;
  }, [loanSearch]);

  const sumMySaving = useMemo(() => {
    if (!loanSearch || !loanSearch.loan_requests) {
      return 0;
    }
    let num = 0;
    const filteredRequests = loanSearch.loan_requests.filter((el: any) => {
      if (el.product_type_code == "saving") {
        num += Number(el.loan_amount);
        return true;
      }
      return false;
    });

    return num;
  }, [loanSearch]);

  const columns: any[] = [
    {
      title: "Хоног",
      dataIndex: "loan_day",
      key: "is_status",
      width: "6%",
      render: (id: string) => (
        <div className={styles["fund-tabs-content-table-number"]}>{id}</div>
      ),
    },
    {
      title: "Авсан зээл",
      dataIndex: "loan_amount",
      key: "loan_amount",
      align: "center",
      width: "23%",
      render: (loan_amount: number) => (
        <div className={styles["fund-tabs-content-table-number"]}>
          {numberToCurrency(Math.ceil(loan_amount))}
        </div>
      ),
    },
    {
      title: "Эргэн төлөх дүн",
      dataIndex: "this_month_unpaid_amount",
      key: "type",
      align: "center",
      width: "23%",
      render: (loan_amount: number) => (
        <div
          style={{ color: "#ff0000" }}
          className={styles["fund-tabs-content-table-number"]}
        >
          {numberToCurrency(Math.ceil(loan_amount))}
        </div>
      ),
    },
    {
      title: "Эргэн төлөх хугацаа",
      dataIndex: "this_month_pay_date",
      key: "rate",
      align: "center",
      width: "23%",
      render: (day: string) => (
        <div className={styles["fund-tabs-content-table-number"]}>{day}</div>
      ),
    },

    {
      title: "Дэлгэрэнгүй",
      dataIndex: "request_id",
      key: "request_id",
      width: "10%",
      align: "center",
      render: (request_id: string, data: any) => {
        return (
          <Image
            width={25}
            onClick={() => {
              setSelectedId(request_id);
              data?.product_type_code == "saving"
                ? setMyFundTabKey("2")
                : setMyFundTabKey("1");
              checkPayAmount(
                {
                  request_id: request_id && request_id,
                },
                {
                  onSuccess: (data: {
                    success: any;
                    request_id: any;
                    loan_requests: import("react").SetStateAction<undefined>;
                    description: any;
                    loan_info: any;
                  }) => {
                    if (data.success) {
                      console.log(data);
                      setSelectedData(data?.loan_info);
                      setOpen(true);
                    } else {
                      error({
                        title: "Амжилтгүй",
                        content: <div>{data?.description || null}</div>,
                      });
                    }
                  },
                }
              );
              data?.request_type == "saving"
                ? setMyFundTabKey("2")
                : setMyFundTabKey("1");
              setOpen(true);
            }}
            src={"/images/info-icon.png"}
            preview={false}
            className="cursor-pointer"
            alt="Information"
          />
        );
      },
    },
  ];
  const columns1: any[] = [
    {
      title: "Хоног",
      dataIndex: "loan_day",
      key: "is_status",
      width: "6%",
      render: (id: string) => (
        <div className={styles["fund-tabs-content-table-number"]}>{id}</div>
      ),
    },
    {
      title: "Санхүүжилтийн хэмжээ",
      dataIndex: "loan_amount",
      key: "loan_amount",
      align: "center",
      width: "23%",
      render: (loan_amount: string) => (
        <div className={styles["fund-tabs-content-table-number"]}>
          {numberToCurrency(loan_amount)}
        </div>
      ),
    },
    {
      title: "Эргэн төлөгдөх дүн",
      dataIndex: "loan_amount",
      key: "type",
      align: "center",
      width: "23%",
      render: (loan_amount: number, o: any) => (
        <div
          style={{ color: "#39da00" }}
          className={styles["fund-tabs-content-table-number"]}
        >
          {numberToCurrency(
            Math.ceil(
              (loan_amount / 100) *
                (Math.round(o.loan_rate_day * 1000) / 1000) *
                Number(o.loan_day) -
                Number(o.loan_amount / 100) *
                  (Math.round(o.loan_rate_day * 1000) / 1000) *
                  Number(o.loan_day) *
                  0.1 +
                Number(o.loan_amount)
            )
          )}
        </div>
      ),
    },
    {
      title: "Эргэн төлөгдөх хугацаа",
      dataIndex: "loan_end_date",
      key: "rate",
      align: "center",
      width: "15%",
      render: (day: number) => (
        <div className={styles["fund-tabs-content-table-number"]}>{day}</div>
      ),
    },

    {
      title: "Дэлгэрэнгүй",
      dataIndex: "request_id",
      key: "request_id",
      width: "10%",
      align: "center",
      render: (request_id: string, data: any) => (
        <Image
          width={25}
          onClick={() => {
            setSelectedId(request_id);
            setSelectedData(data);
            data?.product_type_code == "saving"
              ? setMyFundTabKey("2")
              : setMyFundTabKey("1");
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
  const items = [
    {
      key: "1",
      label: "Өгсөн санхүүжилт",
      // onclick:{},
      children: (
        <Row gutter={[0, 30]} justify="center">
          <Col span={24}>
            <Row
              justify="space-between"
              className={styles["fund-tabs-content-border"]}
            >
              <Col flex="none">
                <div className={styles["fund-tabs-content-title"]}>
                  Нийт санхүүжилтийн хэмжээ
                </div>
                <div className={styles["fund-tabs-1-content-money"]}>
                  {numberToCurrency(sumMySaving)}
                </div>
              </Col>
              <Col flex="none">
                <div className={styles["fund-tabs-content-title"]}>
                  Дундаж хүү
                </div>
                <div className={styles["fund-tabs-content-rate"]}>
                  {mySavingOrders && mySavingOrders[0]?.loan_rate_month
                    ? Math.round(mySavingOrders[0]?.loan_rate_month * 10) / 10
                    : ""}
                  0 %
                </div>
              </Col>
              <Col flex="none">
                <div className={styles["fund-tabs-content-title"]}>
                  Санхүүжилтийн тоо
                </div>
                <div className={styles["fund-tabs-content-rate"]}>
                  {mySavingOrders ? mySavingOrders.length : 0}
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Table
              scroll={{ x: 430 }}
              columns={columns1}
              pagination={{
                pageSize: 8,
                position: ["bottomCenter"],
              }}
              dataSource={mySavingOrders}
              rowKey={"create_date"}
            />
          </Col>
        </Row>
      ),
    },
    {
      key: "2",
      label: "Авсан зээл",
      children: (
        <Row gutter={[0, 30]} justify="center">
          <Col span={24}>
            <Row
              justify="space-between"
              className={styles["fund-tabs-content-border"]}
            >
              <Col flex="none">
                <div className={styles["fund-tabs-content-title"]}>
                  Нийт зээлийн хэмжээ
                </div>
                <div className={styles["fund-tabs-2-content-money"]}>
                  {numberToCurrency(sumMyLoan)}
                </div>
              </Col>
              <Col flex="none">
                <div className={styles["fund-tabs-content-title"]}>
                  Дундаж хүү
                </div>
                <div className={styles["fund-tabs-content-rate"]}>
                  {myLoanOrders && myLoanOrders[0]?.loan_rate_month
                    ? Math.round(myLoanOrders[0]?.loan_rate_month * 10) / 10
                    : ""}
                  0 %
                </div>
              </Col>
              <Col flex="none">
                <div className={styles["fund-tabs-content-title"]}>
                  Зээлийн тоо
                </div>
                <div className={styles["fund-tabs-content-rate"]}>
                  {myLoanOrders ? myLoanOrders.length : 0}
                </div>
              </Col>
            </Row>
          </Col>
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
      ),
    },
  ];

  //functions
  const verifyCompleteModal = (code: string) => {
    repayment(
      {
        request_id: activeClass && activeClass,
        password: code,
        pay_type: foundationBankData == "3" ? "extension" : "loan",
      },
      {
        onSuccess: (data: {
          success: any;
          request_id: any;
          loan_requests: import("react").SetStateAction<undefined>;
          description: any;
        }) => {
          if (data.success) {
            setFoundationBankData(data);
            setIsVerifyOpen(false);
            setOpen(false);
            setIsCompleteOpen(true);
          } else {
            error({
              title: "Амжилтгүй",
              content: <div>{data?.description || null}</div>,
            });
          }
        },
      }
    );
  };

  const downloadPdfBtn = (code: string) => {
    downloadPdf(
      {
        request_id: activeClass && activeClass,
        password: code.toString(),
        contract_type: selectedData?.product_type_code,
      },
      {
        onSuccess: (data: {
          success: any;
          request_id: any;
          loan_requests: import("react").SetStateAction<undefined>;
          description: any;
          file_info: any;
        }) => {
          if (data.success) {
            setOpenPdf(false);

            const linkSource = `data:application/pdf;base64,${data?.file_info?.data}`;
            const downloadLink = document.createElement("a");
            const fileName = "file.pdf";

            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();
          } else {
            error({
              title: "Амжилтгүй",
              content: <div>{data?.description || null}</div>,
            });
          }
        },
      }
    );
  };

  if (status == "loading") {
    return null;
  } else {
    return (
      <Row justify="center" className={styles["fund-main-row"]}>
        <Col span={22}>
          <Row gutter={[0, 20]}>
            <HeaderDashboard
              title={"Миний санхүү"}
              subTitle={
                "Харилцагч та өөрийн нийт идэвхтэй байгаа өгсөн санхүүжилт болон авсан зээлтэй холбоотой мэдээллээ доорх цэсээр харна уу."
              }
            />

            <Col span={24}>
              <Tabs defaultActiveKey="1" items={items} tabBarGutter={0} />
            </Col>
          </Row>

          <Modal
            open={open}
            onCancel={() => setOpen(false)}
            footer={null}
            closeIcon={null}
            title={
              <div className="text-center font-beau text-[16px] font-medium">
                {myFundTabKey == "1"
                  ? "Зээлийн дэлгэрэнгүй"
                  : "Санхүүжилт дэлгэрэнгүй"}
              </div>
            }
          >
            {orders &&
              orders.map(
                (o: any, idx: number) =>
                  o.request_id == activeClass && (
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
                                      o.product_type_code == "saving"
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
                                    className={
                                      stylesDL["dloan-detail-maxValue"]
                                    }
                                  >
                                    {myFundTabKey == "1"
                                      ? numberToCurrency(
                                          selectedData?.balance_amount
                                        )
                                      : numberToCurrency(o.loan_amount)}
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
                                        o.product_type_code == "saving"
                                          ? stylesFD["foundation-rate-profit"]
                                          : stylesDL["dloan-rate-profit"]
                                      }
                                    >
                                      {numberToCurrency(
                                        Math.ceil(
                                          (o.loan_amount / 100) *
                                            (Math.round(
                                              o.loan_rate_day * 1000
                                            ) /
                                              1000) *
                                            Number(o.loan_day)
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
                                        Math.ceil(
                                          Number(o.loan_amount / 100) *
                                            (Math.round(
                                              o.loan_rate_day * 1000
                                            ) /
                                              1000) *
                                            Number(o.loan_day) *
                                            0.1
                                        )
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                            )}
                            {myFundTabKey == "1" &&
                              selectedData?.loan_rate_amount > 0 && (
                                <Col span={24}>
                                  <Row justify="space-between" align="middle">
                                    <Col flex="none">
                                      <div
                                        className={
                                          stylesDL["dloan-detail-text"]
                                        }
                                      >
                                        Зээлийн хүү (төгрөгөөр)
                                      </div>
                                    </Col>
                                    <Col flex="none">
                                      <div
                                        className={
                                          o.product_type_code == "saving"
                                            ? stylesFD["foundation-rate-profit"]
                                            : stylesDL["dloan-rate-profit"]
                                        }
                                      >
                                        {numberToCurrency(
                                          Math.ceil(
                                            selectedData?.loan_rate_amount
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
                                        selectedData?.close_pay_amount
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
                                        Math.ceil(
                                          (o.loan_amount / 100) *
                                            (Math.round(
                                              o.loan_rate_day * 1000
                                            ) /
                                              1000) *
                                            Number(o.loan_day) -
                                            Number(o.loan_amount / 100) *
                                              (Math.round(
                                                o.loan_rate_day * 1000
                                              ) /
                                                1000) *
                                              Number(o.loan_day) *
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
                                  <div
                                    className={stylesDL["dloan-detail-text"]}
                                  >
                                    Хүүгийн хэмжээ (хувь)
                                  </div>
                                </Col>
                                <Col flex="none">
                                  <div
                                    className={
                                      stylesDL["dloan-detail-maxValue"]
                                    }
                                  >
                                    {Math.round(o.loan_rate_month * 10) / 10}0 %
                                  </div>
                                </Col>
                              </Row>
                            </Col>
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
                                    {o.loan_day} хоног
                                  </div>
                                </Col>
                              </Row>
                            </Col>{" "}
                            {myFundTabKey == "1" &&
                              selectedData?.loan_fee_amount > 0 && (
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
                                          o.product_type_code == "saving"
                                            ? stylesFD["foundation-rate-profit"]
                                            : stylesDL["dloan-rate-profit"]
                                        }
                                      >
                                        {numberToCurrency(
                                          Number(selectedData?.loan_fee_amount)
                                        )}
                                      </div>
                                    </Col>
                                  </Row>
                                </Col>
                              )}
                            {myFundTabKey == "1" &&
                              selectedData?.lost_amount > 0 && (
                                <Col span={24}>
                                  <Row justify="space-between" align="middle">
                                    <Col flex="none">
                                      <div
                                        className={
                                          stylesDL["dloan-detail-text"]
                                        }
                                      >
                                        Нэмэгдүүлсэн хүү
                                      </div>
                                    </Col>
                                    <Col flex="none">
                                      <div
                                        className={
                                          o.product_type_code == "saving"
                                            ? stylesFD["foundation-rate-profit"]
                                            : stylesDL["dloan-rate-profit"]
                                        }
                                      >
                                        {numberToCurrency(
                                          Math.ceil(selectedData?.lost_amount)
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
                                      {selectedData?.subscribe_date?.slice(
                                        0,
                                        10
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
                                      Дуусах өдөр
                                    </div>
                                  </Col>
                                  <Col flex="none">
                                    <div
                                      className={
                                        stylesDL["dloan-detail-maxValue"]
                                      }
                                    >
                                      {o?.loan_end_date?.slice(0, 10)}
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                            )}
                          </Row>
                        </Col>
                      </Col>

                      <Col span={22} className="mx-auto w-full">
                        <Col className="mt-[20px]">
                          <Row gutter={[0, 22]}>
                            <Col span={24} className="flex">
                              <Button
                                type="link"
                                className="flex  p-0"
                                onClick={() => setOpenPdf(true)}
                              >
                                <img src="/images/pdf.svg" alt="pdf" />
                                <p className="ps-1 pt-1 font-raleway text-[12px] font-normal ">
                                  {myFundTabKey == "1"
                                    ? "Зээлийн гэрээний хавсралт"
                                    : "Богино хугацааны Санхүүжилтийн гэрээ"}
                                </p>
                              </Button>
                            </Col>
                          </Row>
                        </Col>
                      </Col>

                      <Col className="mx-auto mt-[20px]" span={22}>
                        {activeClass && (
                          <Row
                            justify="space-between"
                            className="gap-4"
                            wrap={false}
                          >
                            <Button
                              className={stylesDL["dloan-button-back"]}
                              type="default"
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
                            {myFundTabKey == "1" && o.is_extension == 1 && (
                              <Button
                                className={stylesDL["dloan-button-back"]}
                                type="primary"
                                onClick={() => {
                                  setIsVerifyOpen(true);
                                  setFoundationBankData("3");
                                }}
                              >
                                <Col flex={"auto"}>
                                  <div
                                    className={
                                      styles["dloan-change-button-text"]
                                    }
                                  >
                                    Зээл сунгах
                                  </div>
                                </Col>
                              </Button>
                            )}
                            {myFundTabKey == "1" && (
                              <Button
                                className={stylesDL["dloan-button-back"]}
                                type="primary"
                                onClick={() => {
                                  setIsVerifyOpen(true);
                                }}
                              >
                                <Col flex={"auto"}>
                                  <div
                                    className={
                                      styles["dloan-change-button-text"]
                                    }
                                  >
                                    Зээл төлөх
                                  </div>
                                </Col>
                              </Button>
                            )}
                          </Row>
                        )}
                      </Col>
                    </div>
                  )
              )}
          </Modal>

          <InputCode
            open={isVerifyOpen}
            onFinish={verifyCompleteModal}
            setOpen={setIsVerifyOpen}
          />

          <InputCode
            open={openPdf}
            onFinish={downloadPdfBtn}
            setOpen={setOpenPdf}
          />

          <Modal
            centered
            width={378}
            title={null}
            open={isCompleteOpen}
            closeIcon={false}
            footer={
              <Button
                className={`mt-[40px] flex h-[40px] w-[50%] justify-start rounded-[20px]`}
                onClick={() => setIsCompleteOpen(false)}
              >
                <p className="w-full p-[4px] text-center">Хаах</p>
              </Button>
            }
          >
            <div className="text-center text-lg font-bold text-black">
              Зээл төлөх
            </div>
            <div>
              <div className="mt-[20px] ">
                <label className="text-sm font-normal text-black text-opacity-50">
                  Хүлээн авах банкны нэр
                </label>
                <input
                  value={foundationBankData?.product?.bank_name}
                  disabled
                  className="mt-[8px] h-[44px] w-full rounded-lg border bg-[#F2F2F2] p-3 text-sm font-semibold text-black"
                />
              </div>
              <div className="mt-[20px]">
                <label className="text-sm font-normal text-black text-opacity-50">
                  Данс эзэмшигчийн нэр
                </label>
                <div className="mt-[8px] flex h-[44px] justify-between">
                  <input
                    value={foundationBankData?.product?.account_name}
                    disabled
                    className="w-full rounded-lg border bg-[#F2F2F2] p-3 text-sm font-semibold text-black"
                  />
                  <img
                    src="/images/iconamoon_copy.svg"
                    className="ms-[10px] cursor-pointer rounded-[50%] bg-[#F2F2F2] p-3"
                    alt=""
                    onClick={() => {
                      message.success("Copy to clipboard");
                      navigator.clipboard.writeText(
                        foundationBankData?.product?.account_name
                      );
                    }}
                  />
                </div>
              </div>

              <div className="mt-[20px]">
                <label className="text-sm font-normal text-black text-opacity-50">
                  Дансны дугаар
                </label>
                <div className="mt-[8px] flex h-[44px] justify-between">
                  <input
                    value={foundationBankData?.product?.account_num}
                    disabled
                    className="w-full rounded-lg border bg-[#F2F2F2] p-3 text-sm font-semibold text-black"
                  />
                  <img
                    src="/images/iconamoon_copy.svg"
                    className="ms-[10px] cursor-pointer rounded-[50%] bg-[#F2F2F2] p-3"
                    alt=""
                    onClick={() => {
                      message.success("Copy to clipboard");
                      navigator.clipboard.writeText(
                        foundationBankData?.product?.account_num
                      );
                    }}
                  />
                </div>
              </div>

              <div className="mt-[20px]">
                <label className="text-sm font-normal text-black text-opacity-50">
                  Гүйлгээний дүн
                </label>
                <div className="mt-[8px] flex h-[44px] justify-between">
                  <input
                    value={foundationBankData?.product?.now_month_pay_amount}
                    disabled
                    className="w-full rounded-lg border bg-[#F2F2F2] p-3 text-sm font-semibold text-black"
                  />
                  <img
                    src="/images/iconamoon_copy.svg"
                    className="ms-[10px] cursor-pointer rounded-[50%] bg-[#F2F2F2] p-3"
                    alt=""
                    onClick={() => {
                      message.success("Copy to clipboard");
                      navigator.clipboard.writeText(
                        foundationBankData?.product?.now_month_pay_amount
                      );
                    }}
                  />
                </div>
              </div>
              {foundationBankData?.product?.extension_desc && (
                <div className="mt-[10px] text-red-600">
                  {foundationBankData?.product?.extension_desc}
                </div>
              )}

              <div className="mt-[20px]">
                <label className="text-sm font-normal text-black text-opacity-50">
                  Гүйлгээний утга
                </label>
                <div className="mt-[8px] flex h-[44px] justify-between">
                  <input
                    value={foundationBankData?.product?.transaction_description}
                    disabled
                    className="w-full rounded-lg border bg-[#F2F2F2] p-3 text-sm font-semibold text-black"
                  />
                  <img
                    src="/images/iconamoon_copy.svg"
                    className="ms-[10px] cursor-pointer rounded-[50%] bg-[#F2F2F2] p-3"
                    alt=""
                    onClick={() => {
                      message.success("Copy to clipboard");
                      navigator.clipboard.writeText(
                        foundationBankData?.product?.transaction_description
                      );
                    }}
                  />
                </div>
              </div>

              <div className="mt-[30px] text-xs font-normal leading-[18px] text-red-600">
                <p>
                  Таны зээлийн эргэн төлөлт гүйлгээний утга зөрүүтэй тохиолдолд
                  баталгаажихгүй болохыг анхаарна уу!
                </p>
                {/* <ol className="list-disc ps-[35px] pt-[15px]">
                  <li>Гүйлгээний утга буруу</li>
                  <li>KYC баталгаажуулалт хийгдээгүй</li>
                  <li>Бүртгэлгүй банкны данснаас шилжүүлэг хийсэн</li>
                  <li>
                    Бүртгэлтэй, гэхдээ баталгаажуулаагүй данснаас шилжүүлэг
                    хийсэн
                  </li>
                </ol> */}
              </div>
            </div>
          </Modal>
        </Col>
      </Row>
    );
  }
};

export default FundHistory;

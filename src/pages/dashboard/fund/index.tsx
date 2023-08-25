import { Row, Col, Tabs, Table, Image, Button, Modal, message } from "antd";
import styles from "../../../styles/fund.module.css";
import stylesDL from "../../../styles/dloan.module.css";
import stylesFD from "../../../styles/foundation.module.css";
import stylesList from "../../../styles/dashboard.module.css";
import { numberToCurrency } from "../../../utils/number.helpers";
import { HeaderDashboard } from "../../../components/header";
import { useRequireAuth } from "app/utils/auth";
import { useMemo, useState } from "react";
import { api } from "app/utils/api";
import InputCode from "app/components/input";

export const FundHistory = () => {
  useRequireAuth();
  const { error } = Modal;

  //mutates
  const { mutate: repayment } = api.loan.repayment.useMutation();

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
  const [activeClass, setSelectedId] = useState<any>();
  const [open, setOpen] = useState<boolean>(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState<boolean>(false);
  const [foundationBankData, setFoundationBankData] = useState<any>();
  const [selectedData, setSelectedData] = useState<any>();
  const [myFundTabKey, setMyFundTabKey] = useState<string>("1");
  const [isVerifyOpen, setIsVerifyOpen] = useState<boolean>(false);

  //constants
  const orders = useMemo(() => {
    return requestSearch?.requests;
  }, [requestSearch]);
  const mySavingOrders = useMemo(() => {
    return requestSearch?.requests?.filter(
      (el: any) =>
        el.filled_percent.slice(0, 3) == "100" && el.request_type == "saving"
    );
  }, [requestSearch]);
  const myLoanOrders = useMemo(() => {
    return requestSearch?.requests?.filter(
      (el: any) =>
        el.filled_percent.slice(0, 3) == "100" && el.request_type == "wallet"
    );
  }, [requestSearch]);

  const sumMyLoan = useMemo(() => {
    if (!requestSearch || !requestSearch.requests) {
      return 0;
    }
    let num = 0;
    const filteredRequests = requestSearch.requests.filter((el: any) => {
      if (
        el.filled_percent.slice(0, 3) === "100" &&
        el.request_type === "wallet"
      ) {
        num += Number(el.loan_amount);
        return true;
      }
      return false;
    });
    return num;
  }, [requestSearch]);
  const sumMySaving = useMemo(() => {
    if (!requestSearch || !requestSearch.requests) {
      return 0;
    }
    let num = 0;
    const filteredRequests = requestSearch.requests.filter((el: any) => {
      if (
        el.filled_percent.slice(0, 3) === "100" &&
        el.request_type === "saving"
      ) {
        num += Number(el.loan_amount);
        return true;
      }
      return false;
    });

    return num;
  }, [requestSearch]);

  const columns: any[] = [
    {
      title: "№",
      dataIndex: "id",
      key: "is_status",
      width: "6%",
      render: (id: string) => (
        <div className={styles["fund-tabs-content-table-number"]}>{id}</div>
      ),
    },
    {
      title: "Зээлийн хэмжээ",
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
      title: "Төрөл",
      dataIndex: "request_type",
      key: "type",
      align: "center",
      width: "23%",
      render: (type: string) =>
        type == "saving" ? (
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
      key: "rate",
      align: "center",
      width: "15%",
      render: (rate: string) => (
        <div className={styles["fund-tabs-content-table-number"]}>{rate} %</div>
      ),
    },
    {
      title: "Эхэлсэн өдөр",
      dataIndex: "create_date",
      key: "day",
      align: "center",
      width: "23%",
      render: (day: string) => (
        <div className={styles["fund-tabs-content-table-number"]}>
          {day.slice(0, 10)}
        </div>
      ),
    },
    {
      title: " ",
      dataIndex: "id",
      key: "main_request_id",
      width: "10%",
      align: "center",
      render: (main_request_id: string, data: any) => (
        <Image
          width={25}
          onClick={() => {
            setSelectedId(main_request_id);
            setSelectedData(data);
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
                  Нийт зээлийн хэмжээ
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
                  {mySavingOrders && mySavingOrders[0]?.rate_month
                    ? mySavingOrders[0]?.rate_month
                    : "0"}{" "}
                  %
                </div>
              </Col>
              <Col flex="none">
                <div className={styles["fund-tabs-content-title"]}>
                  Санхүүжилтын тоо
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
              columns={columns}
              pagination={{
                pageSize: 10,
                position: ["bottomCenter"],
              }}
              dataSource={mySavingOrders?.reverse()}
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
                  {myLoanOrders && myLoanOrders[0]?.rate_month
                    ? myLoanOrders[0]?.rate_month
                    : "0"}{" "}
                  %
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
                pageSize: 10,
                position: ["bottomCenter"],
              }}
              dataSource={myLoanOrders?.reverse()}
              rowKey={"create_date"}
            />
          </Col>
        </Row>
      ),
    },
  ];

  //functions
  function verifyCompleteModal(code: number) {
    repayment(
      {
        request_id: selectedData?.id && selectedData?.id,
        password: code.toString(),
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
  }

  return (
    <Row justify="center" className={styles["fund-main-row"]}>
      <Col span={22}>
        <Row gutter={[0, 20]}>
          <HeaderDashboard
            title={"Миний санхүүжилт"}
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
          // width={"80%"}
          closeIcon={null}
          title={
            <div className="text-center font-beau text-[16px] font-medium">
              {myFundTabKey == "1"
                ? "Зээлийн хүсэлт дэлгэрэнгүй"
                : "Санхүүжилт хүсэлт дэлгэрэнгүй"}
            </div>
          }
        >
          {orders &&
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
                                    : "Санхүүжилтын хэмжээ"}
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
                                      (o.filled_amount / 100) *
                                        Number(o.rate_day) *
                                        Number(o.duration)
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
                                        Number(o.filled_amount / 100) *
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
                                      (o.loan_amount / 100) *
                                        Number(o.fee_percent)
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
                                      (o.loan_amount / 100) *
                                        o.rate_day *
                                        Number(o.duration) +
                                        Number(o.loan_amount) +
                                        (o.loan_amount / 100) *
                                          Number(o.fee_percent)
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
                                    {o.expire_date.slice(0, 10)}
                                    {/* + o.duration */}
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
                          {myFundTabKey == "1" && (
                            <Button
                              className={stylesDL["dloan-button-back"]}
                              type="primary"
                              onClick={() => {
                                message.info("coming soon");
                              }}
                            >
                              <Col flex={"auto"}>
                                <div
                                  className={styles["dloan-change-button-text"]}
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
                                  className={styles["dloan-change-button-text"]}
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
                Дараах тохиолдлуудад таны данс цэнэглэлт амжилтгүй болох бөгөөд
                ажлын 2 хоногийн дотор анх шилжүүлсэн данс руу буцаан
                шилжүүлэхийг АНХААРНА УУ!
              </p>
              <ol className="list-disc ps-[35px] pt-[15px]">
                <li>Гүйлгээний утга буруу</li>
                <li>KYC баталгаажуулалт хийгдээгүй</li>
                <li>Бүртгэлгүй банкны данснаас шилжүүлэг хийсэн</li>
                <li>
                  Бүртгэлтэй, гэхдээ баталгаажуулаагүй данснаас шилжүүлэг хийсэн
                </li>
              </ol>
            </div>
          </div>
        </Modal>
      </Col>
    </Row>
  );
};

export default FundHistory;

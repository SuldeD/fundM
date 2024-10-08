import {
  Row,
  Col,
  Slider,
  InputNumber,
  Button,
  Checkbox,
  Modal,
  Form,
  message,
} from "antd";
import styles from "app/styles/foundation.module.css";
import stylesL from "app/styles/dloan.module.css";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { numberToCurrency } from "app/utils/number.helpers";
import { HeaderDashboard } from "app/components/header";
import moment from "moment";
import InputCode from "app/components/input";
import { api } from "app/utils/api";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { signOut, useSession } from "next-auth/react";
import PopupModal from "app/components/modal";

export const Foundation = () => {
  const { status: layoutStatus } = useSession();
  const router = useRouter();
  const [form] = Form.useForm();
  const { error } = Modal;

  //mutates
  const { mutate: repayment } = api.loan.repayment.useMutation();

  //queries
  const { mutate: loanReqMutate } = api.loan.loanRequest.useMutation();
  const { mutate: loanReqConfirmMut } =
    api.loan.loanRequestConfirm.useMutation();
  const { mutate } = api.other.notficationSearch.useMutation();
  const { data: loanData } = api.loan.loanList.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const { data: accountInfo } = api.account.accountInfo.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const { data: getContent } = api.term.getContent.useQuery(
    {
      code: "saving",
    },
    { refetchOnWindowFocus: false }
  );

  //states
  const [inputValue, setInputValue] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState<boolean>(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState<boolean>(false);
  const [activeDuration, setActiveDuration] = useState<number>(0);
  const [foundationBankData, setFoundationBankData] = useState<any>();
  const [checked, setChecked] = useState<boolean>(false);
  const [success, setSuccess] = useState<any>("");

  const [notfication, setNotfication] = useState<any>();
  const [reqId, setReqId] = useState<string>("");

  //constants
  const saving = useMemo(() => {
    return loanData?.product_list?.find(
      (it: any) => it?.product_code === "saving"
    );
  }, [loanData]);
  const dataTable = saving && saving?.duration;
  const html = useMemo(() => {
    return getContent && getContent?.page_html;
  }, [getContent]);
  const minValue = Number(saving && saving?.loan_min_amount);
  const maxValue = Number(saving && saving?.loan_max_amount);
  const rate = Number(saving && saving?.loan_rate_day);

  useEffect(() => {
    minValue > 0 && setInputValue(minValue);
  }, [minValue]);

  //functions
  function submit(code: any) {
    loanReqMutate(
      {
        product_id: (saving?.product_id).toString(),
        loan_amount: inputValue.toString(),
        repayment_amount: (
          (inputValue / 100) *
            rate *
            Number(dataTable[activeDuration].duration) +
          inputValue
        ).toString(),
        loan_month: dataTable[activeDuration].duration,
      },
      {
        onSuccess: (data: {
          success: any;
          request_id: any;
          loan_requests: import("react").SetStateAction<undefined>;
          description: any;
        }) => {
          if (data.success) {
            setIsVerifyOpen(true);
            verifyCompleteModal({ code, request_id: data?.request_id });
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
  function verifyCompleteModal({ code, request_id }: any) {
    if (code) {
      loanReqConfirmMut(
        {
          request_id: request_id && request_id,
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
              setReqId(request_id);
              setIsVerifyOpen(false);
              setIsCompleteOpen(true);
              repayment(
                {
                  request_id: request_id && request_id,
                  password: code.toString(),
                  pay_type: "saving",
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
                      setChecked(false);
                    } else {
                      setChecked(false);
                      error({
                        title: "Амжилтгүй",
                        content: <div>{data?.description || null}</div>,
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
            }
          },
        }
      );
    } else {
      error({
        title: "Амжилтгүй",
        content: <div>FundMe кодоо оруулна уу!!!</div>,
      });
    }
  }
  const handleOk = async () => {
    await form.validateFields();
    // setChecked(!checked);
    setIsModalOpen(false);

    checked
      ? !accountInfo?.bank_account
        ? error({
            title: "Амжилтгүй",
            content: <div>Та хувийн мэдээлэлээ оруулах хэрэгтэй</div>,
          }) && router.push("/dashboard/profile/bank")
        : accountInfo?.bank_account?.is_verify == 0
        ? error({
            title: "Амжилтгүй",
            content: <div>Та дансаа баталгаажуулна уу</div>,
          }) && router.push("/dashboard/profile")
        : setIsVerifyOpen(true)
      : setIsModalOpen(true);
  };

  const fetchData = async () => {
    try {
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
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  setInterval(fetchData, 120000);

  useEffect(() => {
    console.log(reqId, "reqId");
    console.log("work");

    const dt = notfication?.activity_list?.find((e: any) => {
      return e?.activity_code == "check_paybill";
    });
    if (reqId && dt && reqId == dt?.request_id) {
      setIsCompleteOpen(false);
      setSuccess(dt);
    }
  }, [notfication]);

  if (layoutStatus == "loading") {
    return null;
  } else {
    return (
      // <ProtectedLayout>
      <Row
        justify="center"
        className={styles["foundation-main-row"]}
        gutter={[0, 30]}
      >
        <Col span={22}>
          <Row gutter={[0, 20]} justify="center">
            <HeaderDashboard
              title={"Санхүүжилт өгөх захиалга"}
              subTitle={
                "Харилцагч та миний захиалгууд цэсээс нийт жагсаалтаа харах боломжтой."
              }
            />
            <Row justify="center" gutter={[0, 20]}>
              <Col md={22}>
                <Row gutter={[22, 10]} justify="space-between" align="middle">
                  <Col span={24}>
                    <div className={styles["foundation-slider-input-title"]}>
                      Санхүүжилт өгөх хэмжээ
                    </div>
                  </Col>
                  <Col xs={24} lg={24} xl={8}>
                    <InputNumber
                      size="large"
                      min={minValue}
                      max={maxValue}
                      value={inputValue}
                      defaultValue={minValue}
                      onChange={(e: any) => setInputValue(e)}
                      formatter={(value) => numberToCurrency(value)}
                      className={styles["foundation-slider-input"]}
                    />
                  </Col>
                  <Col xs={24} lg={24} xl={16} style={{ padding: "0 20px" }}>
                    <Row justify="space-between">
                      <Col flex="none">
                        <div className={styles["foundation-slider-price"]}>
                          {numberToCurrency(minValue)}
                        </div>
                      </Col>
                      <Col flex="none">
                        <div className={styles["foundation-slider-price"]}>
                          {numberToCurrency(maxValue)}
                        </div>
                      </Col>
                    </Row>
                    <div className="mt-3 flex justify-between">
                      <div
                        onClick={() =>
                          minValue < inputValue &&
                          setInputValue(
                            maxValue <= 10000000
                              ? inputValue - 100000
                              : maxValue >= 10000000 && maxValue <= 50000000
                              ? inputValue - 500000
                              : inputValue - 1000000
                          )
                        }
                      >
                        <MinusCircleOutlined className="cursor-pointer text-[20px] hover:text-primary" />
                      </div>
                      <Slider
                        min={minValue}
                        step={
                          maxValue <= 10000000
                            ? 100000
                            : maxValue >= 10000000 && maxValue <= 50000000
                            ? 500000
                            : 1000000
                        }
                        max={maxValue}
                        className="w-[80%]"
                        onChange={(e) => setInputValue(e)}
                        value={typeof inputValue === "number" ? inputValue : 0}
                      />
                      <div
                        onClick={() =>
                          maxValue > inputValue &&
                          setInputValue(
                            maxValue <= 10000000
                              ? inputValue + 100000
                              : maxValue >= 10000000 && maxValue <= 50000000
                              ? inputValue + 500000
                              : inputValue + 1000000
                          )
                        }
                      >
                        <PlusCircleOutlined className="cursor-pointer text-[20px] hover:text-primary" />
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col md={22}>
                <Row
                  // @ts-ignore
                  gutter={[22, { xs: 20, lg: 10 }]}
                >
                  <Col xs={24} lg={8}>
                    <Row gutter={[0, 10]}>
                      <Col span={24}>
                        <div
                          className={styles["foundation-slider-input-title"]}
                        >
                          Зарласан хүү /сараар/
                        </div>
                      </Col>
                      <Col span={24}>
                        <Row
                          className={styles["foundation-rate-div"]}
                          align="middle"
                          justify="center"
                        >
                          <div className={styles["foundation-rate-text"]}>
                            {saving?.loan_rate_month} %
                          </div>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={24} lg={16}>
                    <Row gutter={[0, 10]}>
                      <Col span={24}>
                        <div
                          className={styles["foundation-slider-input-title"]}
                        >
                          Хугацаа сонгох
                        </div>
                      </Col>

                      <Col span={24}>
                        <Row wrap={true} gutter={30} align="middle">
                          {dataTable &&
                            dataTable?.map((el: any, idx: any) => (
                              <Col
                                flex="none"
                                key={`data-${idx}`}
                                className="mb-[15px]"
                              >
                                <Button
                                  onClick={() => setActiveDuration(idx)}
                                  className={
                                    styles[
                                      activeDuration === idx
                                        ? "foundation-button-active"
                                        : "foundation-button"
                                    ]
                                  }
                                >
                                  <div
                                    className={
                                      styles[
                                        activeDuration === idx
                                          ? "foundation-button-day-text-active"
                                          : "foundation-button-day-text"
                                      ]
                                    }
                                  >
                                    {el.duration}
                                  </div>
                                  <div
                                    className={
                                      styles[
                                        activeDuration === idx
                                          ? "foundation-button-text-active"
                                          : "foundation-button-text"
                                      ]
                                    }
                                  >
                                    {el?.duration_type === "M"
                                      ? "сар"
                                      : el?.duration_type === "D"
                                      ? "хоног"
                                      : el?.duration_type === "D"
                                      ? "жил"
                                      : ""}
                                  </div>
                                </Button>
                              </Col>
                            ))}
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} lg={22}>
                <Row className={styles["foundation-detail"]} gutter={[0, 22]}>
                  <Col span={24}>
                    <Row justify="space-between" align="middle">
                      <Col flex="none">
                        <div className={styles["foundation-detail-text"]}>
                          Санхүүжилтийн хэмжээ
                        </div>
                      </Col>
                      <Col flex="none">
                        <div className={styles["foundation-detail-maxValue"]}>
                          {numberToCurrency(inputValue)}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row justify="space-between" align="middle">
                      <Col flex="none">
                        <div className={styles["foundation-detail-text"]}>
                          Хүүгийн ашиг:
                        </div>
                      </Col>
                      <Col flex="none">
                        <div className={styles["foundation-rate-profit"]}>
                          {dataTable &&
                            typeof activeDuration == "number" &&
                            numberToCurrency(
                              Math.ceil(
                                (inputValue / 100) *
                                  rate *
                                  Number(dataTable[activeDuration].duration)
                              )
                            )}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row justify="space-between" align="middle">
                      <Col flex="none">
                        <div className={styles["foundation-detail-text"]}>
                          Татвар
                        </div>
                      </Col>
                      <Col flex="none">
                        <div className={stylesL["dloan-rate-profit"]}>
                          {dataTable &&
                            typeof activeDuration == "number" &&
                            numberToCurrency(
                              Math.ceil(
                                (inputValue / 100) *
                                  rate *
                                  Number(dataTable[activeDuration].duration) *
                                  0.1
                              )
                            )}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row justify="space-between" align="middle">
                      <Col flex="none">
                        <div className={styles["foundation-detail-text"]}>
                          Нийт
                        </div>
                      </Col>
                      <Col flex="none">
                        <div className={styles["foundation-detail-maxValue"]}>
                          {dataTable &&
                            numberToCurrency(
                              Math.ceil(
                                (inputValue / 100) *
                                  rate *
                                  Number(dataTable[activeDuration]?.duration) -
                                  Number(inputValue / 100) *
                                    rate *
                                    Number(
                                      dataTable[activeDuration]?.duration
                                    ) *
                                    0.1 +
                                  Number(inputValue)
                              )
                            )}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row justify="space-between" align="middle">
                      <Col flex="none">
                        <div className={styles["foundation-detail-text"]}>
                          Хугацаа
                        </div>
                      </Col>
                      <Col flex="none">
                        <div className={styles["foundation-detail-maxValue"]}>
                          {dataTable &&
                            typeof activeDuration == "number" &&
                            dataTable[activeDuration].duration}{" "}
                          хоног
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row justify="space-between" align="middle">
                      <Col flex="none">
                        <div className={styles["foundation-detail-text"]}>
                          Эргэн төлөгдөх хугацаа
                        </div>
                      </Col>
                      <Col flex="none">
                        <div className={styles["foundation-detail-maxValue"]}>
                          {dataTable &&
                            typeof activeDuration == "number" &&
                            moment()
                              .add(dataTable[activeDuration].duration, "days")
                              .calendar()}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col span={22}>
                <Row gutter={12} align="middle">
                  {/* <Col flex="none">
                    <Checkbox
                      ref={termsRef}
                      onChange={(e) =>
                        checked ? setChecked(true) : setIsModalOpen(true)
                      }
                      checked={checked}
                    />
                  </Col> */}
                  <Col flex="none">
                    <div className={styles["foundation-checkbox-text"]}>
                      <a onClick={() => setIsModalOpen(true)}>
                        Санхүүжилтийн үйлчилгээний нөхцөл
                      </a>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row
              justify="center"
              gutter={[0, 25]}
              className={styles["foundation-change-div"]}
            >
              <Col span={22}>
                <Row className={styles["foundation-detail"]} gutter={[0, 22]}>
                  <Col span={24}>
                    <Row justify="space-between" align="middle">
                      <Col flex="none">
                        <div className={styles["foundation-detail-text"]}>
                          Санхүүжилтийн хэмжээ
                        </div>
                      </Col>
                      <Col flex="none">
                        <div className={styles["foundation-detail-maxValue"]}>
                          {numberToCurrency(inputValue)}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row justify="space-between" align="middle">
                      <Col flex="none">
                        <div className={styles["foundation-detail-text"]}>
                          Хүүгийн ашиг:
                        </div>
                      </Col>
                      <Col flex="none">
                        <div className={styles["foundation-rate-profit"]}>
                          {dataTable &&
                            typeof activeDuration == "number" &&
                            numberToCurrency(
                              Math.floor(
                                Number(
                                  dataTable[activeDuration].duration *
                                    (inputValue / 100) *
                                    rate
                                )
                              )
                            )}
                        </div>
                      </Col>
                    </Row>
                  </Col>

                  <Col span={24}>
                    <Row justify="space-between" align="middle">
                      <Col flex="none">
                        <div className={styles["foundation-detail-text"]}>
                          Хугацаа
                        </div>
                      </Col>
                      <Col flex="none">
                        <div className={styles["foundation-detail-maxValue"]}>
                          {dataTable &&
                            typeof activeDuration == "number" &&
                            dataTable[activeDuration].duration}{" "}
                          хоног
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row justify="space-between" align="middle">
                      <Col flex="none">
                        <div className={styles["foundation-detail-text"]}>
                          Эргэн төлөгдөх хугацаа
                        </div>
                      </Col>
                      <Col flex="none">
                        <div className={styles["foundation-detail-maxValue"]}>
                          {dataTable &&
                            typeof activeDuration == "number" &&
                            moment()
                              // @ts-ignore
                              .add(dataTable[activeDuration].duration, "days")
                              .calendar()}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col span={22}>
                <Row
                  gutter={[0, 10]}
                  justify="center"
                  className={styles["foundation-border-div"]}
                >
                  <Col span={24}>
                    <div className={styles["foundation-change-title"]}>
                      Зээлийн гэрээ
                    </div>
                  </Col>
                  <Col span={24}>
                    <div className={styles["foundation-contract-text"]}>
                      <div dangerouslySetInnerHTML={{ __html: html }} />
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Row>
        </Col>
        <Col span={24}>
          <Row justify={"center"} align="top" style={{ height: "100%" }}>
            <Col xs={22} lg={20}>
              <Button
                type="primary"
                className={styles["foundation-button-contiune"]}
                onClick={() => {
                  checked
                    ? !accountInfo?.bank_account
                      ? error({
                          title: "Амжилтгүй",
                          content: (
                            <div>Та хувийн мэдээлэлээ оруулах хэрэгтэй</div>
                          ),
                        }) && router.push("/dashboard/profile/bank")
                      : accountInfo?.bank_account?.is_verify == 0
                      ? error({
                          title: "Амжилтгүй",
                          content: <div>Та дансаа баталгаажуулна уу</div>,
                        }) && router.push("/dashboard/profile")
                      : setIsVerifyOpen(true)
                    : setIsModalOpen(true);
                }}
              >
                Үргэлжлүүлэх
              </Button>
            </Col>

            <Modal
              centered
              closable={false}
              width="90%"
              title={
                <div className={styles["foundation-modal-title"]}>
                  САНХҮҮЖИЛТ ӨГӨХ ЗАХИАЛГЫН НӨХЦӨЛ
                </div>
              }
              open={isModalOpen}
              footer={null}
            >
              <Row justify="center">
                <Col>
                  <Col
                    span={24}
                    className="my-5 rounded-[9px] bg-bank p-[50px]"
                  >
                    <div dangerouslySetInnerHTML={{ __html: html }} />
                  </Col>
                  <Form form={form}>
                    <Row justify="center" gutter={[0, 10]}>
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
                          <Checkbox
                            onChange={() => {
                              setChecked(!checked);
                            }}
                          >
                            <div className={styles["foundation-checkbox-text"]}>
                              Санхүүжилтийн үйлчилгээний нөхцөл
                            </div>
                          </Checkbox>
                        </Form.Item>
                      </Col>
                      <Col xs={24} lg={20}>
                        <Row
                          justify="space-between"
                          wrap={false}
                          className="gap-3"
                        >
                          <Button
                            className={styles["foundation-button-back"]}
                            onClick={() => {
                              setIsModalOpen(false);
                              setChecked(false);
                            }}
                          >
                            <div
                              className={styles["foundation-button-back-text"]}
                            >
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
                </Col>
              </Row>
            </Modal>

            <InputCode
              open={isVerifyOpen}
              onFinish={submit}
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
                Санхүүжилт өгөх захиалга дансаар шилжүүлэх
              </div>
              <div>
                <div className="mt-[20px] ">
                  <label className="text-sm font-normal text-black text-opacity-50">
                    Банкны нэр
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
                        navigator?.clipboard?.writeText(
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
                        navigator?.clipboard?.writeText(
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
                      value={
                        foundationBankData?.product?.transaction_description
                      }
                      disabled
                      className="w-full rounded-lg border bg-[#F2F2F2] p-3 text-sm font-semibold text-black"
                    />
                    <img
                      src="/images/iconamoon_copy.svg"
                      className="ms-[10px] cursor-pointer rounded-[50%] bg-[#F2F2F2] p-3"
                      alt=""
                      onClick={() => {
                        message.success("Copy to clipboard");
                        navigator?.clipboard?.writeText(
                          foundationBankData?.product?.transaction_description
                        );
                      }}
                    />
                  </div>
                </div>

                <div className="mt-[30px] text-xs font-normal leading-[18px] text-red-600">
                  <p>
                    Таны санхүүжилт өгөх захиалгын гүйлгээг шалгасаны үндсэн
                    дээр захиалгын бүртгэл хийгдэхийг анхаарна уу? Дараах
                    тохиолдолд таны захиалга амжилтгүй болно. Үүнд:
                  </p>
                  <ol className="list-disc ps-[35px] pt-[15px]">
                    <li>Гүйлгээний утга зөрүүтэй</li>
                    <li>Гүйлгээний дүн зөрүүтэй</li>
                    <li>
                      Банк хоорондын гүйлгээний хязгаараас хамаарч захиалга
                      баталгаажихыг анхаарна уу!!!
                    </li>
                  </ol>
                </div>
              </div>
            </Modal>

            <PopupModal
              buttonClick={() => {
                setSuccess("");
                router.push("/dashboard/myfund");
              }}
              buttonText={"Хаах"}
              closableM={null}
              closeModal={null}
              customDiv={null}
              customIconWidth={null}
              iconPath={"json"}
              modalWidth={null}
              open={success?.description?.length > 0}
              text={<p className="text-center">{success?.description}</p>}
              textAlign={"center"}
            />
          </Row>
        </Col>
      </Row>
      // </ProtectedLayout>
    );
  }
};

export default Foundation;

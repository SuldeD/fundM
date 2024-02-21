import {
  Row,
  Col,
  Slider,
  InputNumber,
  Button,
  Checkbox,
  Modal,
  Image,
  Form,
} from "antd";
import styles from "app/styles/dloan.module.css";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { numberToCurrency } from "app/utils/number.helpers";
import { HeaderDashboard } from "app/components/header";
import moment from "moment";
import InputCode from "app/components/input";
import { api } from "app/utils/api";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";
import LottiePlayer from "lottie-react";
import animation from "../../../../public/check.json";

export const Loan = () => {
  const termsRef: any = useRef();
  const router = useRouter();
  const { status: layoutStatus } = useSession();
  const { error } = Modal;

  //mutate
  const { mutate: walletToBank } = api.loan.walletToBank.useMutation();
  const { mutate: walletToBankConfirm } =
    api.loan.walletToBankConfirm.useMutation();
  const { mutate: loanReqMutate } = api.loan.loanRequest.useMutation();
  const { mutate: loanReqConfirmMut } =
    api.loan.loanRequestConfirm.useMutation();

  //query
  const { data: getContent } = api.term.getContent.useQuery(
    {
      code: "loan",
    },
    { refetchOnWindowFocus: false }
  );
  const { data: statusData } = api.account.accountStatus.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const { data: accountInfo } = api.account.accountInfo.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const { data: savingData } = api.loan.loanList.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const { data: loanSearch } = api.loan.loanSearch.useQuery(
    {
      order: "date",
      order_up: "1",
      page: "1",
      page_size: "50",
      filter_type: "active",
    },
    { refetchOnWindowFocus: false }
  );

  //state
  const [checked, setChecked] = useState<boolean>(false);
  const [loadings, setLoadings] = useState<boolean>(false);
  const [activeClass, setActiveClass] = useState<any>(true);
  const [inputValue, setInputValue] = useState<number>(50000);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState<boolean>(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState<boolean>(false);
  const [isCompleteOpenLoan, setIsCompleteOpenLoan] = useState<boolean>(false);
  const [activeDuration, setActiveDuration] = useState<number>(0);
  const [form] = Form.useForm();

  const loan = useMemo(() => {
    return savingData?.product_list?.find(
      (it: any) => it.product_code !== "saving"
    );
  }, [savingData]);

  const loanReq = useMemo(() => {
    return loanSearch?.loan_requests?.length > 0
      ? loanSearch?.loan_requests
      : [];
  }, [loanSearch]);

  let status = 0;
  loanReq?.forEach((ln: any) => {
    if (ln?.is_status == "5" && ln?.product_type_code == "loan") {
      return (status = 1);
    }
  });

  const minValue = useMemo(() => {
    return status == 1
      ? Number(statusData?.stat?.wallet_min_amount)
      : Number(loan?.loan_min_amount);
  }, [loan, statusData, status]);

  const maxValue = useMemo(() => {
    if (status === 1) {
      if (Number(statusData?.stat?.blocked_wallet_amount) > 0) {
        const availableAmount =
          Number(statusData?.stat?.wallet_amount) -
          Number(statusData?.stat?.blocked_wallet_amount);
        return availableAmount > Number(loan?.loan_max_amount)
          ? Number(loan?.loan_max_amount)
          : availableAmount;
      } else {
        return Number(statusData?.stat?.wallet_amount);
      }
    } else {
      return Number(loan?.loan_max_amount);
    }
  }, [status, statusData, loan]);

  const rate = useMemo(() => {
    return Number(loan?.loan_rate_day);
  }, [loan]);

  const dataTable = loan?.duration;

  const html = useMemo(() => {
    return getContent?.page_html;
  }, [getContent]);

  const date = new Date();

  useEffect(() => {
    minValue > 0 && setInputValue(minValue);
  }, [minValue]);

  //function
  function submit(code: any) {
    setLoadings(true);
    try {
      if (status == 1) {
        walletToBank(
          {
            account_name: accountInfo?.bank_account?.account_name,
            amount: inputValue.toString(),
            description: "test loan",
            loan_duration_month:
              dataTable && dataTable[activeDuration]?.duration_type === "M"
                ? Number(dataTable[activeDuration]?.duration).toString()
                : "0",
            loan_duration_day:
              dataTable && dataTable[activeDuration]?.duration_type === "D"
                ? Number(dataTable[activeDuration]?.duration).toString()
                : "0",
            pay_day: (dataTable &&
            dataTable[activeDuration]?.duration_type === "M"
              ? date.getDate()
              : "0"
            ).toString(),
            account_num: accountInfo?.bank_account?.account_num,
            bank_id: accountInfo?.bank_account?.BankId,
          },
          {
            onSuccess: (data: {
              form_token: any;
              transaction_id: any;
              success: any;
              request_id: any;
              pin_code: any;
              loan_requests: import("react").SetStateAction<undefined>;
              description: any;
            }) => {
              if (data.success) {
                // setTransaction_id(data?.transaction_id);
                // setForm_token(data?.form_token);
                // setPin_code(data?.pin_code);
                setLoadings(false);
                verifyCompleteModal({
                  code,
                  transaction_id: data?.transaction_id,
                  form_token: data?.form_token,
                  pin_code: data?.pin_code,
                });
              } else {
                setLoadings(false);
                error({
                  title: "Амжилтгүй",
                  content: <div>{data?.description || null}</div>,
                });
              }
            },
          }
        );
      } else {
        loanReqMutate(
          {
            product_id: (loan?.product_id).toString(),
            loan_amount: inputValue.toString(),
            repayment_amount: (
              (dataTable[activeDuration]?.duration_type === "M"
                ? Number(dataTable[activeDuration]?.duration * 30)
                : Number(dataTable[activeDuration]?.duration)) *
                rate *
                (inputValue / 100) +
              inputValue +
              (dataTable[activeDuration]?.duration_type === "M"
                ? Number(dataTable[activeDuration]?.duration * 30)
                : Number(dataTable[activeDuration]?.duration)) *
                Number(dataTable[activeDuration]?.fee_percent) *
                (inputValue / 100)
            ).toString(),
            loan_month: (dataTable[activeDuration]?.duration_type === "M"
              ? Number(dataTable[activeDuration]?.duration * 30)
              : Number(dataTable[activeDuration]?.duration)
            ).toString(),
          },
          {
            onSuccess: (data: {
              success: any;
              request_id: any;
              loan_requests: import("react").SetStateAction<undefined>;
              description: any;
            }) => {
              if (data.success) {
                setLoadings(false);
                verifyCompleteModal({ request_id: data?.request_id, code });
              } else {
                setLoadings(false);
                error({
                  title: "Амжилтгүй",
                  content: <div>{data?.description || null}</div>,
                });
              }
            },
          }
        );
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  function verifyCompleteModal({
    code,
    transaction_id,
    form_token,
    pin_code,
    request_id,
  }: any) {
    if (code) {
      try {
        if (status == 1) {
          walletToBankConfirm(
            {
              transaction_id: transaction_id && transaction_id,
              password: code.toString(),
              form_token: form_token && form_token,
              pin_code: pin_code && pin_code,
            },
            {
              onSuccess: (data: {
                success: any;
                request_id: any;
                loan_requests: import("react").SetStateAction<undefined>;
                description: any;
              }) => {
                if (data.success) {
                  setIsVerifyOpen(false);
                  setIsCompleteOpen(true);
                  setChecked(false);
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
                  setIsVerifyOpen(false);
                  setIsCompleteOpenLoan(true);
                  setChecked(false);
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
      } catch (error) {
        console.error("An error occurred:", error);
      }
    } else {
      error({
        title: "Амжилтгүй",
        content: <div>FundMe кодоо оруулна уу!!!</div>,
      });
    }
  }

  if (layoutStatus == "loading") {
    return null;
  } else {
    return (
      <Row
        justify="center"
        className={styles["dloan-main-row"]}
        gutter={[0, 30]}
      >
        <Col span={22}>
          <Row gutter={[0, 20]} justify="center">
            <HeaderDashboard
              title={"Зээл авах захиалга"}
              subTitle={
                activeClass
                  ? "Харилцагч та зээлийн эрх нээлгэсний дараа зээл авах захиалга өгөх боломжтой"
                  : "Харилцагч та миний захиалгууд цэсээс нийт жагсаалтаа харах боломжтой."
              }
            />
            {status == 0 ? (
              <Col md={22}>
                <Row gutter={[22, 0]} justify="space-between" align="middle">
                  <Col span={24}>
                    <div className={styles["dloan-slider-input-title"]}>
                      Зээлийн хэмжээ
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
                      className={styles["dloan-slider-input"]}
                    />
                  </Col>
                  <Col xs={24} lg={24} xl={16} style={{ padding: "0 20px" }}>
                    <Row justify="space-between">
                      <Col flex="none">
                        <div className={styles["dloan-slider-price"]}>
                          {numberToCurrency(minValue)}
                        </div>
                      </Col>
                      <Col flex="none">
                        <div className={styles["dloan-slider-price"]}>
                          {numberToCurrency(maxValue)}
                        </div>
                      </Col>
                    </Row>

                    <div className="mt-3 flex justify-between">
                      <div
                        onClick={() =>
                          minValue < inputValue &&
                          setInputValue(
                            maxValue < 10000000
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
                          maxValue < 10000000
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
                            maxValue < 10000000
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
                  <Col span={20} className="mt-[20px]">
                    <Button
                      type="primary"
                      loading={loadings}
                      className={styles["dloan-button-contiune"]}
                      onClick={() => {
                        !accountInfo?.bank_account
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
                          : setIsVerifyOpen(true);
                      }}
                    >
                      Зээлийн эрх нээлгэх
                    </Button>
                  </Col>
                  <Modal
                    centered
                    closable={false}
                    width="90%"
                    title={
                      <div className={styles["dloan-modal-title"]}>
                        ЗЭЭЛ АВАХ ЗАХИАЛГЫН НӨХЦӨЛ
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
                                <Checkbox style={{ color: "green" }}>
                                  <div
                                    className={styles["dloan-checkbox-text"]}
                                  >
                                    Зээлийн үйлчилгээний нөхцөл
                                  </div>
                                </Checkbox>
                              </Form.Item>
                            </Col>
                            <Col xs={24} lg={20}>
                              <Row
                                justify="space-between"
                                className="gap-3"
                                gutter={10}
                                wrap={false}
                              >
                                <Button
                                  className={styles["dloan-button-back"]}
                                  onClick={() => setIsModalOpen(false)}
                                >
                                  <div
                                    className={styles["dloan-button-back-text"]}
                                  >
                                    Буцах
                                  </div>
                                </Button>

                                <Button
                                  type="primary"
                                  className={styles["dloan-button-contiune"]}
                                  onClick={() => {
                                    form.validateFields();
                                    setChecked(!checked);
                                    setIsModalOpen(false);
                                  }}
                                  htmlType="submit"
                                >
                                  Үргэлжлүүлэх
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
                    onCancel={() => {
                      setIsCompleteOpenLoan(false);
                      setChecked(false);
                    }}
                    open={isCompleteOpenLoan}
                    footer={null}
                  >
                    <Row
                      justify="center"
                      gutter={[0, 30]}
                      style={{ padding: "50px 0" }}
                    >
                      <Col span={24}>
                        <Row justify="center">
                          <LottiePlayer
                            animationData={animation}
                            loop={false}
                            width={180}
                            height={44}
                          />
                        </Row>
                      </Col>
                      <Col span={16}>
                        <div className={styles["dloan-modal-complete-text"]}>
                          Таны зээлийн эрх үүсгэх захиалга амжилттай
                          бүртгэгдлээ. ФандМи биржээс таны зээлийн эрхийн
                          хэмжээг нээж өгөх болно.
                        </div>
                      </Col>
                    </Row>
                  </Modal>
                </Row>
              </Col>
            ) : (
              <>
                <Row
                  justify="center"
                  gutter={[0, 20]}
                  className={styles[activeClass ? "" : "dloan-change-div"]}
                >
                  <Col md={22}>
                    <Row
                      gutter={[22, 10]}
                      justify="space-between"
                      align="middle"
                    >
                      <Col span={24}>
                        <div className={styles["dloan-slider-input-title"]}>
                          Зээлийн хэмжээ
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
                          className={styles["dloan-slider-input"]}
                        />
                      </Col>
                      <Col
                        xs={24}
                        lg={24}
                        xl={16}
                        style={{ padding: "0 20px" }}
                      >
                        <Row justify="space-between">
                          <Col flex="none">
                            <div className={styles["dloan-slider-price"]}>
                              {numberToCurrency(minValue)}
                            </div>
                          </Col>
                          <Col flex="none">
                            <div className={styles["dloan-slider-price"]}>
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
                            value={
                              typeof inputValue === "number" ? inputValue : 0
                            }
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
                            <div className={styles["dloan-slider-input-title"]}>
                              Зарласан хүү /сараар/
                            </div>
                          </Col>
                          <Col span={24}>
                            <Row
                              className={styles["dloan-rate-div"]}
                              align="middle"
                              justify="center"
                            >
                              <div className={styles["dloan-rate-text"]}>
                                {loan && loan?.loan_rate_month.slice(0, 4)} %
                              </div>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={24} lg={16}>
                        <Row gutter={[0, 10]}>
                          <Col span={24}>
                            <div className={styles["dloan-slider-input-title"]}>
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
                                            ? "dloan-button-active"
                                            : "dloan-button"
                                        ]
                                      }
                                    >
                                      <div
                                        className={
                                          styles[
                                            activeDuration === idx
                                              ? "dloan-button-day-text-active"
                                              : "dloan-button-day-text"
                                          ]
                                        }
                                      >
                                        {el.duration}
                                      </div>
                                      <div
                                        className={
                                          styles[
                                            activeDuration === idx
                                              ? "dloan-button-text-active"
                                              : "dloan-button-text"
                                          ]
                                        }
                                      >
                                        {el?.duration_type === "M"
                                          ? "сар"
                                          : el?.duration_type === "D"
                                          ? "хоног"
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

                  <Col md={22}>
                    <Row className={styles["dloan-detail"]} gutter={[0, 22]}>
                      <Col span={24}>
                        <Row justify="space-between" align="middle">
                          <Col flex="none">
                            <div className={styles["dloan-detail-text"]}>
                              Үндсэн зээлийн хэмжээ
                            </div>
                          </Col>
                          <Col flex="none">
                            <div className={styles["dloan-detail-maxValue"]}>
                              {numberToCurrency(inputValue)}
                            </div>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={24}>
                        <Row justify="space-between" align="middle">
                          <Col flex="none">
                            <div className={styles["dloan-detail-text"]}>
                              Хүүгийн хэмжээ
                            </div>
                          </Col>
                          <Col flex="none">
                            <div className={styles["dloan-rate-profit"]}>
                              {dataTable &&
                                typeof activeDuration == "number" &&
                                numberToCurrency(
                                  Math.ceil(
                                    (inputValue / 100) *
                                      rate *
                                      (dataTable[activeDuration]
                                        ?.duration_type === "M"
                                        ? Number(
                                            dataTable[activeDuration]
                                              ?.duration * 30
                                          )
                                        : Number(
                                            dataTable[activeDuration]?.duration
                                          ))
                                  )
                                )}
                            </div>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={24}>
                        <Row justify="space-between" align="middle">
                          <Col flex="none">
                            <div className={styles["dloan-detail-text"]}>
                              Үйлчилгээний шимтгэл
                            </div>
                          </Col>
                          <Col flex="none">
                            <div className={styles["dloan-rate-profit"]}>
                              {dataTable &&
                                typeof activeDuration == "number" &&
                                numberToCurrency(
                                  Math.ceil(
                                    (inputValue / 100) *
                                      Number(
                                        dataTable[activeDuration]?.fee_percent
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
                            <div className={styles["dloan-detail-text"]}>
                              Нийт зээлийн төлбөр
                            </div>
                          </Col>
                          <Col flex="none">
                            <div className={styles["dloan-detail-maxValue"]}>
                              {dataTable &&
                                typeof activeDuration == "number" &&
                                numberToCurrency(
                                  Math.ceil(
                                    (inputValue / 100) *
                                      rate *
                                      (dataTable[activeDuration]
                                        ?.duration_type === "M"
                                        ? Number(
                                            dataTable[activeDuration]
                                              ?.duration * 30
                                          )
                                        : Number(
                                            dataTable[activeDuration]?.duration
                                          )) +
                                      inputValue +
                                      (inputValue / 100) *
                                        Number(
                                          dataTable[activeDuration]?.fee_percent
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
                            <div className={styles["dloan-detail-text"]}>
                              Хугацаа
                            </div>
                          </Col>
                          <Col flex="none">
                            <div className={styles["dloan-detail-maxValue"]}>
                              {dataTable &&
                                typeof activeDuration == "number" &&
                                dataTable[activeDuration]?.duration}{" "}
                              {dataTable[activeDuration]?.duration_type === "M"
                                ? "сар"
                                : "хоног"}
                            </div>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={24}>
                        <Row justify="space-between" align="middle">
                          <Col flex="none">
                            <div className={styles["dloan-detail-text"]}>
                              Эргэн төлөгдөх хугацаа
                            </div>
                          </Col>
                          <Col flex="none">
                            <div className={styles["dloan-detail-maxValue"]}>
                              {dataTable &&
                                typeof activeDuration == "number" &&
                                moment()
                                  .add(
                                    dataTable[activeDuration]?.duration,
                                    dataTable[activeDuration]?.duration_type ===
                                      "M"
                                      ? "months"
                                      : "days"
                                  )
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
                        <div className={styles["dloan-checkbox-text"]}>
                          <a onClick={() => setIsModalOpen(true)}>
                            Зээлийн үйлчилгээний нөхцөл
                          </a>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row
                  justify="center"
                  gutter={[0, 20]}
                  className={styles[activeClass ? "dloan-change-div" : ""]}
                >
                  <Col span={22}>
                    <Row className={styles["dloan-detail"]} gutter={[0, 22]}>
                      <Col span={24}>
                        <Row justify="space-between" align="middle">
                          <Col flex="none">
                            <div className={styles["dloan-detail-text"]}>
                              Үндсэн зээлийн хэмжээ
                            </div>
                          </Col>
                          <Col flex="none">
                            <div className={styles["dloan-detail-maxValue"]}>
                              {numberToCurrency(inputValue)}
                            </div>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={24}>
                        <Row justify="space-between" align="middle">
                          <Col flex="none">
                            <div className={styles["dloan-detail-text"]}>
                              Хүүгийн хэмжээ
                            </div>
                          </Col>
                          <Col flex="none">
                            <div className={styles["dloan-rate-profit"]}>
                              {dataTable &&
                                typeof activeDuration == "number" &&
                                numberToCurrency(
                                  Math.round(
                                    (inputValue / 100) *
                                      rate *
                                      (dataTable[activeDuration]
                                        ?.duration_type === "M"
                                        ? Number(
                                            dataTable[activeDuration]
                                              ?.duration * 30
                                          )
                                        : Number(
                                            dataTable[activeDuration]?.duration
                                          ))
                                  )
                                )}
                            </div>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={24}>
                        <Row justify="space-between" align="middle">
                          <Col flex="none">
                            <div className={styles["dloan-detail-text"]}>
                              Зээл олголтын шимтгэл
                            </div>
                          </Col>
                          <Col flex="none">
                            <div className={styles["dloan-rate-profit"]}>
                              {dataTable &&
                                typeof activeDuration == "number" &&
                                numberToCurrency(
                                  Math.round(
                                    (inputValue / 100) *
                                      Number(
                                        dataTable[activeDuration]?.fee_percent
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
                            <div className={styles["dloan-detail-text"]}>
                              Нийт зээлийн төлбөр
                            </div>
                          </Col>
                          <Col flex="none">
                            <div className={styles["dloan-detail-maxValue"]}>
                              {dataTable &&
                                typeof activeDuration == "number" &&
                                numberToCurrency(
                                  Math.ceil(
                                    (inputValue / 100) *
                                      rate *
                                      (dataTable[activeDuration]
                                        ?.duration_type === "M"
                                        ? Number(
                                            dataTable[activeDuration]
                                              ?.duration * 30
                                          )
                                        : Number(
                                            dataTable[activeDuration]?.duration
                                          )) +
                                      inputValue +
                                      (inputValue / 100) *
                                        Number(
                                          dataTable[activeDuration]?.fee_percent
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
                            <div className={styles["dloan-detail-text"]}>
                              Хугацаа
                            </div>
                          </Col>
                          <Col flex="none">
                            <div className={styles["dloan-detail-maxValue"]}>
                              {dataTable &&
                                typeof activeDuration == "number" &&
                                dataTable[activeDuration]?.duration}{" "}
                              {dataTable[activeDuration]?.duration_type === "M"
                                ? "сар"
                                : "хоног"}
                            </div>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={24}>
                        <Row justify="space-between" align="middle">
                          <Col flex="none">
                            <div className={styles["dloan-detail-text"]}>
                              Эргэн төлөгдөх хугацаа
                            </div>
                          </Col>
                          <Col flex="none">
                            <div className={styles["dloan-detail-maxValue"]}>
                              {dataTable &&
                                typeof activeDuration == "number" &&
                                moment()
                                  .add(
                                    dataTable[activeDuration]?.duration,
                                    dataTable[activeDuration]?.duration_type ===
                                      "M"
                                      ? "months"
                                      : "days"
                                  )
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
                      className={styles["dloan-border-div"]}
                    >
                      <Col span={24}>
                        <div className={styles["dloan-change-title"]}>
                          Зээлийн гэрээ
                        </div>
                      </Col>
                      <Col span={24}>
                        <div dangerouslySetInnerHTML={{ __html: html }} />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </>
            )}
          </Row>
        </Col>
        {status == 1 ? (
          <Col span={24}>
            <Row
              justify={"center"}
              align="top"
              style={{ height: "100%" }}
              className={styles[activeClass ? "" : "dloan-change-div"]}
            >
              <Col span={20}>
                <Button
                  type="primary"
                  loading={loadings}
                  className={styles["dloan-button-contiune"]}
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
                  <div className={styles["dloan-modal-title"]}>
                    ЗЭЭЛ АВАХ ЗАХИАЛГЫН НӨХЦӨЛ
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
                              style={{ color: "green" }}
                              onChange={() => {
                                setChecked(!checked);
                              }}
                            >
                              <div className={styles["dloan-checkbox-text"]}>
                                Зээлийн үйлчилгээний нөхцөл
                              </div>
                            </Checkbox>
                          </Form.Item>
                        </Col>
                        <Col xs={24} lg={20}>
                          <Row
                            justify="space-between"
                            className="gap-3"
                            gutter={10}
                            wrap={false}
                          >
                            <Button
                              className={styles["dloan-button-back"]}
                              onClick={() => setIsModalOpen(false)}
                            >
                              <div className={styles["dloan-button-back-text"]}>
                                Буцах
                              </div>
                            </Button>

                            <Button
                              type="primary"
                              className={styles["dloan-button-contiune"]}
                              onClick={() => {
                                form.validateFields();
                                // setChecked(!checked);
                                setIsModalOpen(false);

                                checked
                                  ? !accountInfo?.bank_account
                                    ? error({
                                        title: "Амжилтгүй",
                                        content: (
                                          <div>
                                            Та хувийн мэдээлэлээ оруулах
                                            хэрэгтэй
                                          </div>
                                        ),
                                      }) &&
                                      router.push("/dashboard/profile/bank")
                                    : accountInfo?.bank_account?.is_verify == 0
                                    ? error({
                                        title: "Амжилтгүй",
                                        content: (
                                          <div>Та дансаа баталгаажуулна уу</div>
                                        ),
                                      }) && router.push("/dashboard/profile")
                                    : setIsVerifyOpen(true)
                                  : setIsModalOpen(true);
                              }}
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
                onCancel={() => {
                  setIsCompleteOpenLoan(false);
                  setChecked(false);
                }}
                open={isCompleteOpenLoan}
                footer={null}
              >
                <Row
                  justify="center"
                  gutter={[0, 30]}
                  style={{ padding: "50px 0" }}
                >
                  <Col span={24}>
                    <Row justify="center">
                      <LottiePlayer
                        animationData={animation}
                        loop={false}
                        width={180}
                        height={44}
                      />
                    </Row>
                  </Col>
                  <Col span={16}>
                    <div className={styles["dloan-modal-complete-text"]}>
                      Таны зээлийн эрх үүсгэх захиалга амжилттай бүртгэгдлээ.
                      ФандМи биржээс таны зээлийн эрхийн хэмжээг нээж өгөх
                      болно.
                    </div>
                  </Col>
                </Row>
              </Modal>

              <Modal
                centered
                width={378}
                title={null}
                onCancel={() => {
                  setIsCompleteOpen(false);
                  setActiveClass(!activeClass);
                }}
                open={isCompleteOpen}
                footer={null}
              >
                <Row
                  justify="center"
                  gutter={[0, 30]}
                  style={{ padding: "50px 0" }}
                >
                  <Col span={24}>
                    <Row justify="center">
                      <LottiePlayer
                        animationData={animation}
                        loop={false}
                        width={180}
                        height={44}
                      />
                    </Row>
                  </Col>
                  <Col span={16}>
                    <div className={styles["dloan-modal-complete-text"]}>
                      Таны{" "}
                      <span className={styles["dloan-rate-profit"]}>
                        {numberToCurrency(inputValue)}
                      </span>{" "}
                      төгрөг{" "}
                      <span className={styles["dloan-modal-complete-number"]}>
                        {dataTable &&
                          typeof activeDuration == "number" &&
                          // @ts-ignore
                          dataTable[activeDuration]?.duration}
                      </span>{" "}
                      {dataTable[activeDuration]?.duration_type === "M"
                        ? "сарын"
                        : "хоногийн"}{" "}
                      хугацаатай{" "}
                      <span className={styles["dloan-modal-complete-number"]}>
                        {loan?.loan_rate_month} %
                      </span>{" "}
                      хувийн хүүтэй зээл авах захиалга амжилттай бүртгэгдлээ.
                    </div>
                  </Col>
                </Row>
              </Modal>
            </Row>
            <Row
              justify={"center"}
              align="bottom"
              style={{ height: "100%" }}
              className={styles[activeClass ? "dloan-change-div" : ""]}
            >
              <Col span={20}>
                <Row align="middle">
                  <Col flex="auto">
                    <Button
                      type="default"
                      className={styles["dloan-button-back"]}
                      onClick={() => router.push("/dashboard/myfund")}
                    >
                      <Col flex={"auto"}>
                        <div className={styles["dloan-change-button-text"]}>
                          Хаах
                        </div>
                      </Col>
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        ) : (
          <></>
        )}
      </Row>
    );
  }
};

export default Loan;

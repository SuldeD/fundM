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
import styles from "../../../styles/dloan.module.css";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { LeftOutlined, CalculatorOutlined } from "@ant-design/icons";
import { numberToCurrency } from "../../../utils/number.helpers";
import { HeaderDashboard } from "../../../components/header";
import { Loaderr } from "app/components/Loader";
import { useApiContext } from "app/context/dashboardApiContext";
import moment from "moment";
import { useRequireAuth } from "app/utils/auth";
import InputCode from "app/components/input";
import { api } from "app/utils/api";

export const Loan = () => {
  const { loan, data, loanReqMutate, loanReqConfirmMut, accountInfo } =
    useApiContext();
  useRequireAuth();
  const { error } = Modal;

  const { mutate: loanMutate } = api.loan.loanSearch.useMutation();
  const { mutate: walletToBank } = api.loan.walletToBank.useMutation();
  const { mutate: walletToBankConfirm } =
    api.loan.walletToBankConfirm.useMutation();
  const { mutate: getContent } = api.loan.getContent.useMutation();

  const [checked, setChecked] = useState<boolean>(false);
  const [requestId, setRequestId] = useState();
  const [activeClass, setActiveClass] = useState(true);

  const minValue = Number(loan?.loan_min_amount);
  const maxValue = Number(loan?.loan_max_amount);
  const rate = loan?.loan_rate_day.slice(0, 4);

  const [form] = Form.useForm();
  const termsRef = useRef();
  const router = useRouter();

  const [inputValue, setInputValue] = useState(minValue);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState<boolean>(false);
  const [transaction_id, setTransaction_id] = useState<any>();
  const [form_token, setForm_token] = useState<any>();
  const [pin_code, setPin_code] = useState<any>();
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const [dataTable, setTable] = useState<any[]>(loan?.duration);
  const [activeDuration, setActiveDuration] = useState(0);
  const [loanReq, setLoanReq] = useState<any[]>([]);
  const [pageHtml, setPageHtml] = useState<any>();
  const myRef = useRef<any>();

  useEffect(() => {
    setTable(loan?.duration);
  }, []);

  useEffect(() => {
    loanMutate(
      {
        order: "date",
        order_up: "1",
        page: "1",
        page_size: "20",
        filter_type: "dp",
      },
      {
        onSuccess: (data: {
          success: any;
          request_id: any;
          loan_requests: import("react").SetStateAction<any[]>;
          description: any;
        }) => {
          if (data.success) {
            setLoanReq(data?.loan_requests);
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

  useEffect(() => {
    getContent(
      {
        code: "loan",
      },
      {
        onSuccess: (
          /** @type {{ success: any; loan_requests: import("react").SetStateAction<undefined>; description: any; }} */ data
        ) => {
          if (data?.success) {
            myRef.current.innerHTML = data?.page_html && data?.page_html;
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

  function submit() {
    loanReq?.forEach((ln: any) => {
      if (ln.is_status == "5" && ln.product_type_code == "loan") {
        return walletToBank(
          {
            account_name: accountInfo?.bank_account?.account_name,
            amount: inputValue.toString(),
            description: "a",
            // @ts-ignore
            loan_duration_day:
              dataTable &&
              Number(dataTable[activeDuration].duration).toString(),
            loan_duration_month: "D",
            pay_day: moment()
              // @ts-ignore
              .add(
                // @ts-ignore
                dataTable[activeDuration].duration,
                "days"
              )
              .calendar(),
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
                console.log(data);
                setTransaction_id(data?.transaction_id);
                setForm_token(data?.form_token);
                setIsVerifyOpen(true);
                setPin_code(data?.pin_code);
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
        throw loanReqMutate(
          {
            product_id: (loan?.product_id).toString(),
            loan_amount: inputValue.toString(),
            repayment_amount: (
              Number(dataTable[activeDuration].duration) *
                rate *
                (inputValue / 100) +
              inputValue +
              Number(dataTable[activeDuration].duration) *
                Number(dataTable[activeDuration].fee_percent) *
                (inputValue / 100)
            ).toString(),
            loan_month: dataTable[activeDuration].LoanDuration,
          },
          {
            onSuccess: (data: {
              success: any;
              request_id: any;
              loan_requests: import("react").SetStateAction<undefined>;
              description: any;
            }) => {
              if (data.success) {
                console.log(data);
                setRequestId(data?.request_id);
                setIsVerifyOpen(true);
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
    });
  }

  function verifyCompleteModal(code: any) {
    if (code) {
      loanReq?.forEach((ln: any) => {
        if (ln.is_status == "5" && ln.product_type_code == "loan") {
          return walletToBankConfirm(
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
          throw loanReqConfirmMut(
            {
              request_id: requestId && requestId,
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
                  console.log(data);
                  setIsVerifyOpen(false);
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
      });
    } else {
      error({
        title: "Амжилтгүй",
        content: <div>FundMe кодоо оруулна уу!!!</div>,
      });
    }
  }

  if (!data) {
    return <Loaderr />;
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
              title={"Зээл авах хүсэлт"}
              subTitle={
                activeClass
                  ? "Харилцагч та зээлийн эрхийн хэмжээгээ өөрт ойр байрлах салбар нэгжид хандан нээлгэнэ үү."
                  : "Харилцагч та миний санхүүжилт цэсээс нийт жагсаалтаа харах боломжтой."
              }
            />
            <Row
              justify="center"
              gutter={[0, 20]}
              className={styles[activeClass ? "" : "dloan-change-div"]}
            >
              <Col span={22}>
                <Row gutter={[22, 10]} justify="space-between" align="middle">
                  <Col span={24}>
                    <div className={styles["dloan-slider-input-title"]}>
                      Зээлийн хэмжээ
                    </div>
                  </Col>
                  <Col span={8}>
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
                  <Col span={16}>
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
                    <Slider
                      min={minValue}
                      step={10000}
                      max={maxValue}
                      onChange={(e) => setInputValue(e)}
                      value={typeof inputValue === "number" ? inputValue : 0}
                    />
                  </Col>
                </Row>
              </Col>
              <Col span={22}>
                <Row
                  // @ts-ignore
                  gutter={[22]}
                >
                  <Col span={8}>
                    <Row gutter={[0, 10]}>
                      <Col span={24}>
                        <div className={styles["dloan-slider-input-title"]}>
                          Зарласан хүү
                        </div>
                      </Col>
                      <Col span={24}>
                        <Row
                          className={styles["dloan-rate-div"]}
                          align="middle"
                          justify="center"
                        >
                          <div className={styles["dloan-rate-text"]}>
                            {loan && loan?.loan_rate_month.slice(0, 4)}
                          </div>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={16}>
                    <Row gutter={[0, 10]}>
                      <Col span={24}>
                        <div className={styles["dloan-slider-input-title"]}>
                          Хугацаа сонгох
                        </div>
                      </Col>

                      <Col span={24}>
                        <Row wrap={false} gutter={30} align="middle">
                          {dataTable &&
                            dataTable?.map((el: any, idx: any) => (
                              <Col flex="none" key={`data-${idx}`}>
                                <Button
                                  onClick={() =>
                                    setActiveDuration(el.row_order - 1)
                                  }
                                  className={
                                    styles[
                                      activeDuration === el.row_order - 1
                                        ? "dloan-button-active"
                                        : "dloan-button"
                                    ]
                                  }
                                >
                                  <div
                                    className={
                                      styles[
                                        activeDuration === el.row_order - 1
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
                                        activeDuration === el.row_order - 1
                                          ? "dloan-button-text-active"
                                          : "dloan-button-text"
                                      ]
                                    }
                                  >
                                    хоног
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
                              (inputValue / 100) *
                                rate *
                                Number(dataTable[activeDuration].duration)
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
                            // @ts-ignore
                            numberToCurrency(
                              (inputValue / 100) *
                                Number(dataTable[activeDuration].fee_percent) *
                                Number(dataTable[activeDuration].duration)
                            )}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row justify="space-between" align="middle">
                      <Col flex="none">
                        <div className={styles["dloan-detail-text"]}>
                          Нийт төлөх зээлийн хэмжээ
                        </div>
                      </Col>
                      <Col flex="none">
                        <div className={styles["dloan-detail-maxValue"]}>
                          {dataTable &&
                            typeof activeDuration == "number" &&
                            numberToCurrency(
                              (inputValue / 100) *
                                rate *
                                // @ts-ignore
                                Number(dataTable[activeDuration].duration) +
                                inputValue +
                                (inputValue / 100) *
                                  Number(
                                    // @ts-ignore
                                    dataTable[activeDuration].fee_percent
                                  ) *
                                  // @ts-ignore
                                  Number(dataTable[activeDuration].duration)
                            )}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row justify="space-between" align="middle">
                      <Col flex="none">
                        <div className={styles["dloan-detail-text"]}>
                          Хүүгийн хэмжээ (хоногоор)
                        </div>
                      </Col>
                      <Col flex="none">
                        <div className={styles["dloan-detail-maxValue"]}>
                          {loan && rate} %
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
                            // @ts-ignore
                            dataTable[activeDuration].duration}{" "}
                          хоног
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
                              // @ts-ignore
                              .add(
                                // @ts-ignore
                                dataTable[activeDuration].duration,
                                "days"
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
                  <Col flex="none">
                    <Checkbox
                      // @ts-ignore
                      ref={termsRef}
                      onChange={(e) => setChecked(e.target.checked)}
                      checked={checked}
                      disabled
                    />
                  </Col>
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
                              (inputValue / 100) *
                                rate *
                                // @ts-ignore
                                Number(dataTable[activeDuration].duration)
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
                              (inputValue / 100) *
                                // @ts-ignore
                                Number(dataTable[activeDuration].fee_percent) *
                                // @ts-ignore
                                Number(dataTable[activeDuration].duration)
                            )}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row justify="space-between" align="middle">
                      <Col flex="none">
                        <div className={styles["dloan-detail-text"]}>
                          Нийт төлөх зээлийн хэмжээ
                        </div>
                      </Col>
                      <Col flex="none">
                        <div className={styles["dloan-detail-maxValue"]}>
                          {dataTable &&
                            typeof activeDuration == "number" &&
                            numberToCurrency(
                              (inputValue / 100) *
                                rate *
                                // @ts-ignore
                                Number(dataTable[activeDuration].duration) +
                                inputValue +
                                (inputValue / 100) *
                                  Number(
                                    // @ts-ignore
                                    dataTable[activeDuration].fee_percent
                                  ) *
                                  // @ts-ignore
                                  Number(dataTable[activeDuration].duration)
                            )}
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row justify="space-between" align="middle">
                      <Col flex="none">
                        <div className={styles["dloan-detail-text"]}>
                          Хүүгийн хэмжээ (хоногоор)
                        </div>
                      </Col>
                      <Col flex="none">
                        <div className={styles["dloan-detail-maxValue"]}>
                          {rate} %
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
                            // @ts-ignore
                            dataTable[activeDuration].duration}{" "}
                          хоног
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
                              // @ts-ignore
                              .add(
                                // @ts-ignore
                                dataTable[activeDuration].duration,
                                "days"
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
                    <div className={styles["dloan-contract-text"]}>
                      Итгэлцэл үйлчилгээ гэдэг нь харилцагч таны хөрөнгийг
                      итгэлцлийн үндсэн дээр гэрээ байгуулан авч зах зээлийн
                      эрсдэл үнэгүйдлээс хамгаалж өндөр үр шим /ашиг/ олж өгөх
                      зорилгоор харилцан ашигтай хамтран ажиллах үйлчилгээ юм.
                      Итгэлцлийн хөрөнгө нь ямар ч төрөл, хэлбэр, үнэлгээтэй
                      байж болох ба түүний үр шимийг хоёр тал өөрсдийн
                      хэрэгцээнд тулгуурлан харилцан ашигтай ажиллах боломжийг
                      олгодог санхүүгийн хэрэгсэл юм. {<br />}Итгэлцлийн
                      үйлчилгээний оролцогч талууд {<br />} Итгэмжлэгч –
                      Хөрөнгөө удирдах, захиран зарцуулах эрхээ гэрээний үндсэн
                      дээр бусдад шилжүүлж түүнээс үүсэх үр шимийг хүртэгч.{" "}
                      {<br />} Хувь хүртэгч – Итгэмжлэгчтэй байгуулсан гэрээний
                      дагуу итгэмжлэгдсэн хөрөнгийн үр шимийг хүртэгч. Гэхдээ
                      энэ нь итгэмжлэгдсэн хөрөнгийн эзэмшигч, захиран зарцуулах
                      эрх бүхий этгээд биш юм. {<br />} Итгэмжлэгдэгч – Хувь
                      хүн, Бизнес эрхлэгч, Аж ахуй нэгжийн аль нь ч байж болох
                      ба итгэмжлэгчтэй байгуулсан хөрөнгө удирдах гэрээний дагуу
                      хөрөнгийн үнэ цэнийг өсгөх, хадгалах, үр өгөөж бий
                      болгогч.
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Row>
        </Col>
        <Col span={22}>
          <Row
            justify={"center"}
            align="bottom"
            style={{ height: "100%" }}
            className={styles[activeClass ? "" : "dloan-change-div"]}
          >
            <Col span={22}>
              <Row justify="space-between" align="middle">
                <Col flex="none">
                  <Button
                    className={styles["dloan-button-back"]}
                    onClick={() => router.back()}
                  >
                    <Row align="middle">
                      <Col flex="none">{<LeftOutlined />}</Col>
                      <Col flex={"auto"}>
                        <div className={styles["dloan-button-back-text"]}>
                          Буцах
                        </div>
                      </Col>
                    </Row>
                  </Button>
                </Col>
                <Col flex="none">
                  <Button
                    type="primary"
                    className={`${styles["dloan-button-contiune"]} bg-primary`}
                    onClick={() => {
                      // @ts-ignore
                      termsRef.current?.input.checked
                        ? !accountInfo.bank_account
                          ? error({
                              title: "Амжилтгүй",
                              content: (
                                <div>Та хувийн мэдээлэлээ оруулах хэрэгтэй</div>
                              ),
                            }) &&
                            // @ts-ignore
                            router.push("/dashboard/profile/bank")
                          : submit()
                        : setIsModalOpen(true);
                    }}
                  >
                    <CalculatorOutlined />
                    Үргэлжлүүлэх
                  </Button>
                </Col>
              </Row>
              <Modal
                centered
                closable={false}
                width="50%"
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
                      <div ref={myRef && myRef}></div>
                    </Col>
                    <Form form={form}>
                      <Row justify="center" gutter={[0, 10]}>
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
                              <div className={styles["dloan-checkbox-text"]}>
                                Зээлийн үйлчилгээний нөхцөл
                              </div>
                            </Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Row justify="space-between">
                            <Col flex="none">
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
                            </Col>
                            <Col flex="none">
                              <Form.Item>
                                <Button
                                  type="primary"
                                  className={`${styles["dloan-button-contiune"]} bg-primary`}
                                  onClick={() => {
                                    form.validateFields();
                                    setChecked(!checked);
                                    setIsModalOpen(false);
                                  }}
                                  htmlType="submit"
                                >
                                  <CalculatorOutlined />
                                  Үргэлжлүүлэх
                                </Button>
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                </Row>
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
                      <Image
                        width={56}
                        src={"/images/check.svg"}
                        preview={false}
                        alt="Header Logo"
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
                          dataTable[activeDuration].duration}
                      </span>{" "}
                      хоногийн хугацаатай{" "}
                      <span className={styles["dloan-modal-complete-number"]}>
                        {rate}
                      </span>{" "}
                      хувийн өгөөжтэй санхүүжилт өгөх хүсэлт амжилттай
                      бүртгэгдлээ.
                    </div>
                  </Col>
                </Row>
              </Modal>
            </Col>
          </Row>
          <Row
            justify={"center"}
            align="bottom"
            style={{ height: "100%" }}
            className={styles[activeClass ? "dloan-change-div" : ""]}
          >
            <Col span={22}>
              <Row align="middle">
                <Col flex="none">
                  <Button
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
      </Row>
    );
  }
};

export default Loan;

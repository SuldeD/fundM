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
import styles from "../../../styles/foundation.module.css";
import { useRouter } from "next/router";
import { useMemo, useRef, useState } from "react";
import { numberToCurrency } from "../../../utils/number.helpers";
import { HeaderDashboard } from "../../../components/header";
import { Loaderr } from "app/components/Loader";
import { useRequireAuth } from "app/utils/auth";
import moment from "moment";
import InputCode from "app/components/input";
import { api } from "app/utils/api";
import { useSession } from "next-auth/react";

export const Foundation = () => {
  const { data } = useSession();
  const termsRef: any = useRef();
  const router = useRouter();
  const [form] = Form.useForm();
  const { error } = Modal;
  useRequireAuth();

  //mutates
  const { mutate: repayment } = api.loan.repayment.useMutation();

  //queries
  const { mutate: loanReqMutate } = api.loan.loanRequest.useMutation();
  const { mutate: loanReqConfirmMut } =
    api.loan.loanRequestConfirm.useMutation();
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
  const [inputValue, setInputValue] = useState<number>(50000);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState<boolean>(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState<boolean>(false);
  const [activeDuration, setActiveDuration] = useState<number>(0);
  const [requestId, setRequestId] = useState<string>("");
  const [foundationBankData, setFoundationBankData] = useState<any>();
  const [checked, setChecked] = useState<boolean>(false);

  //constants
  const saving = useMemo(() => {
    return loanData?.product_list?.find(
      (it: any) => it.product_code === "saving"
    );
  }, [loanData]);
  const dataTable = saving?.duration;
  const html = useMemo(() => {
    return getContent?.page_html;
  }, [getContent]);
  const minValue = Number(saving && saving?.loan_min_amount);
  const maxValue = Number(saving && saving?.loan_max_amount);
  const rate = Number(saving?.loan_rate_day);

  //functions
  function submit() {
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
  function verifyCompleteModal(code: any) {
    if (code) {
      loanReqConfirmMut(
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
              setIsVerifyOpen(false);
              setIsCompleteOpen(true);
              repayment(
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
                      setFoundationBankData(data);
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
    setChecked(!checked);
    setIsModalOpen(false);
  };

  if (!data) {
    <Loaderr />;
  } else {
    return (
      <Row
        justify="center"
        className={styles["foundation-main-row"]}
        gutter={[0, 30]}
      >
        <Col span={22}>
          <Row gutter={[0, 20]} justify="center">
            <HeaderDashboard
              title={"Санхүүжилт өгөх хүсэлт"}
              subTitle={
                "Харилцагч та миний хүсэлтүүд цэсээс нийт жагсаалтаа харах боломжтой."
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
                    <Slider
                      min={minValue}
                      max={maxValue}
                      onChange={(e) => setInputValue(e)}
                      value={typeof inputValue === "number" ? inputValue : 0}
                      step={100000}
                    />
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
                          Зарласан хүү
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
              <Col xs={24} lg={22}>
                <Row className={styles["foundation-detail"]} gutter={[0, 22]}>
                  <Col span={24}>
                    <Row justify="space-between" align="middle">
                      <Col flex="none">
                        <div className={styles["foundation-detail-text"]}>
                          Санхүүжилтын хэмжээ
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
                        <div className={styles["foundation-detail-maxValue"]}>
                          {dataTable &&
                            typeof activeDuration == "number" &&
                            numberToCurrency(
                              Math.floor(
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
                  <Col flex="none">
                    <Checkbox
                      ref={termsRef}
                      onChange={(e) =>
                        checked ? setChecked(true) : setChecked(false)
                      }
                      checked={checked}
                    />
                  </Col>
                  <Col flex="none">
                    <div className={styles["foundation-checkbox-text"]}>
                      <a onClick={() => setIsModalOpen(true)}>
                        Санхүүжилтын үйлчилгээний нөхцөл
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
                          Санхүүжилтын хэмжээ
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
                  {/* <Col span={24}>
                    <Row justify="space-between" align="middle">
                      <Col flex="none">
                        <div className={styles["foundation-detail-text"]}>
                          Хүүгийн хэмжээ (хоногоор)
                        </div>
                      </Col>
                      <Col flex="none">
                        <div className={styles["foundation-detail-maxValue"]}>
                          {saving?.loan_rate_day.slice(0, 4)} %
                        </div>
                      </Col>
                    </Row>
                  </Col> */}
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
        <Col span={24}>
          <Row justify={"center"} align="top" style={{ height: "100%" }}>
            <Col xs={22} lg={20}>
              <Button
                type="primary"
                className={styles["foundation-button-contiune"]}
                onClick={() => {
                  termsRef.current?.input.checked
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
                        }) && router.push("/dashboard/profile/bank")
                      : submit()
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
                          <Checkbox>
                            <div className={styles["foundation-checkbox-text"]}>
                              Санхүүжилтын үйлчилгээний нөхцөл
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
                            onClick={() => setIsModalOpen(false)}
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
                Санхүүжилт өгөх хүсэлт дансаар шилжүүлэх
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
                        navigator.clipboard.writeText(
                          foundationBankData?.product?.transaction_description
                        );
                      }}
                    />
                  </div>
                </div>

                <div className="mt-[30px] text-xs font-normal leading-[18px] text-red-600">
                  <p>
                    Дараах тохиолдлуудад таны данс цэнэглэлт амжилтгүй болох
                    бөгөөд ажлын 2 хоногийн дотор анх шилжүүлсэн данс руу буцаан
                    шилжүүлэхийг АНХААРНА УУ!
                  </p>
                  <ol className="list-disc ps-[35px] pt-[15px]">
                    <li>Гүйлгээний утга буруу</li>
                    <li>KYC баталгаажуулалт хийгдээгүй</li>
                    <li>Бүртгэлгүй банкны данснаас шилжүүлэг хийсэн</li>
                    <li>
                      Бүртгэлтэй, гэхдээ баталгаажуулаагүй данснаас шилжүүлэг
                      хийсэн
                    </li>
                  </ol>
                </div>
              </div>
            </Modal>
          </Row>
        </Col>
      </Row>
    );
  }
};

export default Foundation;

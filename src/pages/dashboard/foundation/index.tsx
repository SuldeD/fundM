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
import styles from "../../../styles/foundation.module.css";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { LeftOutlined, CalculatorOutlined } from "@ant-design/icons";
import { numberToCurrency } from "../../../utils/number.helpers";
import { HeaderDashboard } from "../../../components/header";
import { Loaderr } from "app/components/Loader";
import { useApiContext } from "app/context/dashboardApiContext";
import { useRequireAuth } from "app/utils/auth";
import moment from "moment";
import InputCode from "app/components/input";
import { api } from "app/utils/api";

export const Foundation = () => {
  const [checked, setChecked] = useState(false);
  const myRef = useRef<any>();

  const { data, saving, loanReqMutate, loanReqConfirmMut, accountInfo } =
    useApiContext();
  useRequireAuth();
  const { error } = Modal;

  const { mutate: getContent } = api.loan.getContent.useMutation();

  const toggleChecked = () => {
    setChecked(!checked);
  };

  // @ts-ignore
  const onChecked = (e) => {
    setChecked(e.target.checked);
  };

  const [activeClass, setActiveClass] = useState(true);
  const changeClass = () => {
    setActiveClass(!activeClass);
    setChecked(!checked);
  };

  const minValue = Number(saving && saving?.loan_min_amount);
  const maxValue = Number(saving && saving?.loan_max_amount);
  const rate = saving?.loan_rate_month.slice(0, 4);

  const [form] = Form.useForm();
  const termsRef = useRef();
  const router = useRouter();

  const [inputValue, setInputValue] = useState(minValue);
  // @ts-ignore
  const onChange = (newValue) => {
    setInputValue(newValue);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    await form.validateFields();
    toggleChecked();
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [isVerifyOpen, setIsVerifyOpen] = useState<boolean>(false);
  const verifyShowModal = () => {
    setIsVerifyOpen(true);
  };

  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const completeShowModal = () => {
    setIsCompleteOpen(true);
  };

  const completeCancelModal = () => {
    setIsCompleteOpen(false);
    changeClass();
  };

  const [dataTable, setTable] = useState<any[]>(saving?.duration);

  useEffect(() => {
    setTable(saving?.duration);
  }, []);

  const [activeDuration, setActiveDuration] = useState(0);

  const [requestId, setRequestId] = useState<string>("");

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
            verifyShowModal();
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
              completeShowModal();
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

  useEffect(() => {
    getContent(
      {
        code: "saving",
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
                activeClass
                  ? "Харилцагч та зээлийн эрхийн хэмжээгээ өөрт ойр байрлах салбар нэгжид хандан нээлгэнэ үү."
                  : "Харилцагч та миний санхүүжилт цэсээс нийт жагсаалтаа харах боломжтой."
              }
            />
            <Row
              justify="center"
              gutter={[0, 20]}
              className={styles[activeClass ? "" : "foundation-change-div"]}
            >
              <Col span={22}>
                <Row gutter={[22, 10]} justify="space-between" align="middle">
                  <Col span={24}>
                    <div className={styles["foundation-slider-input-title"]}>
                      Санхүүжилт өгөх хэмжээ
                    </div>
                  </Col>
                  <Col span={8}>
                    <InputNumber
                      size="large"
                      min={minValue}
                      max={maxValue}
                      value={inputValue}
                      defaultValue={minValue}
                      onChange={onChange}
                      formatter={(value) => numberToCurrency(value)}
                      className={styles["foundation-slider-input"]}
                    />
                  </Col>
                  <Col span={16}>
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
                      onChange={onChange}
                      value={typeof inputValue === "number" ? inputValue : 0}
                      step={100000}
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
                            {rate}
                          </div>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={16}>
                    <Row gutter={[0, 10]}>
                      <Col span={24}>
                        <div
                          className={styles["foundation-slider-input-title"]}
                        >
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
                                        ? "foundation-button-active"
                                        : "foundation-button"
                                    ]
                                  }
                                >
                                  <div
                                    className={
                                      styles[
                                        activeDuration === el.row_order - 1
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
                                        activeDuration === el.row_order - 1
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
                      // @ts-ignore
                      ref={termsRef}
                      onChange={onChecked}
                      checked={checked}
                      disabled
                    />
                  </Col>
                  <Col flex="none">
                    <div className={styles["foundation-checkbox-text"]}>
                      <a onClick={showModal}>Зээлийн үйлчилгээний нөхцөл</a>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row
              justify="center"
              gutter={[0, 25]}
              className={styles[activeClass ? "foundation-change-div" : ""]}
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
                              Number(
                                dataTable[activeDuration].duration *
                                  (inputValue / 100) *
                                  rate
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
                          Хүүгийн хэмжээ (хоногоор)
                        </div>
                      </Col>
                      <Col flex="none">
                        <div className={styles["foundation-detail-maxValue"]}>
                          {saving?.loan_rate_day.slice(0, 4)} %
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
            className={styles[activeClass ? "" : "foundation-change-div"]}
          >
            <Col span={22}>
              <Row justify="space-between" align="middle">
                <Col flex="none">
                  <Button
                    className={styles["foundation-button-back"]}
                    onClick={() => router.back()}
                  >
                    <Row align="middle">
                      <Col flex="none">{<LeftOutlined />}</Col>
                      <Col flex={"auto"}>
                        <div className={styles["foundation-button-back-text"]}>
                          Буцах
                        </div>
                      </Col>
                    </Row>
                  </Button>
                </Col>
                <Col flex="none">
                  <Button
                    type="primary"
                    className={`${styles["foundation-button-contiune"]} bg-primary`}
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
                        : showModal();
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
                      <div ref={myRef.current && myRef}></div>
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
                              <div
                                className={styles["foundation-checkbox-text"]}
                              >
                                Зээлийн үйлчилгээний нөхцөл
                              </div>
                            </Checkbox>
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Row justify="space-between">
                            <Col flex="none">
                              <Button
                                className={styles["foundation-button-back"]}
                                onClick={handleCancel}
                              >
                                <div
                                  className={
                                    styles["foundation-button-back-text"]
                                  }
                                >
                                  Буцах
                                </div>
                              </Button>
                            </Col>
                            <Col flex="none">
                              <Form.Item>
                                <Button
                                  type="primary"
                                  className={`${styles["foundation-button-contiune"]} bg-primary`}
                                  onClick={handleOk}
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
                onCancel={completeCancelModal}
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
                    <div className={styles["foundation-modal-complete-text"]}>
                      Таны
                      <span className={styles["foundation-rate-profit"]}>
                        {" "}
                        {numberToCurrency(inputValue)}{" "}
                      </span>
                      төгрөг
                      <span
                        className={styles["foundation-modal-complete-number"]}
                      >
                        {" "}
                        {typeof activeDuration == "number" &&
                          dataTable &&
                          dataTable[activeDuration].day}{" "}
                      </span>
                      хоногийн хугацаатай{" "}
                      <span
                        className={styles["foundation-modal-complete-number"]}
                      >
                        {" "}
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
            className={styles[activeClass ? "foundation-change-div" : ""]}
          >
            <Col span={22}>
              <Row>
                <Col flex="none">
                  <Button
                    className={styles["foundation-button-back"]}
                    onClick={() => router.push("/dashboard/myfund")}
                  >
                    <div className={styles["foundation-change-button-text"]}>
                      Хаах
                    </div>
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

export default Foundation;

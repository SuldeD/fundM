import {
  Row,
  Col,
  Slider,
  InputNumber,
  Button,
  Checkbox,
  Modal,
  Input,
  Image,
  Form,
} from "antd";
import styles from "../../../styles/dloan.module.css";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { LeftOutlined, CalculatorOutlined } from "@ant-design/icons";
import { numberToCurrency } from "../../../utils/number.helpers";
import { HeaderDashboard } from "../../../components/header";
import { Loaderr } from "app/components/Loader";
import { useApiContext } from "app/context/dashboardApiContext";
import moment from "moment";
import { useRequireAuth } from "app/utils/auth";

export const Loan = () => {
  const { loan, data, loanReqMutate, loanReqConfirmMut } = useApiContext();
  useRequireAuth();
  const { error } = Modal;

  const [checked, setChecked] = useState(false);
  const [requestId, setRequestId] = useState();
  const [password, setPassword] = useState(null);
  const toggleChecked = () => {
    setChecked(!checked);
  };

  const onChecked = (
    /** @type {{ target: { checked: boolean | ((prevState: boolean) => boolean); }; }} */ e
  ) => {
    setChecked(e.target.checked);
  };

  const [activeClass, setActiveClass] = useState(true);
  const changeClass = () => {
    setActiveClass(!activeClass);
  };

  const minValue = Number(loan && loan?.loan_min_amount);
  const maxValue = Number(loan && loan?.loan_max_amount);
  const rate = loan?.loan_rate_day.slice(0, 4);
  const fee_percent = Number(loan?.fee_percent);

  const [form] = Form.useForm();
  const termsRef = useRef();
  const router = useRouter();

  const [inputValue, setInputValue] = useState(minValue);

  const onChange = (
    /** @type {import("react").SetStateAction<number>} */ newValue
  ) => {
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

  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const verifyShowModal = () => {
    setIsVerifyOpen(true);
  };
  const verifyCompleteModal = async () => {
    loanReqConfirmMut(
      {
        request_id: requestId && requestId,
        password: password && password,
      },
      {
        onSuccess: (
          /** @type {{ success: any; request_id:any; loan_requests: import("react").SetStateAction<undefined>; description: any; }} */ data
        ) => {
          if (data.success) {
            console.log(data);
          } else {
            console.log("err", data);
            error({
              title: "Амжилтгүй",
              content: <div>{data?.description || null}</div>,
            });
          }
        },
      }
    );
    setIsVerifyOpen(false);
    completeShowModal();
  };
  const verifyCancelModal = () => {
    setIsVerifyOpen(false);
  };

  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const completeShowModal = () => {
    setIsCompleteOpen(true);
  };

  const completeCancelModal = async () => {
    await setIsCompleteOpen(false);
    changeClass();
  };

  const dataTable = [
    {
      id: 1,
      day: "7",
      fee_percent: fee_percent,
    },
    {
      id: 2,
      day: "14",
      fee_percent: fee_percent,
    },
    {
      id: 3,
      day: "21",
      fee_percent: fee_percent,
    },
    {
      id: 4,
      day: "28",
      fee_percent: fee_percent,
    },
  ];
  const [activeDuration, setActiveDuration] = useState(0);

  const changeActive = (
    /** @type {import("react").SetStateAction<number>} */ indx
  ) => {
    setActiveDuration(indx);
  };

  function submit() {
    loanReqMutate(
      {
        product_id: (loan?.product_id).toString(),
        loan_amount: inputValue.toString(),
        repayment_amount: (
          (inputValue / 100) *
            rate *
            // @ts-ignore
            Number(dataTable[activeDuration].day) +
          inputValue +
          (inputValue / 100) *
            Number(
              // @ts-ignore
              dataTable[activeDuration].fee_percent
            ) *
            // @ts-ignore
            Number(dataTable[activeDuration].day)
        ).toString(),
        loan_month: moment()
          // @ts-ignore
          .add(dataTable[activeDuration].day, "days")
          .calendar()
          .toString(),
      },
      {
        onSuccess: (
          /** @type {{ success: any; request_id:any; loan_requests: import("react").SetStateAction<undefined>; description: any; }} */ data
        ) => {
          if (data.success) {
            setRequestId(data?.request_id);
            verifyShowModal();
          } else {
            console.log("err", data);
            error({
              title: "Амжилтгүй",
              content: <div>{data?.description || null}</div>,
            });
          }
        },
      }
    );
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
                      // @ts-ignore
                      onChange={onChange}
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
                      onChange={onChange}
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
                          {dataTable.map((el, idx) => (
                            <Col flex="none" key={`data-${idx}`}>
                              <Button
                                onClick={() => changeActive(idx)}
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
                                  {el.day}
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
                          {typeof activeDuration == "number" &&
                            numberToCurrency(
                              (inputValue / 100) *
                                rate *
                                // @ts-ignore
                                Number(dataTable[activeDuration].day)
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
                          {typeof activeDuration == "number" &&
                            // @ts-ignore
                            numberToCurrency(
                              (inputValue / 100) *
                                // @ts-ignore
                                Number(dataTable[activeDuration].fee_percent) *
                                // @ts-ignore
                                Number(dataTable[activeDuration].day)
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
                          {typeof activeDuration == "number" &&
                            numberToCurrency(
                              (inputValue / 100) *
                                rate *
                                // @ts-ignore
                                Number(dataTable[activeDuration].day) +
                                inputValue +
                                (inputValue / 100) *
                                  Number(
                                    // @ts-ignore
                                    dataTable[activeDuration].fee_percent
                                  ) *
                                  // @ts-ignore
                                  Number(dataTable[activeDuration].day)
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
                          {typeof activeDuration == "number" &&
                            // @ts-ignore
                            dataTable[activeDuration].day}{" "}
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
                          {typeof activeDuration == "number" &&
                            moment()
                              // @ts-ignore
                              .add(dataTable[activeDuration].day, "days")
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
                    <div className={styles["dloan-checkbox-text"]}>
                      <a onClick={showModal}>Зээлийн үйлчилгээний нөхцөл</a>
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
                          {typeof activeDuration == "number" &&
                            numberToCurrency(
                              (inputValue / 100) *
                                rate *
                                // @ts-ignore
                                Number(dataTable[activeDuration].day)
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
                          {typeof activeDuration == "number" &&
                            numberToCurrency(
                              (inputValue / 100) *
                                // @ts-ignore
                                Number(dataTable[activeDuration].fee_percent) *
                                // @ts-ignore
                                Number(dataTable[activeDuration].day)
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
                          {typeof activeDuration == "number" &&
                            numberToCurrency(
                              (inputValue / 100) *
                                rate *
                                // @ts-ignore
                                Number(dataTable[activeDuration].day) +
                                inputValue +
                                (inputValue / 100) *
                                  Number(
                                    // @ts-ignore
                                    dataTable[activeDuration].fee_percent
                                  ) *
                                  // @ts-ignore
                                  Number(dataTable[activeDuration].day)
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
                          {typeof activeDuration == "number" &&
                            // @ts-ignore
                            dataTable[activeDuration].day}{" "}
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
                          {typeof activeDuration == "number" &&
                            moment()
                              // @ts-ignore
                              .add(dataTable[activeDuration].day, "days")
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
                      termsRef.current?.input.checked ? submit() : showModal();
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
                    Зээл авах хүсэлт нөхцөл
                  </div>
                }
                open={isModalOpen}
                footer={null}
              >
                <Row justify="center">
                  <Col>
                    <Col
                      span={24}
                      className={styles["dloan-modal-content-div"]}
                    >
                      <div className={styles["dloan-modal-content-text"]}>
                        Гэрээгээр нэг талаас Зээлдүүлэгчээс Зээлдэгчид тодорхой
                        хугацаа, хүүтэйгээр зээл олгох, түүнийг эргүүлэн
                        төлүүлэх үйл ажиллагаатай холбогдон үүсэх харилцаа;
                        нөгөө талаас Зээлдэгч Зээлдүүлэгчээс тодорхой хугацаа,
                        хүүтэйгээр зээл авах, түүнийг эргүүлэн төлөх, гэрээний
                        үүргийн гүйцэтгэлийг баталгаажуулж үл хөдлөх хөрөнгө
                        барьцаалуулах үйл ажиллагаатай холбогдон үүсэх харилцааг
                        тус тус зохицуулна. 1.2. Нэг талаас Зээлдэгч нь зээлийг
                        энэхүү Гэрээнд заасан хэмжээ, нөхцөлөөр авах, нөгөө
                        талаас Зээлдүүлэгч нь гэрээнд заасан нөхцөлөөр зээл
                        олгохоор харилцан хүсэл зоригоо илэрхийлсний үндсэн дээр
                        Гэрээнд заасан зээл, зээлийн хүү, анзын дор дурдсан
                        нөхцөлүүдийг харилцан тохиролцов.
                      </div>
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
                                onClick={handleCancel}
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
              <Modal
                centered
                width={378}
                title={
                  <div className={styles["dloan-modal-verify-title"]}>
                    <Image
                      width="50%"
                      src={"/logo.svg"}
                      preview={false}
                      alt="Header Logo"
                    />
                  </div>
                }
                onCancel={verifyCancelModal}
                open={isVerifyOpen}
                footer={null}
              >
                <Row justify="center">
                  <Col span={20}>
                    <Row justify="center" gutter={[0, 20]}>
                      <Col span={24}>
                        <Input.Password
                          className={styles["dloan-modal-verify-input"]}
                          placeholder="FundMe кодоо оруулна уу!!!"
                          // @ts-ignore
                          onChange={(e) => setPassword(e.target.value)}
                          maxLength={4}
                          autoFocus
                        />
                      </Col>
                      <Col span={20}>
                        <div className={styles["dloan-modal-content-text"]}>
                          Харилцагч та зээлийн эрхийн хэмжээгээ өөрт ойр байрлах
                          салбар нэгжид хандан нээлгэнэ үү.
                        </div>
                      </Col>
                      <Col span={20}>
                        <Button
                          type="primary"
                          className={styles["dloan-modal-verify-button"]}
                          onClick={verifyCompleteModal}
                        >
                          Баталгаажуулах
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Modal>

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
                    <div className={styles["dloan-modal-complete-text"]}>
                      Таны{" "}
                      <span className={styles["dloan-rate-profit"]}>
                        {numberToCurrency(inputValue)}
                      </span>{" "}
                      төгрөг{" "}
                      <span className={styles["dloan-modal-complete-number"]}>
                        {typeof activeDuration == "number" &&
                          // @ts-ignore
                          dataTable[activeDuration].day}
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
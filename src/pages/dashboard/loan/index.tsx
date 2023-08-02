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
import { useRef, useState } from "react";
import { LeftOutlined, CalculatorOutlined } from "@ant-design/icons";
import { numberToCurrency } from "../../../utils/number.helpers";
import { HeaderDashboard } from "../../../components/header";
import { Loaderr } from "app/components/Loader";
import { useApiContext } from "app/context/dashboardApiContext";
import moment from "moment";
import { useRequireAuth } from "app/utils/auth";
import InputCode from "app/components/input";

export const Loan = () => {
  const {
    loan,
    data,
    loanReqMutate,
    loanReqConfirmMut,
    accountInfo,
    myLoanOrders,
  } = useApiContext();
  useRequireAuth();
  const { error } = Modal;
  console.log("myLoanOrders", myLoanOrders);

  const [checked, setChecked] = useState<boolean>(false);
  const [requestId, setRequestId] = useState();
  const toggleChecked = () => {
    setChecked(!checked);
  };

  const onChecked = (e: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setChecked(e.target.checked);
  };

  const [activeClass, setActiveClass] = useState(true);
  const changeClass = () => {
    setActiveClass(!activeClass);
  };

  const minValue = Number(loan?.loan_min_amount);
  const maxValue = Number(loan?.loan_max_amount);
  const rate = loan?.loan_rate_month;
  const fee_percent = loan?.fee_percent;

  const [form] = Form.useForm();
  const termsRef = useRef();
  const router = useRouter();

  const [inputValue, setInputValue] = useState(minValue);

  const onChange = (newValue: number) => {
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
  const verifyCompleteModal = async (code: any) => {
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
              console.log(data);
              setIsVerifyOpen(false);
              completeShowModal();
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
    } else {
      error({
        title: "Амжилтгүй",
        content: <div>FundMe кодоо оруулна уу!!!</div>,
      });
    }
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

  const changeActive = (indx: number) => {
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
        // @ts-ignore
        loan_month: dataTable[activeDuration].day,
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
                      <div className={styles["dloan-modal-content-text"]}>
                        1.1 Таны зээл авах захиалга бол зээл олгосон нөхцөл биш
                        бөгөөд таны захиалга биелээгүй тохиолдолд ямар нэгэн хүү
                        болон шимтгэл бодогдохгүй болно.
                        <br />
                        <br />
                        1.2 Таны зээл авах захиалга тухайн өдрийн бирж хаах цаг
                        хүртэл биелээгүй тохиолдолд захиалга автоматаар
                        цуцлагдаж, та дараагийн өдөр дахин зээл авах захиалгаа
                        шинээр оруулж болно. <br />
                        <br />
                        1.3 Харилцагч та зээл авах захиалгыг дээд тал нь өөрийн
                        эрхийн хүрээнд 3 удаа хуваан оруулах боломжтой байна.
                        <br />
                        <br />
                        1.4 Хэрэв таны зээл авах захиалга биелсэн бол “Зээлийн
                        эрх нээх” гэрээний дагуу тухайн зээлийг олгосонд тооцно.
                        <br />
                        <br />
                        1.5 Зээлийг таны “FundMe” апликейшн болон веб сайтад
                        бүртгэлтэй банкны данс руу “Зээлийн эрх нээх” гэрээний
                        дагуу зээл зуучлалын шимтгэлийг суутган шилжүүлнэ.{" "}
                        <br />
                        <br />
                        1.6 Зээл олгогдсон өдрөөс таны зээлийн хүү тооцогдож
                        эхлэх ба та зээлийн төлбөрөө тохирсон хугацаандаа төлөх
                        үүргийг “Зээлийн эрх нээх” гэрээний дагуу хүлээнэ.
                        <br />
                        <br /> 1.7 Таны зээлтэй холбоотой мэдээлэл нь “FundMe”
                        апликейшн болон веб сайтад бүртгэгдсэн мэдэгдэл хэсэгт
                        болон бүртгэлтэй утасны дугаар, и-мэйл хаягаар хүргэгдэх
                        ба энэ нь эргэн төлөлтийн хуваарьтай танилцсанд
                        тооцогдоно.
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

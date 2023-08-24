import { Col, Row, Button, Form, Input, Modal, message } from "antd";
import styles from "../../styles/login.module.css";
import React, { useRef, useState } from "react";
import { api } from "app/utils/api";
import { useSession } from "next-auth/react";
import { Loaderr } from "app/components/Loader";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import stylesL from "../../styles/dloan.module.css";
const { error, warning } = Modal;

interface RegisterType {
  phone: string;
  username: string;
  password: string;
  pin_code: string;
  security_question_id: string;
  question: string;
  answer: string;
  forgot_id: string;
  register: string;
}

export default function Forgot() {
  const router = useRouter();

  //mutates
  const mutationForgot = api.profile.forgotPass.useMutation();
  const mutationForgotCon = api.profile.forgotPassConfirm.useMutation();

  //queries
  const { data: securityQuestion } = api.register.helpQuestion.useQuery(
    undefined,
    { refetchOnWindowFocus: false }
  );

  //states
  const [registerData, setRegisterData] = useState<RegisterType>({
    phone: "",
    username: "",
    password: "",
    pin_code: "",
    security_question_id: "",
    question: "",
    answer: "",
    forgot_id: "",
    register: "",
  });
  const [selectedQuestion, setSelectedQuestion] = useState<any>("");
  const [loading, setLoading] = useState<string>("");
  const [isOpenVerifyPass, setOpenVerifyPass] = useState<boolean>(false);
  const inputs = useRef<any>([]);
  useRef<(HTMLInputElement | null)[]>([]);
  const length = 4;
  const [code, setCode] = useState<any>([...Array(length)].map(() => ""));

  //functions
  const processInput = (e: React.ChangeEvent<HTMLInputElement>, slot: any) => {
    const num = e.target.value;
    if (/[^0-9]/.test(num)) return;
    const newCode = [...code];
    newCode[slot] = num;
    setCode(newCode);
    if (slot !== length - 1) {
      inputs.current[slot + 1].focus();
    }
  };

  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>, slot: any) => {
    if (e.keyCode === 8 && !code[slot] && slot !== 0) {
      const newCode = [...code];
      newCode[slot - 1] = "";
      setCode(newCode);
      inputs.current[slot - 1].focus();
    }
  };

  const onFinishPhone = async (values: any) => {
    if (values.phone_number.length !== 8) {
      return error({
        title: "Амжилтгүй",
        content: <div>Хүчинтэй утасны дугаар оруулна уу !</div>,
      });
    }
    setRegisterData((prevData) => ({
      ...prevData,
      phone: values.phone_number,
    }));
  };

  const onFinishQuestion = (values: any) => {
    selectedQuestion == "" &&
      error({
        title: "Амжилтгүй",
        content: <div>Нууц асуулт сонгон уу!</div>,
      });

    if (values.answer.length < 8) {
      error({
        title: "Амжилтгүй",
        content: (
          <div>
            Таны сонгосон хариулт буруу байна. Нууц үг хамгийн багадаа 8
            тэмдэгтээс бүрдэх ёстой.
          </div>
        ),
      });
    } else {
      setRegisterData((prevData) => ({
        ...prevData,
        answer: values.answer,
        question: selectedQuestion.slice(1),
        security_question_id: selectedQuestion.slice(0, 1),
      }));
    }
  };

  const validateRegister = async (values: any) => {
    // Validate length
    if (values.register.length !== 10) {
      return warning({
        title: "Амжилтгүй",
        content: <div>Зөв регистрийн дугаар оруулна уу!</div>,
      });
    }

    // Validate that the first two characters are Cyrillic letters
    const firstTwoCharacters = values.register.substring(0, 2);
    const cyrillicPattern = /^[А-ЯЁ]+$/i; // Cyrillic letter pattern
    if (!cyrillicPattern.test(firstTwoCharacters)) {
      return warning({
        title: "Амжилтгүй",
        content: <div>Зөв регистрийн дугаар оруулна уу!</div>,
      });
    }

    // Validate the rest of the ID number (in this case, skipping the first two characters)
    const remainingDigits = values.register.substring(2);
    const numericPattern = /^[0-9]+$/; // Numeric digits pattern
    if (!numericPattern.test(remainingDigits)) {
      return warning({
        title: "Амжилтгүй",
        content: <div>Зөв регистрийн дугаар оруулна уу!</div>,
      });
    }

    return setRegisterData((prevData) => ({
      ...prevData,
      register: values.register,
    }));
  };

  const validatePassword = async (values: any) => {
    if (values.prev_password !== values.password) {
      return error({
        title: "Амжилтгүй",
        content: <div>Нэвтрэх нууц үгийг адилхан оруулна уу !</div>,
      });
    }

    if (values.password.length < 8) {
      return error({
        title: "Амжилтгүй",
        content: <div>Нууц үг хамгийн багадаа 8 тэмдэгтээс бүрдэх ёстой.</div>,
      });
    }

    const hasUppercase = /[A-Z]/.test(values.password);
    const hasLowercase = /[a-z]/.test(values.password);
    const hasNumber = /[0-9]/.test(values.password);

    if (!hasUppercase || !hasLowercase || !hasNumber) {
      return error({
        title: "Амжилтгүй",
        content: (
          <div>
            Нууц үг нь дор хаяж нэг том, нэг жижиг үсэг бас нэг тоо агуулсан
            байх ёстой.
          </div>
        ),
      });
    } else {
      setRegisterData((prevData) => ({
        ...prevData,
        password: values.password,
        pin_code: code.join(""),
      }));
      setLoading("loading");
      try {
        mutationForgot.mutate(
          {
            phone: registerData.phone,
            username: registerData.phone,
            answer: registerData.answer,
            security_question_id: registerData.security_question_id,
            register: registerData.register,
          },
          {
            onSuccess: (data: any) => {
              console.log(data);
              if (data?.success) {
                message.success(data.test_pin_code);
                setRegisterData((prevData) => ({
                  ...prevData,
                  forgot_id: data?.forgot_id,
                }));
                setOpenVerifyPass(true);
                setLoading("");
              } else {
                error({
                  title: "Амжилтгүй",
                  content: <div>{data?.description || null}</div>,
                });
              }
            },
          }
        );
      } catch (err) {
        error({
          title: "Амжилтгүй",
          content: <div>err</div>,
        });
      }
    }
  };

  const signupConfirm = () => {
    if (code.join("").length == 4) {
      mutationForgotCon.mutate(
        {
          pin_code: code.join(""),
          username: registerData.phone,
          answer: registerData.answer,
          security_question_id: registerData.security_question_id,
          register: registerData.register,
          forgot_id: registerData.forgot_id,
          new_password: registerData.password,
        },
        {
          onSuccess: (data: any) => {
            console.log(data);
            if (data.success) {
              setOpenVerifyPass(false);
              router.push("/login");
              setRegisterData({
                phone: "",
                username: "",
                password: "",
                pin_code: "",
                security_question_id: "",
                question: "",
                answer: "",
                forgot_id: "",
                register: "",
              });
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
  };

  const { data } = useSession();
  if (data) {
    return <Loaderr />;
  } else {
    return (
      <Row
        className={styles["login-background-image"]}
        justify="center"
        align={"middle"}
      >
        <Col span={20} className={styles["login-col-padding"]}>
          {registerData.phone == "" && (
            <Row justify="start" gutter={[0, 25]}>
              <Col span={24}>
                <div className={styles["header-text"]}>
                  Нууц үг шинээр үүсгэх
                </div>
              </Col>
              <Col xs={24} sm={24} md={12} lg={10} xl={8} xxl={6}>
                <Form
                  name="basic"
                  initialValues={{
                    remember: true,
                  }}
                  className="login-form"
                  autoComplete="off"
                  layout="vertical"
                  onFinish={onFinishPhone}
                >
                  <Row gutter={[0, 13]}>
                    <Col span={24}>
                      <div className={styles["phone-number-label"]}>
                        Гар утасны дугаар оруулах
                      </div>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        name="phone_number"
                        rules={[
                          {
                            required: true,
                            message: "Гар утасны дугаараа оруулна уу!",
                          },
                        ]}
                      >
                        <Input
                          className={styles["input-style"]}
                          type="tel"
                          pattern="[6789][0-9]{7}"
                          title="Зөв дугаар oruulna uu"
                          autoFocus
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Row gutter={25}>
                        <Col span={24}>
                          <Form.Item>
                            <Button
                              type="primary"
                              htmlType="submit"
                              className={`${styles["login-button"]} bg-primary`}
                            >
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
          )}
          {registerData.phone.length > 0 && registerData.answer == "" && (
            <motion.div
              animate={{ x: "0", opacity: 1, scale: 1 }}
              initial={{ x: "10%", opacity: 0, scale: 0.5 }}
              transition={{ delay: 0.3 }}
            >
              <Row justify="start" gutter={[0, 25]}>
                <Col span={24}>
                  <div className={styles["header-text"]}>
                    Нууц асуулт хариулт
                  </div>
                </Col>
                <Col xs={24} sm={24} md={12} lg={10} xl={8} xxl={6}>
                  <Form
                    name="basic"
                    initialValues={{
                      remember: true,
                    }}
                    className="login-form"
                    autoComplete="off"
                    layout="vertical"
                    onFinish={onFinishQuestion}
                  >
                    <Row gutter={[0, 13]}>
                      <Col span={24}>
                        <div className={styles["phone-number-label"]}>
                          Нууц асуулт сонгох
                        </div>
                      </Col>
                      <Col span={24}>
                        <select
                          className={styles["input-style"]}
                          style={{ backgroundColor: "white" }}
                          onChange={(e) => setSelectedQuestion(e.target.value)}
                        >
                          <option value={""}>Нууц асуулт сонгон уу!</option>
                          {securityQuestion?.security_question_list.map(
                            (
                              list: {
                                security_question_id: any;
                                question: any;
                              },
                              idx: any
                            ) => (
                              <option
                                key={`option ${idx}`}
                                value={`${list.security_question_id}${list.question}`}
                              >
                                {list.question}
                              </option>
                            )
                          )}
                        </select>
                      </Col>
                      <Col span={24}>
                        <div className={styles["phone-number-label"]}>
                          Нууц хариулт оруулах
                        </div>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          name="answer"
                          rules={[
                            {
                              required: true,
                              message: "Нууц хариулт оруулна уу!",
                            },
                          ]}
                        >
                          <Input className={styles["input-style"]} />
                        </Form.Item>
                      </Col>

                      <Col span={24}>
                        <Row gutter={25}>
                          <Col span={24}>
                            <div className="flex w-full justify-between">
                              <Button
                                type="default"
                                onClick={() =>
                                  setRegisterData((prevData) => ({
                                    ...prevData,
                                    phone: "",
                                  }))
                                }
                                className="h-[40px] w-[45%] rounded-[9px] text-white"
                              >
                                Буцах
                              </Button>

                              <Form.Item className="w-[45%]">
                                <Button
                                  type="primary"
                                  htmlType="submit"
                                  className={`h-[40px] w-full rounded-[9px] bg-primary`}
                                >
                                  Үргэлжлүүлэх
                                </Button>
                              </Form.Item>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>
            </motion.div>
          )}
          {registerData.phone.length > 0 &&
            registerData.answer.length > 0 &&
            registerData.register == "" && (
              <Row justify="start" gutter={[0, 25]}>
                <Col span={24}>
                  <div className={styles["header-text"]}>
                    Регистрийн дугаар оруулах хэсэг
                  </div>
                </Col>
                <Col xs={24} sm={24} md={12} lg={10} xl={8} xxl={6}>
                  <Form
                    name="basic"
                    initialValues={{
                      remember: true,
                    }}
                    className="login-form"
                    autoComplete="off"
                    layout="vertical"
                    onFinish={validateRegister}
                  >
                    <Row gutter={[0, 13]}>
                      <Col span={24}>
                        <div className={styles["phone-number-label"]}>
                          Регистрийн дугаар аа оруулна уу!
                        </div>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          name="register"
                          rules={[
                            {
                              required: true,
                              message: "Регистрийн дугаар аа оруулна уу!",
                            },
                          ]}
                        >
                          <Input className={styles["input-style"]} />
                        </Form.Item>
                      </Col>

                      <Col span={24}>
                        <Row gutter={25}>
                          <Col span={24}>
                            <div className="flex w-full justify-between">
                              <Button
                                type="default"
                                onClick={() =>
                                  setRegisterData((prevData) => ({
                                    ...prevData,
                                    answer: "",
                                  }))
                                }
                                className="h-[40px] w-[45%] rounded-[9px] text-white"
                              >
                                Буцах
                              </Button>

                              <Form.Item className="w-[45%]">
                                <Button
                                  type="primary"
                                  htmlType="submit"
                                  className={`h-[40px] w-full rounded-[9px] bg-primary`}
                                >
                                  Үргэлжлүүлэх
                                </Button>
                              </Form.Item>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>
            )}

          {registerData.phone.length > 0 &&
            registerData.answer.length > 0 &&
            registerData.register.length > 0 && (
              <motion.div
                animate={{ x: "0", opacity: 1, scale: 1 }}
                initial={{ x: "10%", opacity: 0, scale: 0.5 }}
                transition={{ delay: 0.3 }}
              >
                <Row justify="start" gutter={[0, 25]}>
                  <Col span={24}>
                    <div className={styles["header-text"]}>
                      Нэвтрэх нууц үг шинээр үүсгэх
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={10} xl={8} xxl={6}>
                    <Form
                      name="basic"
                      initialValues={{
                        remember: true,
                      }}
                      className="login-form"
                      autoComplete="off"
                      layout="vertical"
                      onFinish={validatePassword}
                    >
                      <Row gutter={[0, 13]}>
                        <Col span={24}>
                          <div className={styles["phone-number-label"]}>
                            Нэвтрэх нууц үг
                          </div>
                        </Col>
                        <Col span={24}>
                          <Form.Item
                            name="prev_password"
                            rules={[
                              {
                                required: true,
                                message: "Нэвтрэх нууц үг оруулна уу!",
                              },
                            ]}
                          >
                            <Input.Password
                              className={styles["input-style"]}
                              autoFocus
                            />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <div className={styles["phone-number-label"]}>
                            Нэвтрэх нууц үг дахин оруулах
                          </div>
                        </Col>
                        <Col span={24}>
                          <Form.Item
                            name="password"
                            rules={[
                              {
                                required: true,
                                message: "Нэвтрэх нууц үг дахин оруулна уу!",
                              },
                            ]}
                          >
                            <Input.Password className={styles["input-style"]} />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Row gutter={25}>
                            <Col span={24}>
                              <div className="flex w-full justify-between">
                                <Button
                                  type="default"
                                  onClick={() =>
                                    setRegisterData((prevData) => ({
                                      ...prevData,
                                      register: "",
                                    }))
                                  }
                                  className="h-[40px] w-[45%] rounded-[9px] text-white"
                                >
                                  Буцах
                                </Button>

                                <Form.Item className="w-[45%]">
                                  <Button
                                    type="primary"
                                    loading={loading == "loading"}
                                    htmlType="submit"
                                    className={`h-[40px] w-full overflow-hidden rounded-[9px] bg-primary`}
                                  >
                                    Нэг удаагын код авах
                                  </Button>
                                </Form.Item>
                              </div>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                </Row>
              </motion.div>
            )}
        </Col>

        <Modal
          centered
          width={378}
          title={
            <div className="mx-auto my-[20px] w-[50%] text-center font-raleway text-[18px] font-bold">
              Баталгаажуулах код оруулах
            </div>
          }
          closable={true}
          onCancel={() => setOpenVerifyPass(false)}
          open={isOpenVerifyPass}
          footer={null}
        >
          <Row justify="center">
            <Col span={20}>
              <Row justify="center" gutter={[0, 20]}>
                <Col span={20} className="my-3 flex justify-between">
                  {code.map(
                    (
                      num: string | number | readonly string[] | undefined,
                      idx: React.Key | null | undefined
                    ) => {
                      return (
                        <input
                          key={idx}
                          type="text"
                          inputMode="numeric"
                          className="w-[40px] rounded-[9px] border border-[#1375ED] p-2 text-center"
                          maxLength={1}
                          value={num}
                          autoFocus={!code[0].length && idx === 0}
                          onChange={(e) => processInput(e, idx)}
                          onKeyUp={(e) => onKeyUp(e, idx)}
                          ref={(ref) => inputs.current.push(ref)}
                        />
                      );
                    }
                  )}
                </Col>
                <Col span={20}>
                  <div className="text-center font-raleway text-[12px] font-normal text-sub">
                    Бид таны бүртгүүлсэн банкны дансруу нэг удаагын
                    баталгаажуулах код илгэлээ.
                  </div>
                </Col>
                <Col span={20}>
                  <button
                    type="submit"
                    className={stylesL["dloan-modal-verify-button"]}
                    onClick={() => {
                      registerData.pin_code.length == 4 && signupConfirm;
                    }}
                  >
                    Баталгаажуулах
                  </button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Modal>
      </Row>
    );
  }
}

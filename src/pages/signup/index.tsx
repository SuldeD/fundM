import { Col, Row, Button, Form, Input, Modal, message } from "antd";
import styles from "../../styles/login.module.css";
import React, { useRef, useState } from "react";
import { api } from "app/utils/api";
import { useSession } from "next-auth/react";
import { Loaderr } from "app/components/Loader";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

const { error, warning } = Modal;

interface RegisterType {
  phone: string;
  username: string;
  tmp_user_id: string;
  password: string;
  pin_code: string;
  security_question_id: string;
  question: string;
  answer: string;
  transaction_password: string;
  register: string;
  last_name: string;
  first_name: string;
  email: string;
  user_type: string;
}

export default function Signup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("s");

  const { mutate } = api.register.phoneSignUp.useMutation();

  const mutationPhoneVer = api.register.phoneSignUpVerify.useMutation();
  const orgSignUpVerify = api.register.orgSignUpVerify.useMutation();
  const mutationSignUp = api.register.signUp.useMutation();
  const mutationSignUpOrg = api.register.signUpOrg.useMutation();

  const [selectedQuestion, setSelectedQuestion] = useState<any>("");
  const { data: securityQuestion } = api.register.helpQuestion.useQuery();

  const [registerData, setRegisterData] = useState<RegisterType>({
    phone: "",
    username: "",
    tmp_user_id: "",
    password: "",
    pin_code: "",
    security_question_id: "",
    question: "",
    answer: "",
    transaction_password: "",
    register: "",
    last_name: "",
    first_name: "",
    email: "",
    user_type: "user",
  });
  const [loading, setLoading] = useState<string>("");

  const onFinishPhone = async (values: any) => {
    if (values.phone_number.length !== 8) {
      return warning({
        title: "Амжилтгүй",
        content: <div>Хүчинтэй утасны дугаар оруулна уу !</div>,
      });
    }

    mutate(
      { phone: values.phone_number },
      {
        onSuccess: (data) => {
          if (data.success) {
            setRegisterData((prevData) => ({
              ...prevData,
              phone: values.phone_number,
              username: values.phone_number,
              tmp_user_id: data.tmp_user_id,
            }));
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

  const onFinishPhoneVer = async (values: any) => {
    search == "org"
      ? orgSignUpVerify.mutate(
          {
            phone: registerData.phone,
            pin_code: values.pin_code,
            tmp_user_id: registerData.tmp_user_id,
            user_type: "org",
          },
          {
            onSuccess: (data) => {
              if (data.success) {
                setRegisterData((prevData) => ({
                  ...prevData,
                  pin_code: values.pin_code,
                }));
              } else {
                error({
                  title: "Амжилтгүй",
                  content: <div>{data?.description || null}</div>,
                });
              }
            },
          }
        )
      : mutationPhoneVer.mutate(
          {
            phone: registerData.phone,
            pin_code: values.pin_code,
            tmp_user_id: registerData.tmp_user_id,
          },
          {
            onSuccess: (data) => {
              if (data.success) {
                setRegisterData((prevData) => ({
                  ...prevData,
                  pin_code: values.pin_code,
                }));
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

  const validateRegister = async (values: any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate length
    if (search != "org" && values.register.length !== 10) {
      return warning({
        title: "Амжилтгүй",
        content: <div>Зөв регистрийн дугаар оруулна уу!</div>,
      });
    }

    // Validate that the first two characters are Cyrillic letters
    const firstTwoCharacters = values.register.substring(0, 2);
    const cyrillicPattern = /^[А-ЯЁ]+$/i; // Cyrillic letter pattern
    if (search != "org" && !cyrillicPattern.test(firstTwoCharacters)) {
      return warning({
        title: "Амжилтгүй",
        content: <div>Зөв регистрийн дугаар оруулна уу!</div>,
      });
    }

    // Validate the rest of the ID number (in this case, skipping the first two characters)
    const remainingDigits = values.register.substring(2);
    const numericPattern = /^[0-9]+$/; // Numeric digits pattern
    if (search != "org" && !numericPattern.test(remainingDigits)) {
      return warning({
        title: "Амжилтгүй",
        content: <div>Зөв регистрийн дугаар оруулна уу!</div>,
      });
    }

    if (
      (values.last_name.length == 0 && values.last_name.length > 50) ||
      (values.first_name.length == 0 && values.first_name.length > 50) ||
      (search != "org"
        ? values.register.length != 10
        : values.register.length > 6)
    ) {
      warning({
        title: "Амжилтгүй",
        content: <div>Мэдээллээ зөв оруулна уу!!!</div>,
      });
    } else if (emailRegex.test(values.email) == false) {
      warning({
        title: "Амжилтгүй",
        content: <div>Зөв имэйл хаяг оруулана уу!!!</div>,
      });
    } else {
      setRegisterData((prevData) => ({
        ...prevData,
        register: values.register,
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
      }));
    }
  };

  const validatePassword = async (values: any) => {
    if (values.prev_password !== values.password) {
      return warning({
        title: "Амжилтгүй",
        content: <div>Нэвтрэх нууц үгийг адилхан оруулна уу !</div>,
      });
    }

    if (values.password.length < 8) {
      return warning({
        title: "Амжилтгүй",
        content: <div>Нууц үг хамгийн багадаа 8 тэмдэгтээс бүрдэх ёстой.</div>,
      });
    }

    const hasUppercase = /[A-Z]/.test(values.password);
    const hasLowercase = /[a-z]/.test(values.password);
    const hasNumber = /[0-9]/.test(values.password);

    if (!hasUppercase || !hasLowercase || !hasNumber) {
      return warning({
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
      }));
    }
  };

  const validateTransactionPassword = async (values: any) => {
    if (code.join("") !== code2.join("")) {
      return warning({
        title: "Амжилтгүй",
        content: <div>Гүйлгээний нууц үгийг адилхан оруулна уу !</div>,
      });
    } else {
      search == "org"
        ? mutationSignUpOrg.mutate(
            {
              first_name: registerData.first_name,
              last_name: registerData.last_name,
              org_register: registerData.register,
              password: registerData.password,
              phone: registerData.phone,
              pin_code: registerData.pin_code,
              tmp_user_id: registerData.tmp_user_id,
              transaction_password: code.join("").toString(),
              user_type: "org",
              username: registerData.register,
              email: registerData.email,
            },
            {
              onSuccess: (data) => {
                if (data.success) {
                  message.success(data.description);
                  router.push("/login");
                } else {
                  error({
                    title: "Амжилтгүй",
                    content: <div>{data?.description || null}</div>,
                  });
                }
              },
            }
          )
        : setRegisterData((prevData) => ({
            ...prevData,
            transaction_password: code.join("").toString(),
          }));
    }
  };

  const onFinishQuestion = (values: any) => {
    selectedQuestion == ""
      ? warning({
          title: "Амжилтгүй",
          content: <div>Нууц асуулт сонгон уу!</div>,
        })
      : setRegisterData((prevData) => ({
          ...prevData,
          answer: values.answer,
          question: selectedQuestion.slice(1),
          security_question_id: selectedQuestion.slice(0, 1),
        }));

    if (values.answer.length < 8) {
      warning({
        title: "Амжилтгүй",
        content: (
          <div>
            Таны сонгосон хариулт буруу байна. Нууц үг хамгийн багадаа 8
            тэмдэгтээс бүрдэх ёстой.
          </div>
        ),
      });
    } else {
      signup({
        ...registerData,
        answer: values.answer,
        question: selectedQuestion.slice(1),
        security_question_id: selectedQuestion.slice(0, 1),
      });
    }
  };

  const signup = (registerData: RegisterType) => {
    setLoading("loading");
    mutationSignUp.mutate(registerData, {
      onSuccess: (data) => {
        if (data.success) {
          message.success(data.description);
          setLoading("");
          router.push("/login");
        } else {
          error({
            title: "Амжилтгүй",
            content: <div>{data?.description || null}</div>,
          });
        }
      },
    });
  };

  const length = 4;
  const [code, setCode] = useState<any>([...Array(length)].map(() => ""));
  const [code2, setCode2] = useState<any>([...Array(length)].map(() => ""));

  const inputs = useRef<any>([]);
  const inputs2 = useRef<any>([]);
  useRef<(HTMLInputElement | null)[]>([]);

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

  const processInput2 = (e: React.ChangeEvent<HTMLInputElement>, slot: any) => {
    const num = e.target.value;
    if (/[^0-9]/.test(num)) return;
    const newCode = [...code2];
    newCode[slot] = num;
    setCode2(newCode);
    if (slot !== length - 1) {
      inputs2.current[slot + 1].focus();
    }
  };

  const onKeyUp2 = (e: React.KeyboardEvent<HTMLInputElement>, slot: any) => {
    if (e.keyCode === 8 && !code2[slot] && slot !== 0) {
      const newCode = [...code2];
      newCode[slot - 1] = "";
      setCode2(newCode);
      inputs2.current[slot - 1].focus();
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
                  {search == "org" ? "Байгууллагаар Бүртгүүлэх" : "Бүртгэл"}
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
                              className={`h-[40px] w-full rounded-[9px] bg-primary`}
                            >
                              Нэг удаагын код авах
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
          {registerData.phone.length > 0 && registerData.username == "" && (
            <Row justify="start" gutter={[0, 25]}>
              <Col span={24}>
                <div className={styles["header-text"]}>
                  Байгууллагын мэдээлэл
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
                        Байгууллагын дугаар
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
                              className={`h-[40px] w-full rounded-[9px] bg-primary`}
                            >
                              Нэг удаагын код авах
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
          {registerData.phone.length > 0 &&
            registerData.tmp_user_id.length > 0 &&
            registerData.username.length > 0 &&
            registerData.pin_code == "" && (
              <motion.div
                animate={{ x: "0", opacity: 1, scale: 1 }}
                initial={{ x: "10%", opacity: 0, scale: 0.5 }}
                transition={{ delay: 0.3 }}
              >
                <Row
                  justify="start"
                  gutter={[0, 25]}
                  // className="animate-fade delay-500"
                >
                  <Col span={24}>
                    <div className={styles["header-text"]}>
                      Утасны дугаар баталгаажуулах
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
                      onFinish={onFinishPhoneVer}
                    >
                      <Row gutter={[0, 13]}>
                        <Col span={24}>
                          <div className={styles["phone-number-label"]}>
                            Нэг удаагын код оруулах
                          </div>
                        </Col>
                        <Col span={24}>
                          <Form.Item
                            name="pin_code"
                            rules={[
                              {
                                required: true,
                                message: "Нэг удаагын код оруулана уу!",
                              },
                            ]}
                          >
                            <Input
                              className={styles["input-style"]}
                              maxLength={4}
                              autoFocus
                            />
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
                                      username: "",
                                      tmp_user_id: "",
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
                                    Баталгаажуулах
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
            registerData.tmp_user_id.length > 0 &&
            registerData.username.length > 0 &&
            registerData.pin_code.length > 0 &&
            registerData.register == "" && (
              <motion.div
                animate={{ x: "0", opacity: 1, scale: 1 }}
                initial={{ x: "10%", opacity: 0, scale: 0.5 }}
                transition={{ delay: 0.3 }}
              >
                <Row justify="start" gutter={[0, 25]}>
                  <Col span={24}>
                    <div className={styles["header-text"]}>
                      {search == "org"
                        ? "Байгууллагын мэдээллээ оруулах"
                        : "Өөрийн мэдээллээ оруулах"}
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
                            {search == "org" ? "Захирлын нэр" : "Овог"}
                          </div>
                        </Col>
                        <Col span={24}>
                          <Form.Item
                            name="last_name"
                            rules={[
                              {
                                required: true,
                                message:
                                  search == "org" ? "Захирлын нэр!" : "Овог!",
                              },
                            ]}
                          >
                            <Input className={styles["input-style"]} />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <div className={styles["phone-number-label"]}>
                            {search == "org"
                              ? "Байгууллагын нэр"
                              : "Өөрийн нэр"}
                          </div>
                        </Col>
                        <Col span={24}>
                          <Form.Item
                            name="first_name"
                            rules={[
                              {
                                required: true,
                                message:
                                  search == "org"
                                    ? "Байгууллагын нэр!"
                                    : "Өөрийн нэр!",
                              },
                            ]}
                          >
                            <Input
                              className={styles["input-style"]}
                              autoFocus
                            />
                          </Form.Item>
                        </Col>

                        <Col span={24}>
                          <div className={styles["phone-number-label"]}>
                            {search == "org"
                              ? "Байгууллагын регистрийн дугаар"
                              : "Регистрийн дугаар"}
                          </div>
                        </Col>
                        <Col span={24}>
                          <Form.Item
                            name="register"
                            rules={[
                              {
                                required: true,
                                message:
                                  search == "org"
                                    ? "Байгууллагын регистрийн дугаар!"
                                    : "Регистрийн дугаар!",
                              },
                            ]}
                          >
                            <Input className={styles["input-style"]} />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <div className={styles["phone-number-label"]}>
                            {search == "org"
                              ? " Байгууллагын имэйл хаяг"
                              : "Имэйл хаяг"}
                          </div>
                        </Col>
                        <Col span={24}>
                          <Form.Item
                            name="email"
                            rules={[
                              {
                                required: true,
                                message: "Имэйл хаяг!",
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
                                      pin_code: "",
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
                                    className={`h-[40px] w-full rounded-[9px] bg-primary font-raleway`}
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
            registerData.tmp_user_id.length > 0 &&
            registerData.username.length > 0 &&
            registerData.pin_code.length > 0 &&
            registerData.register.length > 0 &&
            registerData.password == "" && (
              <motion.div
                animate={{ x: "0", opacity: 1, scale: 1 }}
                initial={{ x: "10%", opacity: 0, scale: 0.5 }}
                transition={{ delay: 0.3 }}
              >
                <Row justify="start" gutter={[0, 25]}>
                  <Col span={24}>
                    <div className={styles["header-text"]}>
                      Нэвтрэх нууц үг үүсгэх
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
                                message:
                                  "таны нууц үг багадаа 8 оронтой 1 том үсэг 1 тэмдэгт орсон байна!",
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
                                    htmlType="submit"
                                    className={`h-[40px] w-full rounded-[9px] bg-primary font-raleway`}
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
            registerData.tmp_user_id.length > 0 &&
            registerData.username.length > 0 &&
            registerData.pin_code.length > 0 &&
            registerData.register.length > 0 &&
            registerData.password.length > 0 &&
            registerData.transaction_password == "" && (
              <motion.div
                animate={{ x: "0", opacity: 1, scale: 1 }}
                initial={{ x: "10%", opacity: 0, scale: 0.5 }}
                transition={{ delay: 0.3 }}
                className="mt-[10px]"
              >
                <Row justify="start" gutter={[0, 25]}>
                  <Col span={24}>
                    <div className={styles["header-text"]}>
                      Гүйлгээний FundMe ПИН код үүсгэх
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
                      onFinish={validateTransactionPassword}
                    >
                      <Row gutter={[0, 13]}>
                        <Col span={24}>
                          <div className={styles["phone-number-label"]}>
                            Гүйлгээний <span className="font-bold">FundMe</span>{" "}
                            ПИН код оруулах
                          </div>
                        </Col>
                        <Col span={19} className="flex justify-between">
                          {code.map(
                            (
                              num:
                                | string
                                | number
                                | readonly string[]
                                | undefined,
                              idx: React.Key | null | undefined
                            ) => {
                              return (
                                <input
                                  key={idx}
                                  type="text"
                                  inputMode="numeric"
                                  className="h-[50px] w-[50px] rounded-[15px] border p-2 text-center text-[22px] font-bold"
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
                        <Col span={24} className="pt-[20px]">
                          <div className={styles["phone-number-label"]}>
                            Гүйлгээний <span className="font-bold">FundMe</span>{" "}
                            ПИН код дахин оруулах
                          </div>
                        </Col>
                        <Col span={19} className="flex justify-between">
                          {code2.map(
                            (
                              num:
                                | string
                                | number
                                | readonly string[]
                                | undefined,
                              idx: React.Key | null | undefined
                            ) => {
                              return (
                                <input
                                  key={idx}
                                  type="text"
                                  inputMode="numeric"
                                  className="h-[50px] w-[50px] rounded-[15px] border p-2 text-center text-[22px] font-bold"
                                  maxLength={1}
                                  value={num}
                                  autoFocus={!code2[0].length && idx === 0}
                                  onChange={(e) => processInput2(e, idx)}
                                  onKeyUp={(e) => onKeyUp2(e, idx)}
                                  ref={(ref) => inputs2.current.push(ref)}
                                />
                              );
                            }
                          )}
                        </Col>
                        <Col span={24}>
                          <Row gutter={25}>
                            <Col span={20}>
                              <div className="mt-[30px] flex w-full justify-between">
                                <Button
                                  type="default"
                                  onClick={() =>
                                    setRegisterData((prevData) => ({
                                      ...prevData,
                                      password: "",
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
                                    className={`h-[40px] w-full rounded-[9px] bg-primary font-raleway`}
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
            registerData.tmp_user_id.length > 0 &&
            registerData.username.length > 0 &&
            registerData.pin_code.length > 0 &&
            registerData.password.length > 0 &&
            registerData.transaction_password.length > 0 && (
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
                            onChange={(e) =>
                              setSelectedQuestion(e.target.value)
                            }
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
                                      transaction_password: "",
                                    }))
                                  }
                                  className="h-[40px] w-[45%] rounded-[9px] text-white"
                                >
                                  Буцах
                                </Button>

                                <Form.Item className="w-[45%]">
                                  <Button
                                    loading={loading == "loading"}
                                    type="primary"
                                    htmlType="submit"
                                    className={`h-[40px] w-full rounded-[9px] bg-primary font-raleway`}
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
        </Col>
      </Row>
    );
  }
}

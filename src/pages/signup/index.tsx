import { Col, Row, Button, Form, Input, Modal } from "antd";
import styles from "../../styles/login.module.css";
import React, { useState } from "react";
import { api } from "app/utils/api";
import { useSession } from "next-auth/react";
import { Loaderr } from "app/components/Loader";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
const { error } = Modal;

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
}

export default function Signup() {
  const router = useRouter();

  const { mutate } = api.loan.phoneSignUp.useMutation();
  const mutationPhoneVer = api.loan.phoneSignUpVerify.useMutation();
  const mutationSignUp = api.loan.SignUp.useMutation();

  const [selectedQuestion, setSelectedQuestion] = useState<any>("");
  const { data: securityQuestion } = api.loan.helpQuestion.useQuery();

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
  });

  const onFinishPhone = async (values: any) => {
    if (values.phone_number.length !== 8) {
      return error({
        title: "Амжилтгүй",
        content: <div>Хүчинтэй утасны дугаар оруулна уу !</div>,
      });
    }

    mutate(
      { phone: values.phone_number },
      {
        onSuccess: (data) => {
          console.log(data);
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
    mutationPhoneVer.mutate(
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
    if (
      values.last_name.length > 0 &&
      values.last_name.length < 50 &&
      values.first_name.length > 0 &&
      values.first_name.length < 50 &&
      values.register.length == 10
    ) {
      setRegisterData((prevData) => ({
        ...prevData,
        register: values.register,
        first_name: values.first_name,
        last_name: values.last_name,
      }));
    } else {
      error({
        title: "Амжилтгүй",
        content: <div>Medeelle zuw oruulna uu!!!</div>,
      });
    }
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
      }));
    }
  };

  const validateTransactionPassword = async (values: any) => {
    if (values.prev_password !== values.password) {
      return error({
        title: "Амжилтгүй",
        content: <div>Гүйлгээний нууц үгийг адилхан оруулна уу !</div>,
      });
    } else if (values.password.length !== 4) {
      return error({
        title: "Амжилтгүй",
        content: <div>Гүйлгээний нууц үг нь 4 үсэгээс бүрдэх ёстой.</div>,
      });
    } else {
      setRegisterData((prevData) => ({
        ...prevData,
        transaction_password: values.password,
      }));
    }
  };

  const onFinishQuestion = (values: any) => {
    selectedQuestion == ""
      ? error({
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
      error({
        title: "Амжилтгүй",
        content: <div>Нууц үг хамгийн багадаа 8 тэмдэгтээс бүрдэх ёстой.</div>,
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
    mutationSignUp.mutate(registerData, {
      onSuccess: (data) => {
        if (data.success) {
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
                <div className={styles["header-text"]}>Бүртгэл</div>
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
                              <Form.Item>
                                <Button
                                  type="primary"
                                  htmlType="submit"
                                  className={`${styles["login-button"]} bg-primary`}
                                >
                                  Баталгаажуулах
                                </Button>
                              </Form.Item>
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
                      Өөрийн мэдээллээ оруулах
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
                            Өөрийн нэр
                          </div>
                        </Col>
                        <Col span={24}>
                          <Form.Item
                            name="first_name"
                            rules={[
                              {
                                required: true,
                                message: "Өөрийн нэр!",
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
                            Овог
                          </div>
                        </Col>
                        <Col span={24}>
                          <Form.Item
                            name="last_name"
                            rules={[
                              {
                                required: true,
                                message: "Овог!",
                              },
                            ]}
                          >
                            <Input className={styles["input-style"]} />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <div className={styles["phone-number-label"]}>
                            Регистрийн дугаар
                          </div>
                        </Col>
                        <Col span={24}>
                          <Form.Item
                            name="register"
                            rules={[
                              {
                                required: true,
                                message: "Регистрийн дугаар!",
                              },
                            ]}
                          >
                            <Input className={styles["input-style"]} />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Row gutter={25}>
                            <Col span={24}>
                              <Button
                                type="primary"
                                htmlType="submit"
                                className={`${styles["login-button"]} bg-primary`}
                              >
                                Үргэлжлүүлэх
                              </Button>
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
                              <Button
                                type="primary"
                                htmlType="submit"
                                className={`${styles["login-button"]} bg-primary`}
                              >
                                Үргэлжлүүлэх
                              </Button>
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
            registerData.transaction_password == "" && (
              <motion.div
                animate={{ x: "0", opacity: 1, scale: 1 }}
                initial={{ x: "10%", opacity: 0, scale: 0.5 }}
                transition={{ delay: 0.3 }}
              >
                <Row justify="start" gutter={[0, 25]}>
                  <Col span={24}>
                    <div className={styles["header-text"]}>
                      Гүйлгээний нууц үг үүсгэх
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
                            Гүйлгээний нууц үг
                          </div>
                        </Col>
                        <Col span={24}>
                          <Form.Item
                            name="prev_password"
                            rules={[
                              {
                                required: true,
                                message: "Гүйлгээний нууц үг оруулна уу!",
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
                            Гүйлгээний нууц үг дахин оруулах
                          </div>
                        </Col>
                        <Col span={24}>
                          <Form.Item
                            name="password"
                            rules={[
                              {
                                required: true,
                                message: "Гүйлгээний нууц үг дахин оруулна уу!",
                              },
                            ]}
                          >
                            <Input.Password className={styles["input-style"]} />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Row gutter={25}>
                            <Col span={24}>
                              <Button
                                type="primary"
                                htmlType="submit"
                                className={`${styles["login-button"]} bg-primary`}
                              >
                                Үргэлжлүүлэх
                              </Button>
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
                            <Input className={styles["input-style"]} />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <Row gutter={25}>
                            <Col span={24}>
                              <Button
                                type="primary"
                                htmlType="submit"
                                className={`${styles["login-button"]} bg-primary`}
                              >
                                Үргэлжлүүлэх
                              </Button>
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

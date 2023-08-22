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
}

export default function Forgot() {
  const router = useRouter();
  const mutationForgot = api.profile.forgotPass.useMutation();

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
  });

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
        content: <div>Нууц үг хамгийн багадаа 8 тэмдэгтээс бүрдэх ёстой.</div>,
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

  const signup = (values: any) => {
    mutationForgot.mutate(
      {
        phone: registerData.phone,
        username: registerData.phone,
        answer: registerData.answer,
        security_question_id: registerData.security_question_id,
        register: values.register,
      },
      {
        onSuccess: (data: any) => {
          console.log(data);
          if (data.success) {
            setRegisterData({
              phone: "",
              username: "",
              tmp_user_id: "",
              password: "",
              pin_code: "",
              security_question_id: "",
              question: "",
              answer: "",
              transaction_password: "",
            });
            router.push("/login");
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
          {registerData.phone.length > 0 && registerData.answer.length > 0 && (
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
                  onFinish={signup}
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
        </Col>
      </Row>
    );
  }
}

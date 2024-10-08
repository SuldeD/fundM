import {
  Col,
  Row,
  Button,
  Form,
  Input,
  Modal,
  Image,
  Statistic,
  Checkbox,
} from "antd";
import styles from "app/styles/login.module.css";
import { useRef, useState } from "react";
import { api } from "app/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useAppContext } from "app/context/appContext";
import { ExclamationCircleFilled } from "@ant-design/icons";
import PopupModal from "app/components/modal";

const { error, warning, info, confirm } = Modal;

interface RegisterType {
  phone: string;
  username: string;
  tmp_user_id: string;
  password: string;
  pin_code: string;
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
  const { success } = useAppContext();

  const { mutate } = api.register.phoneSignUp.useMutation();

  const mutationPhoneVer = api.register.phoneSignUpVerify.useMutation();
  const orgSignUpVerify = api.register.orgSignUpVerify.useMutation();
  const mutationSignUp = api.register.signUp.useMutation();
  const mutationSignUpOrg = api.register.signUpOrg.useMutation();

  const { Countdown } = Statistic;

  const [registerData, setRegisterData] = useState<RegisterType>({
    phone: "",
    username: "",
    tmp_user_id: "",
    password: "",
    pin_code: "",
    transaction_password: "",
    register: "",
    last_name: "",
    first_name: "",
    email: "",
    user_type: "user",
  });
  const [loading, setLoading] = useState<string>("");
  const [reDate, setReDate] = useState<boolean>(false);

  const [checked, setChecked] = useState<boolean>();
  const [warningM, setWarning] = useState<boolean>(false);

  const onFinishPhone = async (values: any) => {
    setLoading("loading");
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
            success(
              `Таны ${values.phone_number} дугаар руу баталгаажуулах код амжилттай илгээгдлээ.`
            );
            localStorage.setItem("targetDate", `${Date.now() + 300 * 1000}`);
            setRegisterData((prevData) => ({
              ...prevData,
              phone: values.phone_number,
              username: values.phone_number,
              tmp_user_id: data.tmp_user_id,
            }));
            setLoading("");
          } else {
            error({
              title: "Амжилтгүй",
              content: <div>{data?.description || null}</div>,
            });
            setLoading("");
          }
        },
      }
    );
  };

  const onFinishPhoneVer = async (values: any) => {
    // setReDate(true);
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
    // Validate the rest of the ID number (in this case, skipping the first two characters)
    const remainingDigits = values.register.substring(2);
    const numericPattern = /^[0-9]+$/; // Numeric digits pattern

    // Validate that the first two characters are Cyrillic letters
    const firstTwoCharacters = values.register.substring(0, 2);
    const cyrillicPattern = /^[а-яёөүА-ЯЁӨҮ\s]+$/;

    if (
      search != "org" &&
      (values.register.length !== 10 || !numericPattern.test(remainingDigits))
    ) {
      return warning({
        title: "Амжилтгүй",
        content: <div>Зөв регистрийн дугаар оруулна уу!</div>,
      });
    } else if (search != "org") {
      let IsGenderCheck, IsGender, IsAgeCheck, IsYear, IsAge;
      IsYear = 19;
      IsGenderCheck = values.register.slice(-2, -1);
      if (["0", "2", "4", "6", "8"].includes(IsGenderCheck)) {
        IsGender = "female";
      } else {
        if (["1", "3", "5", "7", "9"].includes(IsGenderCheck)) {
          IsGender = "male";
        }
      }
      IsAgeCheck = values.register.slice(-6, -5);
      if (IsAgeCheck === "2" || IsAgeCheck === "3") {
        IsYear += 1;
      }
      const currentYear = new Date().getFullYear(); // Get the current year
      IsAge = currentYear - parseInt(IsYear + values.register.slice(-8, -6));

      if (
        search != "org" &&
        (IsGender === "female" || IsGender === "male") &&
        IsAge > 17 &&
        IsAge < 110
      ) {
      } else {
        return error({
          title: "Амжилтгүй",
          content: <div>Та 18 нас хүрээгүй бол бүртгүүлэх боломжгүй.</div>,
        });
      }
    }

    if (search == "org" && values.register.length < 6) {
      return warning({
        title: "Амжилтгүй",
        content: <div>Байгууллагын регисирыг зөв оруулна уу!</div>,
      });
    } else if (!cyrillicPattern.test(values.last_name)) {
      return warning({
        title: "Амжилтгүй",
        content: (
          <div>
            {search == "org"
              ? "Та Удирдлагын нэрийг кирилл үсгээр оруулана уу!"
              : "Та Овогоо кирилл үсгээр оруулана уу!"}
          </div>
        ),
      });
    } else if (!cyrillicPattern.test(values.first_name)) {
      warning({
        title: "Амжилтгүй",
        content: (
          <div>
            {search == "org"
              ? "Та Байгууллагын нэрээ кирилл үсгээр оруулана уу!"
              : "Та Өөрийн нэрээ кирилл үсгээр оруулана уу!"}
          </div>
        ),
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
        content: (
          <div>
            Таны нууц үг багадаа 8 оронтой 1 том үсэг 1 тэмдэгт орсон байна!
          </div>
        ),
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
      if (search == "org") {
        mutationSignUpOrg.mutate(
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
            username: registerData.phone,
            email: registerData.email,
          },
          {
            onSuccess: (data) => {
              if (data.success) {
                success(
                  `${data.description}. Цаашид та бүртгүүлсэн гар утасны дугаар(${registerData?.phone}) нэвтрэх болно.`
                );
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
      } else {
        setRegisterData((prevData) => ({
          ...prevData,
          transaction_password: code.join("").toString(),
        }));
        signup({
          ...registerData,
          transaction_password: code.join("").toString(),
        });
      }
    }
  };

  const signup = (registerData: RegisterType) => {
    setLoading("loading");
    mutationSignUp.mutate(registerData, {
      onSuccess: (data) => {
        if (data.success) {
          success(
            `${data.description}. Цаашид та бүртгүүлсэн гар утасны дугаар(${registerData?.phone}) нэвтрэх болно.`
          );
          setLoading("");
          router.push("/login");
        } else {
          error({
            title: "Амжилтгүй",
            content: <div>{data?.description || null}</div>,
          });
          setLoading("");
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

  const showInfo = () => {
    info({
      content:
        "Та өөрийн байгууллагын БАНКИН ДЭЭРХ БҮРТГЭЛТЭЙ ДАНСНЫ НЭРЭЭ шалгаад оруулна уу. /Жич: зарим тохиолдолд банкны бүртгэл дээр байгууллагын улсын бүртгэл дээр байгаа ХХК, ҮЦК гэх мэт товчлол байхгүй байдгийг анхаарна уу!!!",
      icon: <ExclamationCircleFilled />,
      title: "Байгууллагын нэр",
      okText: "Хаах",
    });
  };

  const showInfo2 = (values: any) => {
    !checked
      ? confirm({
          content:
            "Та өөрийн байгууллагын БАНКИН ДЭЭРХ БҮРТГЭЛТЭЙ ДАНСНЫ НЭРЭЭ шалгаад оруулна уу. /Жич: зарим тохиолдолд банкны бүртгэл дээр байгууллагын улсын бүртгэл дээр байгаа ХХК, ҮЦК гэх мэт товчлол байхгүй байдгийг анхаарна уу!!!",
          icon: <ExclamationCircleFilled />,
          title: "Байгууллагын нэр",
          okText: "Үргэлжлүүлэх",
          cancelText: "Буцах",
          onOk() {
            validateRegister(values);
          },
        })
      : setWarning(true);
  };

  const { data } = useSession();
  if (data) {
    return null;
  } else {
    return (
      <Row
        className={styles["login-background-image"]}
        justify="center"
        align={"middle"}
      >
        <PopupModal
          buttonClick={() => {
            setWarning(false);
          }}
          buttonText={"Хаах"}
          closableM={null}
          closeModal={null}
          customDiv={null}
          customIconWidth={null}
          iconPath={"json2"}
          modalWidth={null}
          open={warningM}
          text={
            <div>
              <p className="mb-4 text-center text-[18px] font-bold text-primary">
                Анхааруулга!
              </p>
              <p className="text-center text-red-500">
                Уучилаарай Мөнгө угаах, терроризмыг санхүүжүүлэх (МУТС) тухай
                хуулийн дагуу таныг бүртгэх боломжгүй болно.
              </p>
            </div>
          }
          textAlign={"center"}
        />
        <Col span={20} className={styles["login-col-padding"]}>
          {registerData.phone == "" && registerData.register.length > 0 && (
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
                      <p className="mb-4 text-white opacity-[0.5]">
                        Та зөвхөн өөрийн утасны дугаараа оруулан код хүлээн авч
                        баталгаажуулалт хийнэ үү.
                      </p>
                    </Col>
                    <Col span={24}>
                      <Row gutter={25}>
                        <Col span={24}>
                          <Form.Item>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                              }}
                            >
                              {" "}
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
                              <Button
                                type="primary"
                                loading={loading == "loading"}
                                htmlType="submit"
                                className={`h-[40px] w-[45%] rounded-[9px] bg-primary`}
                              >
                                Нэг удаагийн код авах
                              </Button>
                            </div>
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
                              Нэг удаагийн код авах
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
                            Нэг удаагийн код оруулах
                          </div>
                        </Col>
                        <Col span={24}>
                          <Form.Item
                            name="pin_code"
                            rules={[
                              {
                                required: true,
                                message: "Нэг удаагийн код оруулана уу!",
                              },
                            ]}
                          >
                            <Input
                              className={styles["input-style"]}
                              maxLength={4}
                              autoFocus
                            />
                            {/* <div className="mt-4 text-center font-lato text-[12px] font-normal text-white">
                              Та өөрийн бүртгэл үүсгэж байгаа утасны дугаар дээр
                              ирсэн 4 оронтой кодийг оруулна уу.
                            </div>{" "} */}
                          </Form.Item>
                          <Col className="me-3 flex w-full items-end justify-end">
                            <div
                              className={
                                reDate
                                  ? "cursor-pointer text-white"
                                  : "text-gray-400"
                              }
                              onClick={() => {
                                reDate &&
                                  mutate(
                                    { phone: registerData.phone },
                                    {
                                      onSuccess: (data) => {
                                        if (data.success) {
                                          success(
                                            `Таны ${registerData.phone} дугаар руу баталгаажуулах код амжилттай илгээгдлээ.`
                                          );
                                          localStorage.setItem(
                                            "targetDate",
                                            `${Date.now() + 300 * 1000}`
                                          );
                                          setRegisterData((prevData) => ({
                                            ...prevData,
                                            phone: registerData.phone,
                                            username: registerData.phone,
                                            tmp_user_id: data.tmp_user_id,
                                          }));
                                          setLoading("");
                                          setReDate(false);
                                        } else {
                                          error({
                                            title: "Амжилтгүй",
                                            content: (
                                              <div>
                                                {data?.description || null}
                                              </div>
                                            ),
                                          });
                                          setLoading("");
                                        }
                                      },
                                    }
                                  );
                              }}
                            >
                              Дахин код авах
                            </div>
                          </Col>
                          <div className="mt-0 flex w-full justify-center">
                            <Countdown
                              value={Number(localStorage.getItem("targetDate"))}
                              format="mm:ss"
                              className="mx-auto"
                              onFinish={() => {
                                setReDate(true);
                                console.log("finish");
                              }}
                              valueStyle={{
                                fontFamily: "Lato",
                                fontWeight: 500,
                                fontSize: 34,
                                color: reDate ? "#FF0000" : "white",
                                fontStyle: "normal",
                              }}
                            />
                          </div>
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
          {registerData.register == "" && (
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
                    onFinish={showInfo2}
                    // onFinish={validateRegister}
                  >
                    <Row gutter={[0, 13]}>
                      <Col span={24}>
                        <div className={styles["phone-number-label"]}>
                          {search == "org" ? "Удирдлагын нэр" : "Овог"}
                        </div>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          name="last_name"
                          rules={[
                            {
                              required: true,
                              message:
                                search == "org" ? "Удирдлагын нэр!" : "Овог!",
                            },
                          ]}
                        >
                          <Input className={styles["input-style"]} />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <div className={styles["phone-number-label"]}>
                          {search == "org" ? "Байгууллагын нэр" : "Өөрийн нэр"}
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
                          <div className="relative">
                            <Input
                              className={styles["input-style"]}
                              autoFocus
                            />

                            <div className="absolute right-2 top-[15px]">
                              <Image
                                width={25}
                                onClick={() => {
                                  showInfo();
                                }}
                                src={"/images/info-icon.png"}
                                preview={false}
                                className="cursor-pointer"
                                alt="Information"
                              />
                            </div>
                          </div>
                        </Form.Item>
                      </Col>

                      <Col span={24}>
                        <div className={styles["phone-number-label"]}>
                          {search == "org"
                            ? "Байгууллагын регистр"
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
                                  ? "Байгууллагын регистр!"
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
                        <Row justify="start">
                          <p className="text-white">
                            Та улс төрийн нөлөө бүхий этгээд тэдгээртэй
                            хамараалтай эсэх
                          </p>
                          <div className="mb-8 mt-2 flex gap-16 font-lato">
                            <Checkbox
                              checked={checked}
                              onChange={() => setChecked(true)}
                              className="border-black font-lato text-[20px] font-bold text-white"
                            >
                              Тийм
                            </Checkbox>
                            <Checkbox
                              checked={checked === false}
                              onChange={() => setChecked(false)}
                              className="font-lato text-[20px] font-bold text-white"
                            >
                              Үгүй
                            </Checkbox>
                          </div>
                        </Row>
                      </Col>
                      <Col span={24}>
                        <Row gutter={25}>
                          <Col span={24}>
                            <div className="flex w-full justify-between">
                              <Form.Item className="w-[100%]">
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
                          <p className="text-white opacity-[0.5]">
                            Таны нууц үг багадаа 8 оронтой 1 том үсэг 1 тэмдэгт
                            орсон байна!
                          </p>
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
            registerData.password.length > 0 && (
              <motion.div
                animate={{ x: "0", opacity: 1, scale: 1 }}
                initial={{ x: "10%", opacity: 0, scale: 0.5 }}
                transition={{ delay: 0.3 }}
                className="mt-[10px]"
              >
                <Row justify="start" gutter={[0, 25]}>
                  <Col span={24}>
                    <div className={styles["header-text"]}>
                      Гүйлгээний FundMe код үүсгэх
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
                        <p className="mt-2 text-white opacity-[0.5]">
                          Энэхүү кодыг та мэдээлэл өөрчлөх болон захиалгаа
                          баталгаажуулахдаа хэрэглэнэ.
                        </p>

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
                                    loading={loading == "loading"}
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

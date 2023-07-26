"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const antd_1 = require("antd");
const login_module_css_1 = __importDefault(require("../../styles/login.module.css"));
const react_1 = __importStar(require("react"));
const api_1 = require("app/utils/api");
const react_2 = require("next-auth/react");
const Loader_1 = require("app/components/Loader");
const router_1 = require("next/router");
const framer_motion_1 = require("framer-motion");
const { error } = antd_1.Modal;
function Signup() {
    const router = (0, router_1.useRouter)();
    const { mutate } = api_1.api.loan.phoneSignUp.useMutation();
    const mutationPhoneVer = api_1.api.loan.phoneSignUpVerify.useMutation();
    const mutationSignUp = api_1.api.loan.SignUp.useMutation();
    const [selectedQuestion, setSelectedQuestion] = (0, react_1.useState)("");
    const { data: securityQuestion } = api_1.api.loan.helpQuestion.useQuery();
    const [registerData, setRegisterData] = (0, react_1.useState)({
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
    const onFinishPhone = async (values) => {
        if (values.phone_number.length !== 8) {
            return error({
                title: "Амжилтгүй",
                content: <div>Хүчинтэй утасны дугаар оруулна уу !</div>,
            });
        }
        mutate({ phone: values.phone_number }, {
            onSuccess: (data) => {
                console.log(data);
                if (data.success) {
                    setRegisterData((prevData) => ({
                        ...prevData,
                        phone: values.phone_number,
                        username: values.phone_number,
                        tmp_user_id: data.tmp_user_id,
                    }));
                }
                else {
                    error({
                        title: "Амжилтгүй",
                        content: <div>{(data === null || data === void 0 ? void 0 : data.description) || null}</div>,
                    });
                }
            },
        });
    };
    const onFinishPhoneVer = async (values) => {
        mutationPhoneVer.mutate({
            phone: registerData.phone,
            pin_code: values.pin_code,
            tmp_user_id: registerData.tmp_user_id,
        }, {
            onSuccess: (data) => {
                if (data.success) {
                    setRegisterData((prevData) => ({
                        ...prevData,
                        pin_code: values.pin_code,
                    }));
                }
                else {
                    error({
                        title: "Амжилтгүй",
                        content: <div>{(data === null || data === void 0 ? void 0 : data.description) || null}</div>,
                    });
                }
            },
        });
    };
    const validatePassword = async (values) => {
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
                content: (<div>
            Нууц үг нь дор хаяж нэг том, нэг жижиг үсэг бас нэг тоо агуулсан
            байх ёстой.
          </div>),
            });
        }
        else {
            setRegisterData((prevData) => ({
                ...prevData,
                password: values.password,
            }));
        }
    };
    const validateTransactionPassword = async (values) => {
        if (values.prev_password !== values.password) {
            return error({
                title: "Амжилтгүй",
                content: <div>Гүйлгээний нууц үгийг адилхан оруулна уу !</div>,
            });
        }
        else if (values.password.length !== 4) {
            return error({
                title: "Амжилтгүй",
                content: <div>Гүйлгээний нууц үг нь 4 үсэгээс бүрдэх ёстой.</div>,
            });
        }
        else {
            setRegisterData((prevData) => ({
                ...prevData,
                transaction_password: values.password,
            }));
        }
    };
    const onFinishQuestion = (values) => {
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
        }
        else {
            signup({
                ...registerData,
                answer: values.answer,
                question: selectedQuestion.slice(1),
                security_question_id: selectedQuestion.slice(0, 1),
            });
        }
    };
    const signup = (registerData) => {
        mutationSignUp.mutate(registerData, {
            onSuccess: (data) => {
                if (data.success) {
                    router.push("/login");
                }
                else {
                    error({
                        title: "Амжилтгүй",
                        content: <div>{(data === null || data === void 0 ? void 0 : data.description) || null}</div>,
                    });
                }
            },
        });
    };
    const { data } = (0, react_2.useSession)();
    if (data) {
        return <Loader_1.Loaderr />;
    }
    else {
        return (<antd_1.Row className={login_module_css_1.default["login-background-image"]} justify="center" align={"middle"}>
        <antd_1.Col span={20} className={login_module_css_1.default["login-col-padding"]}>
          {registerData.phone == "" && (<antd_1.Row justify="start" gutter={[0, 25]}>
              <antd_1.Col span={24}>
                <div className={login_module_css_1.default["header-text"]}>Бүртгэл</div>
              </antd_1.Col>
              <antd_1.Col xs={24} sm={24} md={12} lg={10} xl={8} xxl={6}>
                <antd_1.Form name="basic" initialValues={{
                    remember: true,
                }} className="login-form" autoComplete="off" layout="vertical" onFinish={onFinishPhone}>
                  <antd_1.Row gutter={[0, 13]}>
                    <antd_1.Col span={24}>
                      <div className={login_module_css_1.default["phone-number-label"]}>
                        Гар утасны дугаар оруулах
                      </div>
                    </antd_1.Col>
                    <antd_1.Col span={24}>
                      <antd_1.Form.Item name="phone_number" rules={[
                    {
                        required: true,
                        message: "Гар утасны дугаараа оруулна уу!",
                    },
                ]}>
                        <antd_1.Input className={login_module_css_1.default["input-style"]} type="tel" pattern="[6789][0-9]{7}" title="Зөв дугаар oruulna uu" autoFocus/>
                      </antd_1.Form.Item>
                    </antd_1.Col>
                    <antd_1.Col span={24}>
                      <antd_1.Row gutter={25}>
                        <antd_1.Col span={24}>
                          <antd_1.Form.Item>
                            <antd_1.Button type="primary" htmlType="submit" className={`${login_module_css_1.default["login-button"]} bg-primary`}>
                              Нэг удаагын код авах
                            </antd_1.Button>
                          </antd_1.Form.Item>
                        </antd_1.Col>
                      </antd_1.Row>
                    </antd_1.Col>
                  </antd_1.Row>
                </antd_1.Form>
              </antd_1.Col>
            </antd_1.Row>)}
          {registerData.phone.length > 0 &&
                registerData.tmp_user_id.length > 0 &&
                registerData.username.length > 0 &&
                registerData.pin_code == "" && (<framer_motion_1.motion.div animate={{ x: "0", opacity: 1, scale: 1 }} initial={{ x: "10%", opacity: 0, scale: 0.5 }} transition={{ delay: 0.3 }}>
                <antd_1.Row justify="start" gutter={[0, 25]}>
                  <antd_1.Col span={24}>
                    <div className={login_module_css_1.default["header-text"]}>
                      Утасны дугаар баталгаажуулах
                    </div>
                  </antd_1.Col>
                  <antd_1.Col xs={24} sm={24} md={12} lg={10} xl={8} xxl={6}>
                    <antd_1.Form name="basic" initialValues={{
                    remember: true,
                }} className="login-form" autoComplete="off" layout="vertical" onFinish={onFinishPhoneVer}>
                      <antd_1.Row gutter={[0, 13]}>
                        <antd_1.Col span={24}>
                          <div className={login_module_css_1.default["phone-number-label"]}>
                            Нэг удаагын код оруулах
                          </div>
                        </antd_1.Col>
                        <antd_1.Col span={24}>
                          <antd_1.Form.Item name="pin_code" rules={[
                    {
                        required: true,
                        message: "Нэг удаагын код оруулана уу!",
                    },
                ]}>
                            <antd_1.Input className={login_module_css_1.default["input-style"]} maxLength={4} autoFocus/>
                          </antd_1.Form.Item>
                        </antd_1.Col>

                        <antd_1.Col span={24}>
                          <antd_1.Row gutter={25}>
                            <antd_1.Col span={24}>
                              <antd_1.Form.Item>
                                <antd_1.Button type="primary" htmlType="submit" className={`${login_module_css_1.default["login-button"]} bg-primary`}>
                                  Баталгаажуулах
                                </antd_1.Button>
                              </antd_1.Form.Item>
                            </antd_1.Col>
                          </antd_1.Row>
                        </antd_1.Col>
                      </antd_1.Row>
                    </antd_1.Form>
                  </antd_1.Col>
                </antd_1.Row>
              </framer_motion_1.motion.div>)}
          {registerData.phone.length > 0 &&
                registerData.tmp_user_id.length > 0 &&
                registerData.username.length > 0 &&
                registerData.pin_code.length > 0 &&
                registerData.password == "" && (<framer_motion_1.motion.div animate={{ x: "0", opacity: 1, scale: 1 }} initial={{ x: "10%", opacity: 0, scale: 0.5 }} transition={{ delay: 0.3 }}>
                <antd_1.Row justify="start" gutter={[0, 25]}>
                  <antd_1.Col span={24}>
                    <div className={login_module_css_1.default["header-text"]}>
                      Нэвтрэх нууц үг үүсгэх
                    </div>
                  </antd_1.Col>
                  <antd_1.Col xs={24} sm={24} md={12} lg={10} xl={8} xxl={6}>
                    <antd_1.Form name="basic" initialValues={{
                    remember: true,
                }} className="login-form" autoComplete="off" layout="vertical" onFinish={validatePassword}>
                      <antd_1.Row gutter={[0, 13]}>
                        <antd_1.Col span={24}>
                          <div className={login_module_css_1.default["phone-number-label"]}>
                            Нэвтрэх нууц үг
                          </div>
                        </antd_1.Col>
                        <antd_1.Col span={24}>
                          <antd_1.Form.Item name="prev_password" rules={[
                    {
                        required: true,
                        message: "Нэвтрэх нууц үг оруулна уу!",
                    },
                ]}>
                            <antd_1.Input.Password className={login_module_css_1.default["input-style"]} autoFocus/>
                          </antd_1.Form.Item>
                        </antd_1.Col>
                        <antd_1.Col span={24}>
                          <div className={login_module_css_1.default["phone-number-label"]}>
                            Нэвтрэх нууц үг дахин оруулах
                          </div>
                        </antd_1.Col>
                        <antd_1.Col span={24}>
                          <antd_1.Form.Item name="password" rules={[
                    {
                        required: true,
                        message: "Нэвтрэх нууц үг дахин оруулна уу!",
                    },
                ]}>
                            <antd_1.Input.Password className={login_module_css_1.default["input-style"]}/>
                          </antd_1.Form.Item>
                        </antd_1.Col>
                        <antd_1.Col span={24}>
                          <antd_1.Row gutter={25}>
                            <antd_1.Col span={24}>
                              <antd_1.Button type="primary" htmlType="submit" className={`${login_module_css_1.default["login-button"]} bg-primary`}>
                                Үргэлжлүүлэх
                              </antd_1.Button>
                            </antd_1.Col>
                          </antd_1.Row>
                        </antd_1.Col>
                      </antd_1.Row>
                    </antd_1.Form>
                  </antd_1.Col>
                </antd_1.Row>
              </framer_motion_1.motion.div>)}
          {registerData.phone.length > 0 &&
                registerData.tmp_user_id.length > 0 &&
                registerData.username.length > 0 &&
                registerData.pin_code.length > 0 &&
                registerData.password.length > 0 &&
                registerData.transaction_password == "" && (<framer_motion_1.motion.div animate={{ x: "0", opacity: 1, scale: 1 }} initial={{ x: "10%", opacity: 0, scale: 0.5 }} transition={{ delay: 0.3 }}>
                <antd_1.Row justify="start" gutter={[0, 25]}>
                  <antd_1.Col span={24}>
                    <div className={login_module_css_1.default["header-text"]}>
                      Гүйлгээний нууц үг үүсгэх
                    </div>
                  </antd_1.Col>
                  <antd_1.Col xs={24} sm={24} md={12} lg={10} xl={8} xxl={6}>
                    <antd_1.Form name="basic" initialValues={{
                    remember: true,
                }} className="login-form" autoComplete="off" layout="vertical" onFinish={validateTransactionPassword}>
                      <antd_1.Row gutter={[0, 13]}>
                        <antd_1.Col span={24}>
                          <div className={login_module_css_1.default["phone-number-label"]}>
                            Гүйлгээний нууц үг
                          </div>
                        </antd_1.Col>
                        <antd_1.Col span={24}>
                          <antd_1.Form.Item name="prev_password" rules={[
                    {
                        required: true,
                        message: "Гүйлгээний нууц үг оруулна уу!",
                    },
                ]}>
                            <antd_1.Input.Password className={login_module_css_1.default["input-style"]} autoFocus/>
                          </antd_1.Form.Item>
                        </antd_1.Col>
                        <antd_1.Col span={24}>
                          <div className={login_module_css_1.default["phone-number-label"]}>
                            Гүйлгээний нууц үг дахин оруулах
                          </div>
                        </antd_1.Col>
                        <antd_1.Col span={24}>
                          <antd_1.Form.Item name="password" rules={[
                    {
                        required: true,
                        message: "Гүйлгээний нууц үг дахин оруулна уу!",
                    },
                ]}>
                            <antd_1.Input.Password className={login_module_css_1.default["input-style"]}/>
                          </antd_1.Form.Item>
                        </antd_1.Col>
                        <antd_1.Col span={24}>
                          <antd_1.Row gutter={25}>
                            <antd_1.Col span={24}>
                              <antd_1.Button type="primary" htmlType="submit" className={`${login_module_css_1.default["login-button"]} bg-primary`}>
                                Үргэлжлүүлэх
                              </antd_1.Button>
                            </antd_1.Col>
                          </antd_1.Row>
                        </antd_1.Col>
                      </antd_1.Row>
                    </antd_1.Form>
                  </antd_1.Col>
                </antd_1.Row>
              </framer_motion_1.motion.div>)}
          {registerData.phone.length > 0 &&
                registerData.tmp_user_id.length > 0 &&
                registerData.username.length > 0 &&
                registerData.pin_code.length > 0 &&
                registerData.password.length > 0 &&
                registerData.transaction_password.length > 0 && (<framer_motion_1.motion.div animate={{ x: "0", opacity: 1, scale: 1 }} initial={{ x: "10%", opacity: 0, scale: 0.5 }} transition={{ delay: 0.3 }}>
                <antd_1.Row justify="start" gutter={[0, 25]}>
                  <antd_1.Col span={24}>
                    <div className={login_module_css_1.default["header-text"]}>
                      Нууц асуулт хариулт
                    </div>
                  </antd_1.Col>
                  <antd_1.Col xs={24} sm={24} md={12} lg={10} xl={8} xxl={6}>
                    <antd_1.Form name="basic" initialValues={{
                    remember: true,
                }} className="login-form" autoComplete="off" layout="vertical" onFinish={onFinishQuestion}>
                      <antd_1.Row gutter={[0, 13]}>
                        <antd_1.Col span={24}>
                          <div className={login_module_css_1.default["phone-number-label"]}>
                            Нууц асуулт сонгох
                          </div>
                        </antd_1.Col>
                        <antd_1.Col span={24}>
                          <select className={login_module_css_1.default["input-style"]} style={{ backgroundColor: "white" }} onChange={(e) => setSelectedQuestion(e.target.value)}>
                            <option value={""}>Нууц асуулт сонгон уу!</option>
                            {securityQuestion === null || securityQuestion === void 0 ? void 0 : securityQuestion.security_question_list.map((list, idx) => (<option key={`option ${idx}`} value={`${list.security_question_id}${list.question}`}>
                                  {list.question}
                                </option>))}
                          </select>
                        </antd_1.Col>
                        <antd_1.Col span={24}>
                          <div className={login_module_css_1.default["phone-number-label"]}>
                            Нууц хариулт оруулах
                          </div>
                        </antd_1.Col>
                        <antd_1.Col span={24}>
                          <antd_1.Form.Item name="answer" rules={[
                    {
                        required: true,
                        message: "Нууц хариулт оруулна уу!",
                    },
                ]}>
                            <antd_1.Input className={login_module_css_1.default["input-style"]}/>
                          </antd_1.Form.Item>
                        </antd_1.Col>
                        <antd_1.Col span={24}>
                          <antd_1.Row gutter={25}>
                            <antd_1.Col span={24}>
                              <antd_1.Button type="primary" htmlType="submit" className={`${login_module_css_1.default["login-button"]} bg-primary`}>
                                Үргэлжлүүлэх
                              </antd_1.Button>
                            </antd_1.Col>
                          </antd_1.Row>
                        </antd_1.Col>
                      </antd_1.Row>
                    </antd_1.Form>
                  </antd_1.Col>
                </antd_1.Row>
              </framer_motion_1.motion.div>)}
        </antd_1.Col>
      </antd_1.Row>);
    }
}
exports.default = Signup;

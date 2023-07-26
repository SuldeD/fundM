"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loan = void 0;
const antd_1 = require("antd");
const dloan_module_css_1 = __importDefault(require("../../../styles/dloan.module.css"));
const router_1 = require("next/router");
const react_1 = require("react");
const icons_1 = require("@ant-design/icons");
const number_helpers_1 = require("../../../utils/number.helpers");
const header_1 = require("../../../components/header");
const Loader_1 = require("app/components/Loader");
const dashboardApiContext_1 = require("app/context/dashboardApiContext");
const moment_1 = __importDefault(require("moment"));
const auth_1 = require("app/utils/auth");
const Loan = () => {
    const { loan, data, loanReqMutate, loanReqConfirmMut, accountInfo } = (0, dashboardApiContext_1.useApiContext)();
    (0, auth_1.useRequireAuth)();
    const { error } = antd_1.Modal;
    const [checked, setChecked] = (0, react_1.useState)(false);
    const [requestId, setRequestId] = (0, react_1.useState)();
    const [password, setPassword] = (0, react_1.useState)(null);
    const toggleChecked = () => {
        setChecked(!checked);
    };
    const onChecked = (e) => {
        setChecked(e.target.checked);
    };
    const [activeClass, setActiveClass] = (0, react_1.useState)(true);
    const changeClass = () => {
        setActiveClass(!activeClass);
    };
    const minValue = Number(loan && (loan === null || loan === void 0 ? void 0 : loan.loan_min_amount));
    const maxValue = Number(loan && (loan === null || loan === void 0 ? void 0 : loan.loan_max_amount));
    const rate = loan === null || loan === void 0 ? void 0 : loan.loan_rate_day.slice(0, 4);
    const fee_percent = Number(loan === null || loan === void 0 ? void 0 : loan.fee_percent);
    const [form] = antd_1.Form.useForm();
    const termsRef = (0, react_1.useRef)();
    const router = (0, router_1.useRouter)();
    const [inputValue, setInputValue] = (0, react_1.useState)(minValue);
    const onChange = (newValue) => {
        setInputValue(newValue);
    };
    const [isModalOpen, setIsModalOpen] = (0, react_1.useState)(false);
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
    const [isVerifyOpen, setIsVerifyOpen] = (0, react_1.useState)(false);
    const verifyShowModal = () => {
        setIsVerifyOpen(true);
    };
    const verifyCompleteModal = async () => {
        loanReqConfirmMut({
            request_id: requestId && requestId,
            password: password && password,
        }, {
            onSuccess: (data) => {
                if (data.success) {
                    console.log(data);
                }
                else {
                    console.log("err", data);
                    error({
                        title: "Амжилтгүй",
                        content: <div>{(data === null || data === void 0 ? void 0 : data.description) || null}</div>,
                    });
                }
            },
        });
        setIsVerifyOpen(false);
        completeShowModal();
    };
    const verifyCancelModal = () => {
        setIsVerifyOpen(false);
    };
    const [isCompleteOpen, setIsCompleteOpen] = (0, react_1.useState)(false);
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
    const [activeDuration, setActiveDuration] = (0, react_1.useState)(0);
    const changeActive = (indx) => {
        setActiveDuration(indx);
    };
    function submit() {
        loanReqMutate({
            product_id: (loan === null || loan === void 0 ? void 0 : loan.product_id).toString(),
            loan_amount: inputValue.toString(),
            repayment_amount: ((inputValue / 100) *
                rate *
                // @ts-ignore
                Number(dataTable[activeDuration].day) +
                inputValue +
                (inputValue / 100) *
                    Number(
                    // @ts-ignore
                    dataTable[activeDuration].fee_percent) *
                    // @ts-ignore
                    Number(dataTable[activeDuration].day)).toString(),
            loan_month: (0, moment_1.default)()
                // @ts-ignore
                .add(dataTable[activeDuration].day, "days")
                .calendar()
                .toString(),
        }, {
            onSuccess: (data) => {
                if (data.success) {
                    setRequestId(data === null || data === void 0 ? void 0 : data.request_id);
                    verifyShowModal();
                }
                else {
                    console.log("err", data);
                    error({
                        title: "Амжилтгүй",
                        content: <div>{(data === null || data === void 0 ? void 0 : data.description) || null}</div>,
                    });
                }
            },
        });
    }
    if (!data) {
        return <Loader_1.Loaderr />;
    }
    else {
        return (<antd_1.Row justify="center" className={dloan_module_css_1.default["dloan-main-row"]} gutter={[0, 30]}>
        <antd_1.Col span={22}>
          <antd_1.Row gutter={[0, 20]} justify="center">
            <header_1.HeaderDashboard title={"Зээл авах хүсэлт"} subTitle={activeClass
                ? "Харилцагч та зээлийн эрхийн хэмжээгээ өөрт ойр байрлах салбар нэгжид хандан нээлгэнэ үү."
                : "Харилцагч та миний санхүүжилт цэсээс нийт жагсаалтаа харах боломжтой."}/>
            <antd_1.Row justify="center" gutter={[0, 20]} className={dloan_module_css_1.default[activeClass ? "" : "dloan-change-div"]}>
              <antd_1.Col span={22}>
                <antd_1.Row gutter={[22, 10]} justify="space-between" align="middle">
                  <antd_1.Col span={24}>
                    <div className={dloan_module_css_1.default["dloan-slider-input-title"]}>
                      Зээлийн хэмжээ
                    </div>
                  </antd_1.Col>
                  <antd_1.Col span={8}>
                    <antd_1.InputNumber size="large" min={minValue} max={maxValue} value={inputValue} defaultValue={minValue} 
        // @ts-ignore
        onChange={onChange} formatter={(value) => (0, number_helpers_1.numberToCurrency)(value)} className={dloan_module_css_1.default["dloan-slider-input"]}/>
                  </antd_1.Col>
                  <antd_1.Col span={16}>
                    <antd_1.Row justify="space-between">
                      <antd_1.Col flex="none">
                        <div className={dloan_module_css_1.default["dloan-slider-price"]}>
                          {(0, number_helpers_1.numberToCurrency)(minValue)}
                        </div>
                      </antd_1.Col>
                      <antd_1.Col flex="none">
                        <div className={dloan_module_css_1.default["dloan-slider-price"]}>
                          {(0, number_helpers_1.numberToCurrency)(maxValue)}
                        </div>
                      </antd_1.Col>
                    </antd_1.Row>
                    <antd_1.Slider min={minValue} step={10000} max={maxValue} onChange={onChange} value={typeof inputValue === "number" ? inputValue : 0}/>
                  </antd_1.Col>
                </antd_1.Row>
              </antd_1.Col>
              <antd_1.Col span={22}>
                <antd_1.Row 
        // @ts-ignore
        gutter={[22]}>
                  <antd_1.Col span={8}>
                    <antd_1.Row gutter={[0, 10]}>
                      <antd_1.Col span={24}>
                        <div className={dloan_module_css_1.default["dloan-slider-input-title"]}>
                          Зарласан хүү
                        </div>
                      </antd_1.Col>
                      <antd_1.Col span={24}>
                        <antd_1.Row className={dloan_module_css_1.default["dloan-rate-div"]} align="middle" justify="center">
                          <div className={dloan_module_css_1.default["dloan-rate-text"]}>
                            {loan && (loan === null || loan === void 0 ? void 0 : loan.loan_rate_month.slice(0, 4))}
                          </div>
                        </antd_1.Row>
                      </antd_1.Col>
                    </antd_1.Row>
                  </antd_1.Col>
                  <antd_1.Col span={16}>
                    <antd_1.Row gutter={[0, 10]}>
                      <antd_1.Col span={24}>
                        <div className={dloan_module_css_1.default["dloan-slider-input-title"]}>
                          Хугацаа сонгох
                        </div>
                      </antd_1.Col>

                      <antd_1.Col span={24}>
                        <antd_1.Row wrap={false} gutter={30} align="middle">
                          {dataTable.map((el, idx) => (<antd_1.Col flex="none" key={`data-${idx}`}>
                              <antd_1.Button onClick={() => changeActive(idx)} className={dloan_module_css_1.default[activeDuration === idx
                    ? "dloan-button-active"
                    : "dloan-button"]}>
                                <div className={dloan_module_css_1.default[activeDuration === idx
                    ? "dloan-button-day-text-active"
                    : "dloan-button-day-text"]}>
                                  {el.day}
                                </div>
                                <div className={dloan_module_css_1.default[activeDuration === idx
                    ? "dloan-button-text-active"
                    : "dloan-button-text"]}>
                                  хоног
                                </div>
                              </antd_1.Button>
                            </antd_1.Col>))}
                        </antd_1.Row>
                      </antd_1.Col>
                    </antd_1.Row>
                  </antd_1.Col>
                </antd_1.Row>
              </antd_1.Col>
              <antd_1.Col span={22}>
                <antd_1.Row className={dloan_module_css_1.default["dloan-detail"]} gutter={[0, 22]}>
                  <antd_1.Col span={24}>
                    <antd_1.Row justify="space-between" align="middle">
                      <antd_1.Col flex="none">
                        <div className={dloan_module_css_1.default["dloan-detail-text"]}>
                          Үндсэн зээлийн хэмжээ
                        </div>
                      </antd_1.Col>
                      <antd_1.Col flex="none">
                        <div className={dloan_module_css_1.default["dloan-detail-maxValue"]}>
                          {(0, number_helpers_1.numberToCurrency)(inputValue)}
                        </div>
                      </antd_1.Col>
                    </antd_1.Row>
                  </antd_1.Col>
                  <antd_1.Col span={24}>
                    <antd_1.Row justify="space-between" align="middle">
                      <antd_1.Col flex="none">
                        <div className={dloan_module_css_1.default["dloan-detail-text"]}>
                          Хүүгийн хэмжээ
                        </div>
                      </antd_1.Col>
                      <antd_1.Col flex="none">
                        <div className={dloan_module_css_1.default["dloan-rate-profit"]}>
                          {typeof activeDuration == "number" &&
                (0, number_helpers_1.numberToCurrency)((inputValue / 100) *
                    rate *
                    // @ts-ignore
                    Number(dataTable[activeDuration].day))}
                        </div>
                      </antd_1.Col>
                    </antd_1.Row>
                  </antd_1.Col>
                  <antd_1.Col span={24}>
                    <antd_1.Row justify="space-between" align="middle">
                      <antd_1.Col flex="none">
                        <div className={dloan_module_css_1.default["dloan-detail-text"]}>
                          Зээл олголтын шимтгэл
                        </div>
                      </antd_1.Col>
                      <antd_1.Col flex="none">
                        <div className={dloan_module_css_1.default["dloan-rate-profit"]}>
                          {typeof activeDuration == "number" &&
                // @ts-ignore
                (0, number_helpers_1.numberToCurrency)((inputValue / 100) *
                    // @ts-ignore
                    Number(dataTable[activeDuration].fee_percent) *
                    // @ts-ignore
                    Number(dataTable[activeDuration].day))}
                        </div>
                      </antd_1.Col>
                    </antd_1.Row>
                  </antd_1.Col>
                  <antd_1.Col span={24}>
                    <antd_1.Row justify="space-between" align="middle">
                      <antd_1.Col flex="none">
                        <div className={dloan_module_css_1.default["dloan-detail-text"]}>
                          Нийт төлөх зээлийн хэмжээ
                        </div>
                      </antd_1.Col>
                      <antd_1.Col flex="none">
                        <div className={dloan_module_css_1.default["dloan-detail-maxValue"]}>
                          {typeof activeDuration == "number" &&
                (0, number_helpers_1.numberToCurrency)((inputValue / 100) *
                    rate *
                    // @ts-ignore
                    Number(dataTable[activeDuration].day) +
                    inputValue +
                    (inputValue / 100) *
                        Number(
                        // @ts-ignore
                        dataTable[activeDuration].fee_percent) *
                        // @ts-ignore
                        Number(dataTable[activeDuration].day))}
                        </div>
                      </antd_1.Col>
                    </antd_1.Row>
                  </antd_1.Col>
                  <antd_1.Col span={24}>
                    <antd_1.Row justify="space-between" align="middle">
                      <antd_1.Col flex="none">
                        <div className={dloan_module_css_1.default["dloan-detail-text"]}>
                          Хүүгийн хэмжээ (хоногоор)
                        </div>
                      </antd_1.Col>
                      <antd_1.Col flex="none">
                        <div className={dloan_module_css_1.default["dloan-detail-maxValue"]}>
                          {loan && rate} %
                        </div>
                      </antd_1.Col>
                    </antd_1.Row>
                  </antd_1.Col>
                  <antd_1.Col span={24}>
                    <antd_1.Row justify="space-between" align="middle">
                      <antd_1.Col flex="none">
                        <div className={dloan_module_css_1.default["dloan-detail-text"]}>
                          Хугацаа
                        </div>
                      </antd_1.Col>
                      <antd_1.Col flex="none">
                        <div className={dloan_module_css_1.default["dloan-detail-maxValue"]}>
                          {typeof activeDuration == "number" &&
                // @ts-ignore
                dataTable[activeDuration].day}{" "}
                          хоног
                        </div>
                      </antd_1.Col>
                    </antd_1.Row>
                  </antd_1.Col>
                  <antd_1.Col span={24}>
                    <antd_1.Row justify="space-between" align="middle">
                      <antd_1.Col flex="none">
                        <div className={dloan_module_css_1.default["dloan-detail-text"]}>
                          Эргэн төлөгдөх хугацаа
                        </div>
                      </antd_1.Col>
                      <antd_1.Col flex="none">
                        <div className={dloan_module_css_1.default["dloan-detail-maxValue"]}>
                          {typeof activeDuration == "number" &&
                (0, moment_1.default)()
                    // @ts-ignore
                    .add(dataTable[activeDuration].day, "days")
                    .calendar()}
                        </div>
                      </antd_1.Col>
                    </antd_1.Row>
                  </antd_1.Col>
                </antd_1.Row>
              </antd_1.Col>
              <antd_1.Col span={22}>
                <antd_1.Row gutter={12} align="middle">
                  <antd_1.Col flex="none">
                    <antd_1.Checkbox 
        // @ts-ignore
        ref={termsRef} onChange={onChecked} checked={checked} disabled/>
                  </antd_1.Col>
                  <antd_1.Col flex="none">
                    <div className={dloan_module_css_1.default["dloan-checkbox-text"]}>
                      <a onClick={showModal}>Зээлийн үйлчилгээний нөхцөл</a>
                    </div>
                  </antd_1.Col>
                </antd_1.Row>
              </antd_1.Col>
            </antd_1.Row>
            <antd_1.Row justify="center" gutter={[0, 20]} className={dloan_module_css_1.default[activeClass ? "dloan-change-div" : ""]}>
              <antd_1.Col span={22}>
                <antd_1.Row className={dloan_module_css_1.default["dloan-detail"]} gutter={[0, 22]}>
                  <antd_1.Col span={24}>
                    <antd_1.Row justify="space-between" align="middle">
                      <antd_1.Col flex="none">
                        <div className={dloan_module_css_1.default["dloan-detail-text"]}>
                          Үндсэн зээлийн хэмжээ
                        </div>
                      </antd_1.Col>
                      <antd_1.Col flex="none">
                        <div className={dloan_module_css_1.default["dloan-detail-maxValue"]}>
                          {(0, number_helpers_1.numberToCurrency)(inputValue)}
                        </div>
                      </antd_1.Col>
                    </antd_1.Row>
                  </antd_1.Col>
                  <antd_1.Col span={24}>
                    <antd_1.Row justify="space-between" align="middle">
                      <antd_1.Col flex="none">
                        <div className={dloan_module_css_1.default["dloan-detail-text"]}>
                          Хүүгийн хэмжээ
                        </div>
                      </antd_1.Col>
                      <antd_1.Col flex="none">
                        <div className={dloan_module_css_1.default["dloan-rate-profit"]}>
                          {typeof activeDuration == "number" &&
                (0, number_helpers_1.numberToCurrency)((inputValue / 100) *
                    rate *
                    // @ts-ignore
                    Number(dataTable[activeDuration].day))}
                        </div>
                      </antd_1.Col>
                    </antd_1.Row>
                  </antd_1.Col>
                  <antd_1.Col span={24}>
                    <antd_1.Row justify="space-between" align="middle">
                      <antd_1.Col flex="none">
                        <div className={dloan_module_css_1.default["dloan-detail-text"]}>
                          Зээл олголтын шимтгэл
                        </div>
                      </antd_1.Col>
                      <antd_1.Col flex="none">
                        <div className={dloan_module_css_1.default["dloan-rate-profit"]}>
                          {typeof activeDuration == "number" &&
                (0, number_helpers_1.numberToCurrency)((inputValue / 100) *
                    // @ts-ignore
                    Number(dataTable[activeDuration].fee_percent) *
                    // @ts-ignore
                    Number(dataTable[activeDuration].day))}
                        </div>
                      </antd_1.Col>
                    </antd_1.Row>
                  </antd_1.Col>
                  <antd_1.Col span={24}>
                    <antd_1.Row justify="space-between" align="middle">
                      <antd_1.Col flex="none">
                        <div className={dloan_module_css_1.default["dloan-detail-text"]}>
                          Нийт төлөх зээлийн хэмжээ
                        </div>
                      </antd_1.Col>
                      <antd_1.Col flex="none">
                        <div className={dloan_module_css_1.default["dloan-detail-maxValue"]}>
                          {typeof activeDuration == "number" &&
                (0, number_helpers_1.numberToCurrency)((inputValue / 100) *
                    rate *
                    // @ts-ignore
                    Number(dataTable[activeDuration].day) +
                    inputValue +
                    (inputValue / 100) *
                        Number(
                        // @ts-ignore
                        dataTable[activeDuration].fee_percent) *
                        // @ts-ignore
                        Number(dataTable[activeDuration].day))}
                        </div>
                      </antd_1.Col>
                    </antd_1.Row>
                  </antd_1.Col>
                  <antd_1.Col span={24}>
                    <antd_1.Row justify="space-between" align="middle">
                      <antd_1.Col flex="none">
                        <div className={dloan_module_css_1.default["dloan-detail-text"]}>
                          Хүүгийн хэмжээ (хоногоор)
                        </div>
                      </antd_1.Col>
                      <antd_1.Col flex="none">
                        <div className={dloan_module_css_1.default["dloan-detail-maxValue"]}>
                          {rate} %
                        </div>
                      </antd_1.Col>
                    </antd_1.Row>
                  </antd_1.Col>
                  <antd_1.Col span={24}>
                    <antd_1.Row justify="space-between" align="middle">
                      <antd_1.Col flex="none">
                        <div className={dloan_module_css_1.default["dloan-detail-text"]}>
                          Хугацаа
                        </div>
                      </antd_1.Col>
                      <antd_1.Col flex="none">
                        <div className={dloan_module_css_1.default["dloan-detail-maxValue"]}>
                          {typeof activeDuration == "number" &&
                // @ts-ignore
                dataTable[activeDuration].day}{" "}
                          хоног
                        </div>
                      </antd_1.Col>
                    </antd_1.Row>
                  </antd_1.Col>
                  <antd_1.Col span={24}>
                    <antd_1.Row justify="space-between" align="middle">
                      <antd_1.Col flex="none">
                        <div className={dloan_module_css_1.default["dloan-detail-text"]}>
                          Эргэн төлөгдөх хугацаа
                        </div>
                      </antd_1.Col>
                      <antd_1.Col flex="none">
                        <div className={dloan_module_css_1.default["dloan-detail-maxValue"]}>
                          {typeof activeDuration == "number" &&
                (0, moment_1.default)()
                    // @ts-ignore
                    .add(dataTable[activeDuration].day, "days")
                    .calendar()}
                        </div>
                      </antd_1.Col>
                    </antd_1.Row>
                  </antd_1.Col>
                </antd_1.Row>
              </antd_1.Col>
              <antd_1.Col span={22}>
                <antd_1.Row gutter={[0, 10]} justify="center" className={dloan_module_css_1.default["dloan-border-div"]}>
                  <antd_1.Col span={24}>
                    <div className={dloan_module_css_1.default["dloan-change-title"]}>
                      Зээлийн гэрээ
                    </div>
                  </antd_1.Col>
                  <antd_1.Col span={24}>
                    <div className={dloan_module_css_1.default["dloan-contract-text"]}>
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
                  </antd_1.Col>
                </antd_1.Row>
              </antd_1.Col>
            </antd_1.Row>
          </antd_1.Row>
        </antd_1.Col>
        <antd_1.Col span={22}>
          <antd_1.Row justify={"center"} align="bottom" style={{ height: "100%" }} className={dloan_module_css_1.default[activeClass ? "" : "dloan-change-div"]}>
            <antd_1.Col span={22}>
              <antd_1.Row justify="space-between" align="middle">
                <antd_1.Col flex="none">
                  <antd_1.Button className={dloan_module_css_1.default["dloan-button-back"]} onClick={() => router.back()}>
                    <antd_1.Row align="middle">
                      <antd_1.Col flex="none">{<icons_1.LeftOutlined />}</antd_1.Col>
                      <antd_1.Col flex={"auto"}>
                        <div className={dloan_module_css_1.default["dloan-button-back-text"]}>
                          Буцах
                        </div>
                      </antd_1.Col>
                    </antd_1.Row>
                  </antd_1.Button>
                </antd_1.Col>
                <antd_1.Col flex="none">
                  <antd_1.Button type="primary" className={`${dloan_module_css_1.default["dloan-button-contiune"]} bg-primary`} onClick={() => {
                var _a;
                // @ts-ignore
                ((_a = termsRef.current) === null || _a === void 0 ? void 0 : _a.input.checked)
                    ? !accountInfo.bank_account
                        ? error({
                            title: "Амжилтгүй",
                            content: (<div>Та хувийн мэдээлэлээ оруулах хэрэгтэй</div>),
                        }) &&
                            // @ts-ignore
                            router.push("/dashboard/profile/bank")
                        : submit()
                    : showModal();
            }}>
                    <icons_1.CalculatorOutlined />
                    Үргэлжлүүлэх
                  </antd_1.Button>
                </antd_1.Col>
              </antd_1.Row>
              <antd_1.Modal centered closable={false} width="50%" title={<div className={dloan_module_css_1.default["dloan-modal-title"]}>
                    Зээл авах хүсэлт нөхцөл
                  </div>} open={isModalOpen} footer={null}>
                <antd_1.Row justify="center">
                  <antd_1.Col>
                    <antd_1.Col span={24} className={dloan_module_css_1.default["dloan-modal-content-div"]}>
                      <div className={dloan_module_css_1.default["dloan-modal-content-text"]}>
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
                    </antd_1.Col>
                    <antd_1.Form form={form}>
                      <antd_1.Row justify="center" gutter={[0, 10]}>
                        <antd_1.Col span={24}>
                          <antd_1.Form.Item name="agreement" valuePropName="checked" rules={[
                {
                    validator: (_, value) => value
                        ? Promise.resolve()
                        : Promise.reject(new Error("Та үйлчилгээний нөхцөл зөвшөөрөөгүй байна.")),
                },
            ]}>
                            <antd_1.Checkbox>
                              <div className={dloan_module_css_1.default["dloan-checkbox-text"]}>
                                Зээлийн үйлчилгээний нөхцөл
                              </div>
                            </antd_1.Checkbox>
                          </antd_1.Form.Item>
                        </antd_1.Col>
                        <antd_1.Col span={24}>
                          <antd_1.Row justify="space-between">
                            <antd_1.Col flex="none">
                              <antd_1.Button className={dloan_module_css_1.default["dloan-button-back"]} onClick={handleCancel}>
                                <div className={dloan_module_css_1.default["dloan-button-back-text"]}>
                                  Буцах
                                </div>
                              </antd_1.Button>
                            </antd_1.Col>
                            <antd_1.Col flex="none">
                              <antd_1.Form.Item>
                                <antd_1.Button type="primary" className={`${dloan_module_css_1.default["dloan-button-contiune"]} bg-primary`} onClick={handleOk} htmlType="submit">
                                  <icons_1.CalculatorOutlined />
                                  Үргэлжлүүлэх
                                </antd_1.Button>
                              </antd_1.Form.Item>
                            </antd_1.Col>
                          </antd_1.Row>
                        </antd_1.Col>
                      </antd_1.Row>
                    </antd_1.Form>
                  </antd_1.Col>
                </antd_1.Row>
              </antd_1.Modal>
              <antd_1.Modal centered width={378} title={<div className={dloan_module_css_1.default["dloan-modal-verify-title"]}>
                    <antd_1.Image width="50%" src={"/logo.svg"} preview={false} alt="Header Logo"/>
                  </div>} onCancel={verifyCancelModal} open={isVerifyOpen} footer={null}>
                <antd_1.Row justify="center">
                  <antd_1.Col span={20}>
                    <antd_1.Row justify="center" gutter={[0, 20]}>
                      <antd_1.Col span={24}>
                        <antd_1.Input.Password className={dloan_module_css_1.default["dloan-modal-verify-input"]} placeholder="FundMe кодоо оруулна уу!!!" 
        // @ts-ignore
        onChange={(e) => setPassword(e.target.value)} maxLength={4} autoFocus/>
                      </antd_1.Col>
                      <antd_1.Col span={20}>
                        <div className={dloan_module_css_1.default["dloan-modal-content-text"]}>
                          Харилцагч та зээлийн эрхийн хэмжээгээ өөрт ойр байрлах
                          салбар нэгжид хандан нээлгэнэ үү.
                        </div>
                      </antd_1.Col>
                      <antd_1.Col span={20}>
                        <antd_1.Button type="primary" className={dloan_module_css_1.default["dloan-modal-verify-button"]} onClick={verifyCompleteModal}>
                          Баталгаажуулах
                        </antd_1.Button>
                      </antd_1.Col>
                    </antd_1.Row>
                  </antd_1.Col>
                </antd_1.Row>
              </antd_1.Modal>

              <antd_1.Modal centered width={378} title={null} onCancel={completeCancelModal} open={isCompleteOpen} footer={null}>
                <antd_1.Row justify="center" gutter={[0, 30]} style={{ padding: "50px 0" }}>
                  <antd_1.Col span={24}>
                    <antd_1.Row justify="center">
                      <antd_1.Image width={56} src={"/images/check.svg"} preview={false} alt="Header Logo"/>
                    </antd_1.Row>
                  </antd_1.Col>
                  <antd_1.Col span={16}>
                    <div className={dloan_module_css_1.default["dloan-modal-complete-text"]}>
                      Таны{" "}
                      <span className={dloan_module_css_1.default["dloan-rate-profit"]}>
                        {(0, number_helpers_1.numberToCurrency)(inputValue)}
                      </span>{" "}
                      төгрөг{" "}
                      <span className={dloan_module_css_1.default["dloan-modal-complete-number"]}>
                        {typeof activeDuration == "number" &&
                // @ts-ignore
                dataTable[activeDuration].day}
                      </span>{" "}
                      хоногийн хугацаатай{" "}
                      <span className={dloan_module_css_1.default["dloan-modal-complete-number"]}>
                        {rate}
                      </span>{" "}
                      хувийн өгөөжтэй санхүүжилт өгөх хүсэлт амжилттай
                      бүртгэгдлээ.
                    </div>
                  </antd_1.Col>
                </antd_1.Row>
              </antd_1.Modal>
            </antd_1.Col>
          </antd_1.Row>
          <antd_1.Row justify={"center"} align="bottom" style={{ height: "100%" }} className={dloan_module_css_1.default[activeClass ? "dloan-change-div" : ""]}>
            <antd_1.Col span={22}>
              <antd_1.Row align="middle">
                <antd_1.Col flex="none">
                  <antd_1.Button className={dloan_module_css_1.default["dloan-button-back"]} onClick={() => router.push("/dashboard/myfund")}>
                    <antd_1.Col flex={"auto"}>
                      <div className={dloan_module_css_1.default["dloan-change-button-text"]}>
                        Хаах
                      </div>
                    </antd_1.Col>
                  </antd_1.Button>
                </antd_1.Col>
              </antd_1.Row>
            </antd_1.Col>
          </antd_1.Row>
        </antd_1.Col>
      </antd_1.Row>);
    }
};
exports.Loan = Loan;
exports.default = exports.Loan;

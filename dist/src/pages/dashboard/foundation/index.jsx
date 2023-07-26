"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Foundation = void 0;
const antd_1 = require("antd");
const foundation_module_css_1 = __importDefault(require("../../../styles/foundation.module.css"));
const router_1 = require("next/router");
const react_1 = require("react");
const icons_1 = require("@ant-design/icons");
const number_helpers_1 = require("../../../utils/number.helpers");
const header_1 = require("../../../components/header");
const Loader_1 = require("app/components/Loader");
const dashboardApiContext_1 = require("app/context/dashboardApiContext");
const auth_1 = require("app/utils/auth");
const moment_1 = __importDefault(require("moment"));
const Foundation = () => {
    const [checked, setChecked] = (0, react_1.useState)(false);
    const toggleChecked = () => {
        setChecked(!checked);
    };
    const { data, saving } = (0, dashboardApiContext_1.useApiContext)();
    (0, auth_1.useRequireAuth)();
    // @ts-ignore
    const onChecked = (e) => {
        setChecked(e.target.checked);
    };
    const [activeClass, setActiveClass] = (0, react_1.useState)(true);
    const changeClass = () => {
        setActiveClass(!activeClass);
        setChecked(!checked);
    };
    const minValue = Number(saving && (saving === null || saving === void 0 ? void 0 : saving.loan_min_amount));
    const maxValue = Number(saving && (saving === null || saving === void 0 ? void 0 : saving.loan_max_amount));
    const rate = saving === null || saving === void 0 ? void 0 : saving.loan_rate_month.slice(0, 4);
    const [form] = antd_1.Form.useForm();
    const termsRef = (0, react_1.useRef)();
    const router = (0, router_1.useRouter)();
    const [inputValue, setInputValue] = (0, react_1.useState)(minValue);
    // @ts-ignore
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
        await setIsVerifyOpen(false);
        completeShowModal();
    };
    const verifyCancelModal = () => {
        setIsVerifyOpen(false);
    };
    const [isCompleteOpen, setIsCompleteOpen] = (0, react_1.useState)(false);
    const completeShowModal = () => {
        setIsCompleteOpen(true);
    };
    const completeCancelModal = () => {
        setIsCompleteOpen(false);
        changeClass();
    };
    const dataTable = [
        {
            id: 1,
            day: "7",
        },
        {
            id: 2,
            day: "14",
        },
        {
            id: 3,
            day: "21",
        },
        {
            id: 4,
            day: "28",
        },
    ];
    const [activeDuration, setActiveDuration] = (0, react_1.useState)(0);
    // @ts-ignore
    const changeActive = (indx) => {
        setActiveDuration(indx);
    };
    if (!data) {
        <Loader_1.Loaderr />;
    }
    else {
        return (<antd_1.Row justify="center" className={foundation_module_css_1.default["foundation-main-row"]} gutter={[0, 30]}>
        <antd_1.Col span={22}>
          <antd_1.Row gutter={[0, 20]} justify="center">
            <header_1.HeaderDashboard title={"Санхүүжилт өгөх хүсэлт"} subTitle={activeClass
                ? "Харилцагч та зээлийн эрхийн хэмжээгээ өөрт ойр байрлах салбар нэгжид хандан нээлгэнэ үү."
                : "Харилцагч та миний санхүүжилт цэсээс нийт жагсаалтаа харах боломжтой."}/>
            <antd_1.Row justify="center" gutter={[0, 20]} className={foundation_module_css_1.default[activeClass ? "" : "foundation-change-div"]}>
              <antd_1.Col span={22}>
                <antd_1.Row gutter={[22, 10]} justify="space-between" align="middle">
                  <antd_1.Col span={24}>
                    <div className={foundation_module_css_1.default["foundation-slider-input-title"]}>
                      Санхүүжилт өгөх хэмжээ
                    </div>
                  </antd_1.Col>
                  <antd_1.Col span={8}>
                    <antd_1.InputNumber size="large" min={minValue} max={maxValue} value={inputValue} defaultValue={minValue} onChange={onChange} formatter={(value) => (0, number_helpers_1.numberToCurrency)(value)} className={foundation_module_css_1.default["foundation-slider-input"]}/>
                  </antd_1.Col>
                  <antd_1.Col span={16}>
                    <antd_1.Row justify="space-between">
                      <antd_1.Col flex="none">
                        <div className={foundation_module_css_1.default["foundation-slider-price"]}>
                          {(0, number_helpers_1.numberToCurrency)(minValue)}
                        </div>
                      </antd_1.Col>
                      <antd_1.Col flex="none">
                        <div className={foundation_module_css_1.default["foundation-slider-price"]}>
                          {(0, number_helpers_1.numberToCurrency)(maxValue)}
                        </div>
                      </antd_1.Col>
                    </antd_1.Row>
                    <antd_1.Slider min={minValue} max={maxValue} onChange={onChange} value={typeof inputValue === "number" ? inputValue : 0} step={100000}/>
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
                        <div className={foundation_module_css_1.default["foundation-slider-input-title"]}>
                          Зарласан хүү
                        </div>
                      </antd_1.Col>
                      <antd_1.Col span={24}>
                        <antd_1.Row className={foundation_module_css_1.default["foundation-rate-div"]} align="middle" justify="center">
                          <div className={foundation_module_css_1.default["foundation-rate-text"]}>
                            {rate}
                          </div>
                        </antd_1.Row>
                      </antd_1.Col>
                    </antd_1.Row>
                  </antd_1.Col>
                  <antd_1.Col span={16}>
                    <antd_1.Row gutter={[0, 10]}>
                      <antd_1.Col span={24}>
                        <div className={foundation_module_css_1.default["foundation-slider-input-title"]}>
                          Хугацаа сонгох
                        </div>
                      </antd_1.Col>

                      <antd_1.Col span={24}>
                        <antd_1.Row wrap={false} gutter={30} align="middle">
                          {dataTable.map((el, idx) => (<antd_1.Col flex="none" key={`data-${idx}`}>
                              <antd_1.Button onClick={() => changeActive(idx)} className={foundation_module_css_1.default[activeDuration === idx
                    ? "foundation-button-active"
                    : "foundation-button"]}>
                                <div className={foundation_module_css_1.default[activeDuration === idx
                    ? "foundation-button-day-text-active"
                    : "foundation-button-day-text"]}>
                                  {el.day}
                                </div>
                                <div className={foundation_module_css_1.default[activeDuration === idx
                    ? "foundation-button-text-active"
                    : "foundation-button-text"]}>
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
                <antd_1.Row className={foundation_module_css_1.default["foundation-detail"]} gutter={[0, 22]}>
                  <antd_1.Col span={24}>
                    <antd_1.Row justify="space-between" align="middle">
                      <antd_1.Col flex="none">
                        <div className={foundation_module_css_1.default["foundation-detail-text"]}>
                          Санхүүжилтын хэмжээ
                        </div>
                      </antd_1.Col>
                      <antd_1.Col flex="none">
                        <div className={foundation_module_css_1.default["foundation-detail-maxValue"]}>
                          {(0, number_helpers_1.numberToCurrency)(inputValue)}
                        </div>
                      </antd_1.Col>
                    </antd_1.Row>
                  </antd_1.Col>
                  <antd_1.Col span={24}>
                    <antd_1.Row justify="space-between" align="middle">
                      <antd_1.Col flex="none">
                        <div className={foundation_module_css_1.default["foundation-detail-text"]}>
                          Хүүгийн ашиг:
                        </div>
                      </antd_1.Col>
                      <antd_1.Col flex="none">
                        <div className={foundation_module_css_1.default["foundation-rate-profit"]}>
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
                        <div className={foundation_module_css_1.default["foundation-detail-text"]}>
                          Хүүгийн хэмжээ (хоногоор)
                        </div>
                      </antd_1.Col>
                      <antd_1.Col flex="none">
                        <div className={foundation_module_css_1.default["foundation-detail-maxValue"]}>
                          {saving === null || saving === void 0 ? void 0 : saving.loan_rate_day.slice(0, 4)} %
                        </div>
                      </antd_1.Col>
                    </antd_1.Row>
                  </antd_1.Col>
                  <antd_1.Col span={24}>
                    <antd_1.Row justify="space-between" align="middle">
                      <antd_1.Col flex="none">
                        <div className={foundation_module_css_1.default["foundation-detail-text"]}>
                          Хугацаа
                        </div>
                      </antd_1.Col>
                      <antd_1.Col flex="none">
                        <div className={foundation_module_css_1.default["foundation-detail-maxValue"]}>
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
                        <div className={foundation_module_css_1.default["foundation-detail-text"]}>
                          Эргэн төлөгдөх хугацаа
                        </div>
                      </antd_1.Col>
                      <antd_1.Col flex="none">
                        <div className={foundation_module_css_1.default["foundation-detail-maxValue"]}>
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
                    <div className={foundation_module_css_1.default["foundation-checkbox-text"]}>
                      <a onClick={showModal}>Зээлийн үйлчилгээний нөхцөл</a>
                    </div>
                  </antd_1.Col>
                </antd_1.Row>
              </antd_1.Col>
            </antd_1.Row>
            <antd_1.Row justify="center" gutter={[0, 25]} className={foundation_module_css_1.default[activeClass ? "foundation-change-div" : ""]}>
              <antd_1.Col span={22}>
                <antd_1.Row className={foundation_module_css_1.default["foundation-detail"]} gutter={[0, 22]}>
                  <antd_1.Col span={24}>
                    <antd_1.Row justify="space-between" align="middle">
                      <antd_1.Col flex="none">
                        <div className={foundation_module_css_1.default["foundation-detail-text"]}>
                          Санхүүжилтын хэмжээ
                        </div>
                      </antd_1.Col>
                      <antd_1.Col flex="none">
                        <div className={foundation_module_css_1.default["foundation-detail-maxValue"]}>
                          {(0, number_helpers_1.numberToCurrency)(inputValue)}
                        </div>
                      </antd_1.Col>
                    </antd_1.Row>
                  </antd_1.Col>
                  <antd_1.Col span={24}>
                    <antd_1.Row justify="space-between" align="middle">
                      <antd_1.Col flex="none">
                        <div className={foundation_module_css_1.default["foundation-detail-text"]}>
                          Хүүгийн ашиг:
                        </div>
                      </antd_1.Col>
                      <antd_1.Col flex="none">
                        <div className={foundation_module_css_1.default["foundation-rate-profit"]}>
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
                        <div className={foundation_module_css_1.default["foundation-detail-text"]}>
                          Хүүгийн хэмжээ (хоногоор)
                        </div>
                      </antd_1.Col>
                      <antd_1.Col flex="none">
                        <div className={foundation_module_css_1.default["foundation-detail-maxValue"]}>
                          {saving === null || saving === void 0 ? void 0 : saving.loan_rate_day.slice(0, 4)} %
                        </div>
                      </antd_1.Col>
                    </antd_1.Row>
                  </antd_1.Col>
                  <antd_1.Col span={24}>
                    <antd_1.Row justify="space-between" align="middle">
                      <antd_1.Col flex="none">
                        <div className={foundation_module_css_1.default["foundation-detail-text"]}>
                          Хугацаа
                        </div>
                      </antd_1.Col>
                      <antd_1.Col flex="none">
                        <div className={foundation_module_css_1.default["foundation-detail-maxValue"]}>
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
                        <div className={foundation_module_css_1.default["foundation-detail-text"]}>
                          Эргэн төлөгдөх хугацаа
                        </div>
                      </antd_1.Col>
                      <antd_1.Col flex="none">
                        <div className={foundation_module_css_1.default["foundation-detail-maxValue"]}>
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
                <antd_1.Row gutter={[0, 10]} justify="center" className={foundation_module_css_1.default["foundation-border-div"]}>
                  <antd_1.Col span={24}>
                    <div className={foundation_module_css_1.default["foundation-change-title"]}>
                      Зээлийн гэрээ
                    </div>
                  </antd_1.Col>
                  <antd_1.Col span={24}>
                    <div className={foundation_module_css_1.default["foundation-contract-text"]}>
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
          <antd_1.Row justify={"center"} align="bottom" style={{ height: "100%" }} className={foundation_module_css_1.default[activeClass ? "" : "foundation-change-div"]}>
            <antd_1.Col span={22}>
              <antd_1.Row justify="space-between" align="middle">
                <antd_1.Col flex="none">
                  <antd_1.Button className={foundation_module_css_1.default["foundation-button-back"]} onClick={() => router.back()}>
                    <antd_1.Row align="middle">
                      <antd_1.Col flex="none">{<icons_1.LeftOutlined />}</antd_1.Col>
                      <antd_1.Col flex={"auto"}>
                        <div className={foundation_module_css_1.default["foundation-button-back-text"]}>
                          Буцах
                        </div>
                      </antd_1.Col>
                    </antd_1.Row>
                  </antd_1.Button>
                </antd_1.Col>
                <antd_1.Col flex="none">
                  <antd_1.Button type="primary" className={`${foundation_module_css_1.default["foundation-button-contiune"]} bg-primary`} onClick={() => {
                var _a;
                // @ts-ignore
                return ((_a = termsRef.current) === null || _a === void 0 ? void 0 : _a.input.checked)
                    ? verifyShowModal()
                    : showModal();
            }}>
                    <icons_1.CalculatorOutlined />
                    Үргэлжлүүлэх
                  </antd_1.Button>
                </antd_1.Col>
              </antd_1.Row>
              <antd_1.Modal centered closable={false} width="50%" title={<div className={foundation_module_css_1.default["foundation-modal-title"]}>
                    Зээл авах хүсэлт нөхцөл
                  </div>} open={isModalOpen} footer={null}>
                <antd_1.Row justify="center">
                  <antd_1.Col>
                    <antd_1.Col span={24} className={foundation_module_css_1.default["foundation-modal-content-div"]}>
                      <div className={foundation_module_css_1.default["foundation-modal-content-text"]}>
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
                              <div className={foundation_module_css_1.default["foundation-checkbox-text"]}>
                                Зээлийн үйлчилгээний нөхцөл
                              </div>
                            </antd_1.Checkbox>
                          </antd_1.Form.Item>
                        </antd_1.Col>
                        <antd_1.Col span={24}>
                          <antd_1.Row justify="space-between">
                            <antd_1.Col flex="none">
                              <antd_1.Button className={foundation_module_css_1.default["foundation-button-back"]} onClick={handleCancel}>
                                <div className={foundation_module_css_1.default["foundation-button-back-text"]}>
                                  Буцах
                                </div>
                              </antd_1.Button>
                            </antd_1.Col>
                            <antd_1.Col flex="none">
                              <antd_1.Form.Item>
                                <antd_1.Button type="primary" className={`${foundation_module_css_1.default["foundation-button-contiune"]} bg-primary`} onClick={handleOk} htmlType="submit">
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
              <antd_1.Modal centered width={378} title={<div className={foundation_module_css_1.default["foundation-modal-verify-title"]}>
                    <antd_1.Image width="50%" src={"/logo.svg"} preview={false} alt="Header Logo"/>
                  </div>} onCancel={verifyCancelModal} open={isVerifyOpen} footer={null}>
                <antd_1.Row justify="center">
                  <antd_1.Col span={20}>
                    <antd_1.Row justify="center" gutter={[0, 20]}>
                      <antd_1.Col span={24}>
                        <antd_1.Input.Password className={foundation_module_css_1.default["foundation-modal-verify-input"]} placeholder="FundMe кодоо оруулна уу!!!"/>
                      </antd_1.Col>
                      <antd_1.Col span={20}>
                        <div className={foundation_module_css_1.default["foundation-modal-content-text"]}>
                          Харилцагч та зээлийн эрхийн хэмжээгээ өөрт ойр байрлах
                          салбар нэгжид хандан нээлгэнэ үү.
                        </div>
                      </antd_1.Col>
                      <antd_1.Col span={20}>
                        <antd_1.Button type="primary" className={foundation_module_css_1.default["foundation-modal-verify-button"]} onClick={verifyCompleteModal}>
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
                    <div className={foundation_module_css_1.default["foundation-modal-complete-text"]}>
                      Таны
                      <span className={foundation_module_css_1.default["foundation-rate-profit"]}>
                        {" "}
                        {(0, number_helpers_1.numberToCurrency)(inputValue)}{" "}
                      </span>
                      төгрөг
                      <span className={foundation_module_css_1.default["foundation-modal-complete-number"]}>
                        {" "}
                        {typeof activeDuration == "number" &&
                // @ts-ignore
                dataTable[activeDuration].day}{" "}
                      </span>
                      хоногийн хугацаатай{" "}
                      <span className={foundation_module_css_1.default["foundation-modal-complete-number"]}>
                        {" "}
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
          <antd_1.Row justify={"center"} align="bottom" style={{ height: "100%" }} className={foundation_module_css_1.default[activeClass ? "foundation-change-div" : ""]}>
            <antd_1.Col span={22}>
              <antd_1.Row>
                <antd_1.Col flex="none">
                  <antd_1.Button className={foundation_module_css_1.default["foundation-button-back"]} onClick={() => router.push("/dashboard/myfund")}>
                    <div className={foundation_module_css_1.default["foundation-change-button-text"]}>
                      Хаах
                    </div>
                  </antd_1.Button>
                </antd_1.Col>
              </antd_1.Row>
            </antd_1.Col>
          </antd_1.Row>
        </antd_1.Col>
      </antd_1.Row>);
    }
};
exports.Foundation = Foundation;
exports.default = exports.Foundation;
